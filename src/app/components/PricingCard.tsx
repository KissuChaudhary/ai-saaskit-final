import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 5.99,
    credits: 50,
    features: [
      'Access to All AI-Powered Image Tools',
      'High-Quality Images',
      'Cost-Effective Per Image',
      'Cancel Anytime',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 15.99,
    credits: 200,
    features: [
      'Access to All AI-Powered Image Tools',
      'High-Quality Images',
      'Cost-Effective Per Image',
      'Priority Support',
      'Weekly AI Art Newsletter',
      'Cancel Anytime',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 39.99,
    credits: 600,
    features: [
      'Access to All AI-Powered Image Tools',
      'Highest-Quality Images',
      'Cost-Effective Per Image',
      'Highest-Priority Processing',
      'Priority Support',
      'Earliest Access to New Features',
      'Weekly AI Art Newsletter',
      'Cancel Anytime',
    ],
    cta: 'Get Enterprise',
    popular: false,
  },
];

const PricingSection: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-300">
            Choose the plan that's right for you
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border ${
                plan.popular
                  ? 'border-[#FFBE1A] border-2'
                  : 'border-gray-700'
              }  p-8 shadow-sm flex flex-col`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 -mt-2 -mr-2 inline-flex items-center rounded-full bg-[#FFBE1A] px-2.5 py-0.5 text-xs font-medium text-black">
                  Popular
                </span>
              )}
              <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-4 flex items-baseline">
                <span className="text-5xl font-extrabold text-white">
                  ${plan.price}
                </span>
                <span className="ml-1 text-xl font-semibold text-gray-400">
                  /month
                </span>
              </p>
              <p className="mt-2 text-sm text-gray-400">
                Includes {plan.credits} credits
              </p>
              <ul className="mt-6 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-[#FFBE1A]" />
                    </div>
                    <p className="ml-3 text-base text-gray-300">{feature}</p>
                  </li>
                ))}
              </ul>
              <a
                href="/auth"
                className={`mt-8 block w-full rounded-md px-6 py-4 text-center text-base font-medium ${
                  plan.popular
                    ? 'bg-[#FFBE1A] text-black hover:bg-[#FFBE1A]/80'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                } transition duration-200 ease-in-out`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

