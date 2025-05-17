import React from 'react';

const CTA = () => (
  <section
    id="get-started"
    className="py-28 md:py-36 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-center"
  >
    <div className="max-w-7xl mx-auto px-4">
      <h3 className="text-4xl md:text-5xl font-extrabold mb-6">
        Ready to Transform Your Credentialing Process?
      </h3>
      <p className="text-lg md:text-xl mb-8">
        Join numerous organizations in securing and simplifying their digital credentials.
      </p>
      <a
        href="/auth"
        className="bg-white text-indigo-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300"
      >
        Get Started Now
      </a>
    </div>
  </section>
);

export default CTA;
