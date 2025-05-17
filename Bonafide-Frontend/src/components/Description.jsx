import React from 'react';

const Summary = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-extrabold text-indigo-600 mb-8">What We Do</h2>
        <p className="text-gray-800 text-xl leading-relaxed">
          <span className="font-semibold text-indigo-500">Bonafide</span> is your trusted partner in the future of credentialing. 
          We provide a secure, blockchain-powered platform to issue, manage, and verify digital certificates with absolute authenticity.
        </p>
        <p className="text-gray-800 text-xl leading-relaxed mt-6">
          From universities to corporate bodies, we help organizations eliminate fraud, reduce paperwork, and build trust 
          through verifiable, tamper-proof credentials — accessible anytime, anywhere.
        </p>
        <p className="text-gray-800 text-xl leading-relaxed mt-6">
          Join the movement toward smarter, simpler, and more secure digital verification.
        </p>
      </div>
    </section>
  );
};

export default Summary;
