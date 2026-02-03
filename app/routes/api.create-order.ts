import {json, type ActionArgs} from '@shopify/remix-oxygen';
import Stripe from 'stripe';

interface LineItem {
  variantId: string;
  quantity: number;
  title: string;
  price: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone?: string;
}

interface CreateOrderRequest {
  lineItems: LineItem[];
  shippingAddress: ShippingAddress;
  email: string;
  paymentIntentId: string;
  total: number;
  cartId?: string;
}

// Idempotency tracking (in production, use a database)
const processedOrders = new Set<string>();

export async function action({request, context}: ActionArgs) {
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {env} = context;

  // Debug logging
  console.log('CREATE-ORDER: env keys:', Object.keys(env));
  console.log('CREATE-ORDER: PUBLIC_STORE_DOMAIN:', env.PUBLIC_STORE_DOMAIN);
  console.log('CREATE-ORDER: SHOPIFY_ADMIN_ACCESS_TOKEN exists:', !!env.SHOPIFY_ADMIN_ACCESS_TOKEN);

  // Check required configuration
  if (!env.STRIPE_SECRET_KEY) {
    return json({error: 'Stripe is not configured'}, {status: 500});
  }

  if (!env.SHOPIFY_ADMIN_ACCESS_TOKEN) {
    return json({error: 'Shopify Admin API is not configured'}, {status: 500});
  }

  if (!env.PUBLIC_STORE_DOMAIN) {
    return json({error: 'Store domain is not configured'}, {status: 500});
  }

  try {
    const body: CreateOrderRequest = await request.json();
    const {lineItems, shippingAddress, email, paymentIntentId, total, cartId} = body;

    // Validate required fields
    if (!lineItems?.length || !email || !paymentIntentId || !shippingAddress) {
      return json({error: 'Missing required fields'}, {status: 400});
    }

    // Idempotency check
    if (processedOrders.has(paymentIntentId)) {
      return json({error: 'Order already processed'}, {status: 409});
    }

    // Initialize Stripe
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Verify payment succeeded
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return json(
        {error: `Payment not completed. Status: ${paymentIntent.status}`},
        {status: 400},
      );
    }

    // Verify amount matches (within tolerance for rounding)
    const expectedAmount = Math.round(total * 100);
    if (Math.abs(paymentIntent.amount - expectedAmount) > 1) {
      return json({error: 'Payment amount mismatch'}, {status: 400});
    }

    // Create Shopify draft order via Admin API
    const draftOrder = await createShopifyDraftOrder({
      env,
      lineItems,
      shippingAddress,
      email,
      paymentIntentId,
    });

    if (!draftOrder) {
      return json({error: 'Failed to create draft order'}, {status: 500});
    }

    // Complete the draft order (mark as paid)
    const completedOrder = await completeShopifyDraftOrder({
      env,
      draftOrderId: draftOrder.id,
    });

    if (!completedOrder) {
      return json({error: 'Failed to complete order'}, {status: 500});
    }

    // Mark as processed
    processedOrders.add(paymentIntentId);

    return json({
      success: true,
      order: {
        id: completedOrder.id,
        name: completedOrder.name,
        total: completedOrder.totalPrice,
        email: completedOrder.email,
      },
    });
  } catch (error) {
    console.error('Order creation failed:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return json({error: `Stripe error: ${error.message}`}, {status: 400});
    }

    return json({error: 'Failed to create order'}, {status: 500});
  }
}

async function createShopifyDraftOrder({
  env,
  lineItems,
  shippingAddress,
  email,
  paymentIntentId,
}: {
  env: Env;
  lineItems: LineItem[];
  shippingAddress: ShippingAddress;
  email: string;
  paymentIntentId: string;
}) {
  // Use dedicated admin store domain (Gallery Store) instead of PUBLIC_STORE_DOMAIN (mock.shop)
  const shopDomain = env.SHOPIFY_ADMIN_STORE_DOMAIN || env.PUBLIC_STORE_DOMAIN;
  const adminToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  // Convert line items to Shopify format
  const shopifyLineItems = lineItems.map((item) => ({
    variant_id: extractNumericId(item.variantId),
    quantity: item.quantity,
  }));

  const draftOrderData = {
    draft_order: {
      line_items: shopifyLineItems,
      email,
      shipping_address: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || '',
        city: shippingAddress.city,
        province: shippingAddress.province,
        country: shippingAddress.country,
        zip: shippingAddress.zip,
        phone: shippingAddress.phone || '',
      },
      billing_address: {
        first_name: shippingAddress.firstName,
        last_name: shippingAddress.lastName,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || '',
        city: shippingAddress.city,
        province: shippingAddress.province,
        country: shippingAddress.country,
        zip: shippingAddress.zip,
        phone: shippingAddress.phone || '',
      },
      note: `Stripe Payment Intent: ${paymentIntentId}`,
      tags: 'stripe-checkout, hydrogen-vercel-fresh',
    },
  };

  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-01/draft_orders.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken!,
        },
        body: JSON.stringify(draftOrderData),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Draft order creation failed:', errorText);
      return null;
    }

    const data = await response.json();
    return data.draft_order;
  } catch (error) {
    console.error('Draft order API error:', error);
    return null;
  }
}

async function completeShopifyDraftOrder({
  env,
  draftOrderId,
}: {
  env: Env;
  draftOrderId: number;
}) {
  // Use dedicated admin store domain (Gallery Store) instead of PUBLIC_STORE_DOMAIN (mock.shop)
  const shopDomain = env.SHOPIFY_ADMIN_STORE_DOMAIN || env.PUBLIC_STORE_DOMAIN;
  const adminToken = env.SHOPIFY_ADMIN_ACCESS_TOKEN;

  try {
    const response = await fetch(
      `https://${shopDomain}/admin/api/2024-01/draft_orders/${draftOrderId}/complete.json`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminToken!,
        },
        body: JSON.stringify({
          payment_pending: false,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Draft order completion failed:', errorText);
      return null;
    }

    const data = await response.json();
    return data.draft_order;
  } catch (error) {
    console.error('Draft order completion API error:', error);
    return null;
  }
}

/**
 * Extract numeric ID from Shopify global ID
 * e.g., "gid://shopify/ProductVariant/12345" -> 12345
 */
function extractNumericId(globalId: string): number {
  const match = globalId.match(/\/(\d+)$/);
  return match ? parseInt(match[1], 10) : 0;
}

export function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
