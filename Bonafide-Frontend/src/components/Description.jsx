import React from 'react';

const Summary = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-indigo-600 mb-6">What We Do</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Bonafide is a secure and modern platform for issuing, managing, and verifying digital credentials using blockchain technology. 
          Our application empowers institutions and organizations to provide tamper-proof certificates, badges, and documents that are instantly verifiable and permanently stored.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed mt-4">
          Whether you're an educational institution, a corporate organization, or a certification body, 
          Bonafide simplifies your credentialing process while ensuring transparency, trust, and technological excellence.
        </p>
      </div>
    </section>
  );
};

export default Summary;
