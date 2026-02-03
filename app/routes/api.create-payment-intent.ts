import {json, type ActionArgs} from '@shopify/remix-oxygen';
import Stripe from 'stripe';

interface PaymentIntentRequest {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export async function action({request, context}: ActionArgs) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return json({error: 'Method not allowed'}, {status: 405});
  }

  const {env} = context;

  // Check if Stripe is configured
  if (!env.STRIPE_SECRET_KEY) {
    return json(
      {error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment.'},
      {status: 500},
    );
  }

  try {
    const body: PaymentIntentRequest = await request.json();
    const {amount, currency = 'usd', metadata = {}} = body;

    // Validate amount
    if (!amount || amount <= 0) {
      return json({error: 'Invalid amount'}, {status: 400});
    }

    // Amount should be in cents for Stripe
    const amountInCents = Math.round(amount * 100);

    // Initialize Stripe
    const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      metadata: {
        ...metadata,
        source: 'hydrogen-vercel-fresh',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation failed:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return json({error: error.message}, {status: 400});
    }

    return json({error: 'Failed to create payment intent'}, {status: 500});
  }
}

// Prevent GET requests
export function loader() {
  return json({error: 'Method not allowed'}, {status: 405});
}
