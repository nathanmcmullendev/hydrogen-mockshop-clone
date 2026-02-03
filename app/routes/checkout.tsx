import {json, redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import {useLoaderData, useNavigate, useFetcher} from '@remix-run/react';
import {useState, useEffect} from 'react';
import {Money, Image} from '@shopify/hydrogen';
import {loadStripe} from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type Step = 'information' | 'payment' | 'confirmation';

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
}

export async function loader({context}: LoaderArgs) {
  const {cart, env} = context;

  // Get cart data
  const cartData = await cart.get();

  if (!cartData || cartData.totalQuantity === 0) {
    return redirect('/cart');
  }

  // Debug: log available env keys
  console.log('ENV KEYS:', Object.keys(env));
  console.log('STRIPE_SECRET_KEY exists:', !!env.STRIPE_SECRET_KEY);
  console.log('VITE_STRIPE_PUBLIC_KEY exists:', !!env.VITE_STRIPE_PUBLIC_KEY);

  // Check if Stripe checkout is available
  const stripeEnabled = Boolean(
    env.STRIPE_SECRET_KEY && env.VITE_STRIPE_PUBLIC_KEY,
  );

  console.log('stripeEnabled:', stripeEnabled);

  return json({
    cart: cartData,
    stripeEnabled,
    stripePublicKey: env.VITE_STRIPE_PUBLIC_KEY || '',
    // Fallback to Shopify checkout URL
    fallbackCheckoutUrl: cartData.checkoutUrl,
    // Debug info
    debug: {
      envKeys: Object.keys(env),
      hasStripeSecret: !!env.STRIPE_SECRET_KEY,
      hasStripePublic: !!env.VITE_STRIPE_PUBLIC_KEY,
    },
  });
}

export default function Checkout() {
  const {cart, stripeEnabled, stripePublicKey, fallbackCheckoutUrl} =
    useLoaderData<typeof loader>();
  const [step, setStep] = useState<Step>('information');
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    city: '',
    province: '',
    country: 'US',
    zip: '',
    phone: '',
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  // If Stripe is not enabled, redirect to Shopify checkout
  if (!stripeEnabled) {
    return (
      <div className="checkout-fallback">
        <h1>Checkout</h1>
        <p>Redirecting to secure checkout...</p>
        <a href={fallbackCheckoutUrl} className="checkout-button">
          Continue to Checkout
        </a>
      </div>
    );
  }

  const stripePromise = loadStripe(stripePublicKey);

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreatingIntent(true);

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          amount: parseFloat(cart.cost.totalAmount.amount),
          currency: cart.cost.totalAmount.currencyCode.toLowerCase(),
          metadata: {
            email: shippingAddress.email,
            cartId: cart.id,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep('payment');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    setError(null);

    try {
      // Create order in Shopify
      const lineItems = cart.lines.nodes.map((line: any) => ({
        variantId: line.merchandise.id,
        quantity: line.quantity,
        title: line.merchandise.product.title,
        price: line.cost.totalAmount.amount,
      }));

      const response = await fetch('/api/create-order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          lineItems,
          shippingAddress: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName,
            address1: shippingAddress.address1,
            address2: shippingAddress.address2,
            city: shippingAddress.city,
            province: shippingAddress.province,
            country: shippingAddress.country,
            zip: shippingAddress.zip,
            phone: shippingAddress.phone,
          },
          email: shippingAddress.email,
          paymentIntentId: paymentIntentId,
          total: parseFloat(cart.cost.totalAmount.amount),
          cartId: cart.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Demo mode: Payment succeeded but order creation failed
        // This happens when using mock.shop products with a real Admin API
        console.warn('Order creation failed (demo mode):', data.error);
        setOrderResult({
          name: `DEMO-${paymentIntent.id.slice(-8).toUpperCase()}`,
          id: paymentIntent.id,
          isDemo: true,
        });
        setStep('confirmation');
        return;
      }

      setOrderResult(data.order);
      setStep('confirmation');
    } catch (err) {
      // Demo mode fallback: Still show success if payment went through
      console.warn('Order creation error (demo mode):', err);
      setOrderResult({
        name: `DEMO-${paymentIntent.id.slice(-8).toUpperCase()}`,
        id: paymentIntent.id,
        isDemo: true,
      });
      setStep('confirmation');
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-main">
          <CheckoutHeader step={step} />

          {error && <div className="checkout-error">{error}</div>}

          {step === 'information' && (
            <InformationStep
              shippingAddress={shippingAddress}
              setShippingAddress={setShippingAddress}
              onSubmit={handleInformationSubmit}
              isLoading={isCreatingIntent}
            />
          )}

          {step === 'payment' && clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: 'stripe',
                  variables: {
                    colorPrimary: '#000000',
                  },
                },
              }}
            >
              <PaymentStep
                onSuccess={handlePaymentSuccess}
                onBack={() => setStep('information')}
                setError={setError}
              />
            </Elements>
          )}

          {step === 'confirmation' && orderResult && (
            <ConfirmationStep order={orderResult} email={shippingAddress.email} />
          )}
        </div>

        <div className="checkout-sidebar">
          <OrderSummary cart={cart} />
        </div>
      </div>
    </div>
  );
}

function CheckoutHeader({step}: {step: Step}) {
  const steps = [
    {key: 'information', label: 'Information'},
    {key: 'payment', label: 'Payment'},
    {key: 'confirmation', label: 'Confirmation'},
  ];

  return (
    <div className="checkout-header">
      <h1>Checkout</h1>
      <div className="checkout-steps">
        {steps.map((s, i) => (
          <div
            key={s.key}
            className={`checkout-step ${s.key === step ? 'active' : ''} ${
              steps.findIndex((x) => x.key === step) > i ? 'completed' : ''
            }`}
          >
            <span className="step-number">{i + 1}</span>
            <span className="step-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InformationStep({
  shippingAddress,
  setShippingAddress,
  onSubmit,
  isLoading,
}: {
  shippingAddress: ShippingAddress;
  setShippingAddress: (address: ShippingAddress) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}) {
  const updateField = (field: keyof ShippingAddress, value: string) => {
    setShippingAddress({...shippingAddress, [field]: value});
  };

  return (
    <form onSubmit={onSubmit} className="checkout-form">
      <h2>Contact Information</h2>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          required
          value={shippingAddress.email}
          onChange={(e) => updateField('email', e.target.value)}
          placeholder="your@email.com"
        />
      </div>

      <h2>Shipping Address</h2>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            required
            value={shippingAddress.firstName}
            onChange={(e) => updateField('firstName', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            required
            value={shippingAddress.lastName}
            onChange={(e) => updateField('lastName', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="address1">Address</label>
        <input
          type="text"
          id="address1"
          required
          value={shippingAddress.address1}
          onChange={(e) => updateField('address1', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="address2">Apartment, suite, etc. (optional)</label>
        <input
          type="text"
          id="address2"
          value={shippingAddress.address2}
          onChange={(e) => updateField('address2', e.target.value)}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            required
            value={shippingAddress.city}
            onChange={(e) => updateField('city', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="province">State/Province</label>
          <input
            type="text"
            id="province"
            required
            value={shippingAddress.province}
            onChange={(e) => updateField('province', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="zip">ZIP/Postal Code</label>
          <input
            type="text"
            id="zip"
            required
            value={shippingAddress.zip}
            onChange={(e) => updateField('zip', e.target.value)}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="country">Country</label>
        <select
          id="country"
          required
          value={shippingAddress.country}
          onChange={(e) => updateField('country', e.target.value)}
        >
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="GB">United Kingdom</option>
          <option value="AU">Australia</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone (optional)</label>
        <input
          type="tel"
          id="phone"
          value={shippingAddress.phone}
          onChange={(e) => updateField('phone', e.target.value)}
        />
      </div>

      <button type="submit" className="checkout-button" disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Continue to Payment'}
      </button>
    </form>
  );
}

function PaymentStep({
  onSuccess,
  onBack,
  setError,
}: {
  onSuccess: (paymentIntent: any) => void;
  onBack: () => void;
  setError: (error: string | null) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const {error: submitError, paymentIntent} = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/checkout',
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent);
      } else {
        setError('Payment was not completed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Payment</h2>
      <div className="payment-element-container">
        <PaymentElement
          options={{
            layout: {
              type: 'tabs',
              defaultCollapsed: false,
            }
          }}
        />
      </div>

      <div className="checkout-actions">
        <button type="button" onClick={onBack} className="back-button">
          Back to Information
        </button>
        <button
          type="submit"
          className="checkout-button"
          disabled={!stripe || isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}

function ConfirmationStep({order, email}: {order: any; email: string}) {
  const isDemo = order?.isDemo;

  return (
    <div className="confirmation-step">
      <div className="confirmation-icon">
        <svg viewBox="0 0 24 24" width="64" height="64">
          <circle cx="12" cy="12" r="11" fill="#22c55e" />
          <path
            d="M7 12l3 3 7-7"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2>{isDemo ? 'Payment Successful!' : 'Thank you for your order!'}</h2>
      <p className="order-number">
        {isDemo ? `Reference: ${order.name}` : `Order #${order.name}`}
      </p>
      {isDemo && (
        <p className="demo-notice" style={{
          backgroundColor: '#fef3c7',
          color: '#92400e',
          padding: '12px 16px',
          borderRadius: '8px',
          marginTop: '16px',
          fontSize: '14px',
        }}>
          Demo Mode: Payment was processed successfully via Stripe.
          In production, this would create an order in your Shopify store.
        </p>
      )}
      <p className="confirmation-email">
        {isDemo
          ? <>Your payment of <strong>{order.name}</strong> has been confirmed.</>
          : <>A confirmation email will be sent to <strong>{email}</strong></>
        }
      </p>
      <div className="confirmation-actions">
        <a href="/collections" className="checkout-button">
          Continue Shopping
        </a>
      </div>
    </div>
  );
}

function OrderSummary({cart}: {cart: CartApiQueryFragment}) {
  return (
    <div className="order-summary">
      <h3>Order Summary</h3>
      <div className="order-items">
        {cart.lines.nodes.map((line: any) => (
          <div key={line.id} className="order-item">
            <div className="order-item-image">
              {line.merchandise.image && (
                <Image
                  data={line.merchandise.image}
                  width={64}
                  height={64}
                  alt={line.merchandise.product.title}
                />
              )}
              <span className="order-item-quantity">{line.quantity}</span>
            </div>
            <div className="order-item-details">
              <p className="order-item-title">{line.merchandise.product.title}</p>
              {line.merchandise.title !== 'Default Title' && (
                <p className="order-item-variant">{line.merchandise.title}</p>
              )}
            </div>
            <div className="order-item-price">
              <Money data={line.cost.totalAmount} />
            </div>
          </div>
        ))}
      </div>
      <div className="order-totals">
        <div className="order-total-row">
          <span>Subtotal</span>
          <Money data={cart.cost.subtotalAmount} />
        </div>
        <div className="order-total-row">
          <span>Shipping</span>
          <span>Calculated at next step</span>
        </div>
        <div className="order-total-row total">
          <span>Total</span>
          <Money data={cart.cost.totalAmount} />
        </div>
      </div>
    </div>
  );
}
