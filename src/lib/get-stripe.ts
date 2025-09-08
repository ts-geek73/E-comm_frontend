import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const getStripe = async () => {
  if (!stripePromise) {
    console.log("before log");

    // Validate the key exists before calling loadStripe
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      throw new Error('Missing Stripe publishable key');
    }

    stripePromise = loadStripe(publishableKey);
    console.log(stripePromise);
  }
  return stripePromise;
};

export default getStripe;

