import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer"
import { FaPaperPlane, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        
        // Reset success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      }, 1500);
    }
  };

  const contactItems = [
    {
      icon: <FaMapMarkerAlt className="text-2xl text-blue-600" />,
      title: "Our Location",
      content: "CampustoCrypto, CUTM BBSR, Odisha, India",
      link: "https://maps.app.goo.gl/GvesFMoiYZr4UFvi6"
    },
    {
      icon: <FaPhone className="text-2xl text-blue-600" />,
      title: "Phone Number",
      content: "+91 98765 43210",
      link: "tel:+919876543210"
    },
    {
      icon: <FaEnvelope className="text-2xl text-blue-600" />,
      title: "Email Address",
      content: "support@bonafide.io",
      link: "mailto:support@bonafide.io"
    }
  ];

  const socialLinks = [
    {
      icon: <FaLinkedin className="text-xl" />,
      url: "https://linkedin.com/company/bonafide",
      name: "LinkedIn"
    },
    {
      icon: <FaTwitter className="text-xl" />,
      url: "https://twitter.com/bonafide",
      name: "Twitter"
    },
    {
      icon: <FaGithub className="text-xl" />,
      url: "https://github.com/bonafide",
      name: "GitHub"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center py-20 px-6 bg-blue-600"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold text-white mb-6"
          >
            Contact Our Team
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto"
          >
            Have questions or feedback? We're here to help and would love to hear from you.
          </motion.p>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 -mt-12"
      >
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Get in Touch</h2>
            
            <div className="space-y-6">
              {contactItems.map((item, index) => (
                <motion.a 
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="mt-1 group-hover:text-blue-700 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-blue-600 transition-colors">
                      {item.content}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="mt-12">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3 }}
                    className="bg-blue-50 hover:bg-blue-100 w-10 h-10 flex items-center justify-center rounded-full transition-colors text-blue-600"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="p-8 sm:p-10">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">Our team typically responds within 24 hours</p>

                {submitSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Thank you for your message! We'll get back to you soon.</span>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${formErrors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      placeholder="John Doe"
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${formErrors.email ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      placeholder="you@example.com"
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border ${formErrors.message ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                      placeholder="How can we help you?"
                    ></textarea>
                    {formErrors.message && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.message}</p>
                    )}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>

              {/* Footer Note */}
              <div className="bg-gray-50 px-8 py-5 border-t border-gray-200">
                <p className="text-center text-gray-500 text-sm">
                  <svg className="h-4 w-4 inline-block mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Your information is secure and will never be shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Floating CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="fixed bottom-8 right-8 z-10"
      >
        <a 
          href="mailto:support@bonafide.io" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg flex items-center space-x-2 transition-colors"
        >
          <FaEnvelope />
          <span className="hidden sm:inline">Quick Email</span>
        </a>
      </motion.div>
      <Footer/>
    </div>
  );
};

export default Contact;