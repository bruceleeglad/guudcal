import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const PRICING_CONFIG: Record<string, { name: string; amount: number; mode: 'subscription' | 'payment'; description: string }> = {
  // GuudSuite (Bundle)
  'suite_solo': {
    name: 'GuudSuite Solo (GuudCal + GuudCRM)',
    amount: 29900, // 299 DKK in øre
    mode: 'subscription',
    description: '1 domæne, 50 SMS/mdr., ubegrænset kalender & B2B CRM pipeline'
  },
  'suite_agency': {
    name: 'GuudSuite Agency Pro (Mest Populære · Spar 43%)',
    amount: 39900, // 399 DKK in øre
    mode: 'subscription',
    description: '10 domæner, 250 SMS/mdr., 100% white-label, ubegrænsede sælgere'
  },
  'suite_lifetime': {
    name: '👑 Lifetime GuudSuite (Evig Licens · BYOK)',
    amount: 799900, // 7.999 DKK in øre
    mode: 'payment',
    description: 'Evig adgang til BÅDE GuudCal og GuudCRM. 0 kr./mdr. for evigt.'
  },

  // GuudCal Standalone
  'cal_solo': {
    name: 'GuudCal Solo (Kun Kalender)',
    amount: 19900,
    mode: 'subscription',
    description: '1 aktivt website / domæne, 50 SMS påmindelser, ubegrænset booking'
  },
  'cal_agency': {
    name: 'GuudCal Agency Pro (10 Domæner)',
    amount: 34900,
    mode: 'subscription',
    description: 'Op til 10 domæner, 150 SMS/mdr., 100% white-label brand integration'
  },
  'cal_lifetime': {
    name: '👑 Lifetime GuudCal (BYOK Model)',
    amount: 499900,
    mode: 'payment',
    description: 'Evig adgang til GuudCal Scorecard & Booking. Ingen månedlige gebyrer.'
  },

  // GuudCRM Standalone
  'crm_solo': {
    name: 'GuudCRM Solo (Kun CRM)',
    amount: 19900,
    mode: 'subscription',
    description: '1-3 sælgere, 250 AI-opkaldsnotater/mdr., executive dossier'
  },
  'crm_agency': {
    name: 'GuudCRM Pro (Ubegrænsede Sælgere)',
    amount: 34900,
    mode: 'subscription',
    description: 'Ubegrænsede sælgere, fuld CloudTalk webhook integration'
  },
  'crm_lifetime': {
    name: '👑 Lifetime GuudCRM (BYOK Model)',
    amount: 499900,
    mode: 'payment',
    description: 'Evig adgang til GuudCRM salgssystem. Éngangsbetaling.'
  }
};

export async function POST(req: Request) {
  try {
    const rawKey = process.env.STRIPE_SECRET_KEY || '';
    const stripeKey = rawKey.replace(/^["']|["']$/g, '').trim();
    if (!stripeKey) {
      return NextResponse.json({ error: 'Stripe er ikke konfigureret på serveren' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2025-02-24.acacia' as any
    });

    const body = await req.json();
    const { module = 'suite', tier = 'agency', customerEmail } = body;

    const planKey = `${module}_${tier}`;
    const plan = PRICING_CONFIG[planKey];

    if (!plan) {
      return NextResponse.json({ error: `Ugyldig pakke: ${planKey}` }, { status: 400 });
    }

    const host = req.headers.get('host') || 'guudcal.vercel.app';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: 'dkk',
          product_data: {
            name: plan.name,
            description: plan.description,
          },
          unit_amount: plan.amount,
          ...(plan.mode === 'subscription' ? { recurring: { interval: 'month' } } : {})
        },
        quantity: 1,
      }
    ];

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: plan.mode,
      customer_email: customerEmail || undefined,
      success_url: `${baseUrl}/crm?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${planKey}`,
      cancel_url: `${baseUrl}/#pricing?payment=cancelled`,
      metadata: {
        planKey,
        module,
        tier,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto'
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message || 'Kunne ikke oprette Stripe session' }, { status: 500 });
  }
}
