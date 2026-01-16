import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-8 w-8 text-blue-600" />,
      title: "Email Us",
      details: ["support@triksha.com", "contact@triksha.com"],
      description: "Send us your questions or feedback"
    },
    {
      icon: <Phone className="h-8 w-8 text-green-600" />,
      title: "Call Us",
      details: ["+91 98765 43210", "+91 87654 32109"],
      description: "Speak directly with our team"
    },
    {
      icon: <MapPin className="h-8 w-8 text-red-600" />,
      title: "Visit Us",
      details: ["Mathura, Uttar Pradesh", "India - 281001"],
      description: "Our development center location"
    }
  ];

  const faqs = [
    {
      question: "How does TRIKSHA ensure data privacy and security?",
      answer: "TRIKSHA implements end-to-end encryption, HIPAA compliance, and secure JWT authentication to protect all patient data and communications."
    },
    {
      question: "What languages are supported in the platform?",
      answer: "Currently, TRIKSHA supports English, Hindi, and Punjabi for both voice and text interactions with plans to add more regional languages."
    },
    {
      question: "How can doctors join the TRIKSHA platform?",
      answer: "Healthcare providers can register through our portal with their medical credentials. We verify all doctors before allowing them to conduct consultations."
    },
    {
      question: "Is TRIKSHA available for government integration?",
      answer: "Yes, TRIKSHA is designed to integrate with government health systems and provides comprehensive analytics for public health monitoring."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Have questions about TRIKSHA or want to collaborate with us?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    placeholder="Tell us about your inquiry, feedback, or how you'd like to collaborate..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === 'loading'}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {submitStatus === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                    <span>Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <span>Failed to send message. Please try again or contact us directly.</span>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <p className="text-lg text-gray-600 mb-8">
                Reach out to our team for any questions about TRIKSHA,
                collaboration opportunities, or technical support.
              </p>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    {info.icon}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{info.description}</p>
                      <div className="space-y-1">
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-800 font-medium">{detail}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Info Card
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-xl text-white">
              <h3 className="text-xl font-bold mb-4">Smart India Hackathon 2025</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">Problem ID:</span> 25018</p>
                <p><span className="font-semibold">Theme:</span> Healthcare Technology</p>
                <p><span className="font-semibold">Team:</span> Debug Thugs</p>
                <p><span className="font-semibold">Project:</span> TRIKSHA Telemedicine Platform</p>
              </div>
            </div>
            */}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about TRIKSHA and our telemedicine platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;