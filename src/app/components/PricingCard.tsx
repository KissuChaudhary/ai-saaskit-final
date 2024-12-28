import React from 'react';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 29,
    features: [
      '5 Projects',
      '10GB Storage',
      'Basic Analytics',
      'Email Support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: 79,
    features: [
      'Unlimited Projects',
      '100GB Storage',
      'Advanced Analytics',
      'Priority Support',
      'API Access',
    ],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 199,
    features: [
      'Unlimited Everything',
      'Dedicated Server',
      'Custom Integrations',
      '24/7 Phone Support',
      'On-site Training',
    ],
    cta: 'Contact Sales',
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
                  ? 'border-green-500 border-2'
                  : 'border-gray-700'
              } p-8 shadow-sm flex flex-col`}
            >
              {plan.popular && (
                <span className="absolute top-0 right-0 -mt-2 -mr-2 inline-flex items-center rounded-full bg-green-500 px-2.5 py-0.5 text-xs font-medium text-white">
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
              <ul className="mt-6 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="ml-3 text-base text-gray-300">{feature}</p>
                  </li>
                ))}
              </ul>
              <a
                href="#"
                className={`mt-8 block w-full rounded-md px-6 py-4 text-center text-base font-medium ${
                  plan.popular
                    ? 'bg-green-600 text-white hover:bg-green-400'
                    : 'bg-[#FFBE1A] text-black hover:bg-[#FFBE1A]/80'
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
