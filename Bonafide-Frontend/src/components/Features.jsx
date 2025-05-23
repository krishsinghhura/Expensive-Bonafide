import React from 'react';
import { CheckCircle } from 'lucide-react'; // Optional icon for visual touch

const features = [
  {
    title: 'Step 1: Submit Certificates',
    description:
      'Easily upload student data through our secure dashboard. Your credentials begin the journey toward trust and transparency.',
  },
  {
    title: 'Step 2: Stored on Blockchain',
    description:
      'Our system generates a unique hash and stores it immutably on-chain — ensuring tamper-proof, permanent verification.',
  },
  {
    title: 'Step 3: Instant Verification',
    description:
      'Students and institutions can instantly verify credentials with a single click, anytime, from anywhere in the world.',
  },
];

const Features = () => (
  <section id="features" className="py-24 bg-gray-50">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <h3 className="text-4xl font-extrabold text-indigo-700 mb-14">How It Works</h3>
      <div className="grid md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div
            key={index}
          className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-105 hover:bg-blue-500 hover:text-white"
          >
            <div className="flex justify-center mb-4">
              <CheckCircle className="text-indigo-600 w-8 h-8" />
            </div>
            <h4 className="text-2xl font-semibold mb-3 text-indigo-700 hover:text-white">{feature.title}</h4>
            <p className="text-gray-700 text-base leading-relaxed hover:text-white">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
