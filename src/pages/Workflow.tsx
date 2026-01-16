import React from 'react';
import { UserPlus, Bot, Video, Database, Activity, CheckCircle } from 'lucide-react';

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  red: 'from-red-500 to-red-600',
  orange: 'from-orange-500 to-orange-600',
  teal: 'from-teal-500 to-teal-600'
};

type StepColor = keyof typeof colorClasses;

type Step = {
  icon: React.ReactElement;
  title: string;
  description: string;
  details: string[];
  color: StepColor;
};

const Workflow = () => {
  const steps: Step[] = [
    {
      icon: <UserPlus className="h-12 w-12 text-blue-600" />,
      title: 'Register with Aadhaar/Phone',
      description: 'Quick and secure registration using your Aadhaar number or phone number. Complete your basic health profile to get personalized care.',
      details: ['Aadhaar verification', 'Phone OTP authentication', 'Basic health information', 'Emergency contact setup'],
      color: 'blue'
    },
    {
      icon: <Bot className="h-12 w-12 text-green-600" />,
      title: 'AI Chatbot Triage',
      description: 'Our intelligent AI chatbot conducts preliminary symptom assessment using voice or text input in your preferred language.',
      details: ['Symptom analysis', 'Voice/text support', 'Multilingual interface', 'Risk assessment'],
      color: 'green'
    },
    {
      icon: <Video className="h-12 w-12 text-purple-600" />,
      title: 'Video Consultation',
      description: 'Connect with certified doctors through secure video calls. Get professional medical advice from the comfort of your home.',
      details: ['HD video quality', 'Secure connection', 'Real-time consultation', 'Digital prescription'],
      color: 'purple'
    },
    {
      icon: <Database className="h-12 w-12 text-red-600" />,
      title: 'Offline Record Sync',
      description: 'All your health records are automatically synced across devices, even when offline. Access your complete medical history anytime.',
      details: ['Automatic synchronization', 'Offline accessibility', 'Encrypted storage', 'Complete history'],
      color: 'red'
    },
    {
      icon: <Activity className="h-12 w-12 text-orange-600" />,
      title: 'Pharmacy Stock Updates',
      description: 'Get real-time updates on medicine availability at nearby pharmacies. Compare prices and check stock before visiting.',
      details: ['Live stock tracking', 'Price comparison', 'Pharmacy locations', 'Availability alerts'],
      color: 'orange'
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-teal-600" />,
      title: 'Admin Dashboard',
      description: 'Government and health departments can access comprehensive analytics and monitor healthcare delivery across regions.',
      details: ['Real-time analytics', 'Patient statistics', 'Doctor performance', 'Regional insights'],
      color: 'teal'
    }
  ];

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    teal: 'from-teal-500 to-teal-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How TRIKSHA Works
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            A simple, step-by-step process designed to make healthcare accessible
            to everyone in rural India.
          </p>
        </div>
      </section>

      {/* Workflow Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                {/* Step Card */}
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <div className={`bg-gradient-to-r ${colorClasses[step.color]} p-4 rounded-full mr-6`}>
                      {step.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-1">
                        Step {index + 1}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClasses[step.color]}`}></div>
                        <span className="text-gray-700">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className={`w-24 h-24 bg-gradient-to-r ${colorClasses[step.color]} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl font-bold text-white">
                      {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete Healthcare Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From registration to treatment, TRIKSHA provides a seamless
              healthcare experience for rural communities.
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-green-500 rounded-full"></div>

            <div className="space-y-12 lg:space-y-8">
              {steps.map((step, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'}`}>
                  <div className={`bg-white p-6 rounded-lg shadow-md max-w-md ${index % 2 === 0 ? 'lg:mr-8' : 'lg:ml-8'}`}>
                    <div className="flex items-center mb-3">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${colorClasses[step.color]} mr-3`}>
                        {React.cloneElement(step.icon, { className: 'h-6 w-6 text-white' })}
                      </div>
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Healthcare Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join the TRIKSHA platform today and experience healthcare like never before.
            It's simple, secure, and designed for you.
          </p>
          {/* <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors transform hover:scale-105">
            Begin Registration
          </button> */}
        </div>
      </section>
    </div>
  );
};

export default Workflow;