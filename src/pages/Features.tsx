import React from 'react';
import { Link } from 'react-router-dom';
import { Video, Globe, Bot, Mic, Scale, Shield } from 'lucide-react';

type FeatureColor = 'blue' | 'green' | 'indigo' | 'orange' | 'teal' | 'pink';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  color: FeatureColor;
}

const Features = () => {
  const features: Feature[] = [
    {
      icon: <Video className="h-12 w-12 text-blue-600" />,
      title: 'Video Consultation with Doctors',
      description: 'Secure, high-quality video calls connecting rural patients with certified doctors across India.',
      benefits: ['24/7 Doctor availability', 'Secure video streaming', 'Consultation history'],
      color: 'blue',
    },
    {
      icon: <Globe className="h-12 w-12 text-green-600" />,
      title: 'Multilingual Support',
      description: 'Complete support for English, Hindi, and Punjabi to ensure comfortable communication.',
      benefits: ['Voice recognition in 3 languages', 'Text translation', 'Cultural sensitivity'],
      color: 'green',
    },
    {
      icon: <Bot className="h-12 w-12 text-indigo-600" />,
      title: 'AI Symptom Checker',
      description: 'Advanced AI chatbot for preliminary symptom assessment and medical triage.',
      benefits: ['Instant symptom analysis', 'Emergency detection', 'Treatment suggestions'],
      color: 'indigo',
    },
    {
      icon: <Mic className="h-12 w-12 text-orange-600" />,
      title: 'Voice-enabled Chatbot',
      description: 'Natural voice interaction for users who prefer speaking over typing.',
      benefits: ['Voice commands', 'Speech-to-text', 'Accessibility friendly'],
      color: 'orange',
    },
    {
      icon: <Scale className="h-12 w-12 text-teal-600" />,
      title: 'Scalable Solution',
      description: 'Built to serve millions of rural users across India with cloud infrastructure.',
      benefits: ['Cloud-based architecture', 'Auto-scaling', 'High availability'],
      color: 'teal',
    },
    {
      icon: <Shield className="h-12 w-12 text-pink-600" />,
      title: 'Secure & Compliant',
      description: 'HIPAA compliant platform with end-to-end encryption for patient privacy.',
      benefits: ['End-to-end encryption', 'HIPAA compliance', 'Data privacy'],
      color: 'pink',
    },
  ];

  const colorClasses: Record<FeatureColor, string> = {
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    indigo: 'from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
    pink: 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Comprehensive Healthcare Features
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Discover how TRIKSHA's advanced features are transforming healthcare
            access for rural communities across India.
          </p>
        </div>
      </section>

      {/* Features Grid - 2 rows with 3 cards each */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${colorClasses[feature.color]} p-6 text-white`}>
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorClasses[feature.color]}`}></div>
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the Future of Healthcare
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers who are already
            benefiting from TRIKSHA's innovative telemedicine platform.
          </p>
          <Link to="/register" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Features;
