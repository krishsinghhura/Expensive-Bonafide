import React from 'react';

const plans = [
  {
    name: 'Basic',
    price: '$49/mo',
    features: ['Up to 100 credentials', 'Email support', 'Basic analytics'],
  },
  {
    name: 'Pro',
    price: '$99/mo',
    features: ['Up to 500 credentials', 'Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    features: ['Unlimited credentials', 'Dedicated support', 'Custom integrations'],
  },
];

const Pricing = () => (
  <section id="pricing" className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h3 className="text-3xl font-bold mb-12">Pricing Plans</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-4 text-indigo-600">{plan.name}</h4>
            <p className="text-2xl font-bold mb-6">{plan.price}</p>
            <ul className="text-gray-600 mb-6">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="mb-2">- {feature}</li>
              ))}
            </ul>
            <a href="#contact" className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition">Choose Plan</a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
