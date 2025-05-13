import React from 'react';

const features = [
  {
    title: 'Immutable Security',
    description: 'Leverage blockchain technology to ensure credentials are tamper-proof.',
  },
  {
    title: 'Instant Verification',
    description: 'Recipients can verify their credentials instantly, enhancing trust.',
  },
  {
    title: 'Easy Integration',
    description: 'Seamlessly integrate with your existing systems and workflows.',
  },
];

const Features = () => (
  <section id="features" className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h3 className="text-3xl font-bold mb-12">Features</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2 text-indigo-600">{feature.title}</h4>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
