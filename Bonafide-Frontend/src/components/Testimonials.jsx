import React from 'react';

const testimonials = [
  {
    name: 'Jane Doe',
    feedback: 'CredSure has revolutionized how we issue and manage credentials.',
  },
  {
    name: 'John Smith',
    feedback: 'The platform is intuitive and the support team is fantastic!',
  },
];

const Testimonials = () => (
  <section className="py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <h3 className="text-3xl font-bold mb-12">What Our Clients Say</h3>
      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md">
            <p className="text-gray-700 italic">"{testimonial.feedback}"</p>
            <p className="mt-4 text-indigo-600 font-semibold">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
