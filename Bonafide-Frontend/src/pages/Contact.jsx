import React from "react";
import Header from "../components/Header"; // Adjust path if needed

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-colors duration-1000 ease-in-out">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="text-center py-20 px-6 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl font-bold text-white transition-transform duration-500 hover:scale-105">
          Reach out to us
        </h1>
        <p className="mt-4 text-lg text-white max-w-xl mx-auto">
          Whether it’s a question, feedback, or support — we’re here to help.
        </p>
      </section>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pb-20 animate-slide-up">
        <div className="bg-white rounded-2xl shadow-2xl p-10 ring-1 ring-gray-200 transition-shadow hover:shadow-indigo-300 duration-500">
          <h2 className="text-3xl font-bold text-indigo-700 mb-10 text-center">
            Contact Us
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  We'd love to hear from you
                </h3>
                <p className="text-gray-600 mt-2">
                  Our team is available and happy to connect. Let us know what you think or how we can help!
                </p>
              </div>
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Email:</strong> support@bonafide.io
                </p>
                <p>
                  <strong>Phone:</strong> +91 98765 43210
                </p>
                <p>
                  <strong>Address:</strong> 42, Blockchain Street, Tech City, India
                </p>
              </div>
            </div>

            {/* Feedback Form */}
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-xl shadow-sm transition-transform duration-300 focus:ring-indigo-500 focus:border-indigo-500 hover:scale-105"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 w-full p-3 border border-gray-300 rounded-xl shadow-sm transition-transform duration-300 focus:ring-indigo-500 focus:border-indigo-500 hover:scale-105"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={4}
                  placeholder="Your message..."
                  className="mt-1 w-full p-3 border border-gray-300 rounded-xl shadow-sm transition-transform duration-300 focus:ring-indigo-500 focus:border-indigo-500 hover:scale-105"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-indigo-700 hover:scale-105 transition-transform duration-300"
              >
                Send Feedback
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
