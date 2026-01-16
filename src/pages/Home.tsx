import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Shield, Users, Zap, Globe } from 'lucide-react';



const Home = () => {
  const stats = [
    { number: '1M+', label: 'Rural Population Served' },
    { number: '500+', label: 'Healthcare Providers' },
    { number: '24/7', label: 'Support Available' },
    { number: '3', label: 'Languages Supported' }
  ];

  const highlights = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Secure & Private',
      description: 'HIPAA compliant with end-to-end encryption'
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: 'Expert Doctors',
      description: 'Certified healthcare professionals available'
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: 'AI-Powered',
      description: 'Intelligent symptom checking and triage'
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-600" />,
      title: 'Multilingual',
      description: 'Support in English, Hindi, and Punjabi'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50 pt-32 pb-20">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-teal-100 rounded-full blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-30 animate-float delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-teal-100 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse"></span>
            <span className="text-sm font-medium text-teal-700">Reimagining Healthcare</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-teal-900 leading-tight animate-fade-in-up delay-100">
            Heal with <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">
              Confidence & Care
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            Experience a soothing, AI-powered healthcare journey. Seamless appointments,
            instant calm, and personalized care—designed for your well-being.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up delay-300">
            <Link
              to="/register"
              className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full font-semibold hover:from-teal-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-teal-500/30"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <Play className="mr-2 h-5 w-5 fill-current text-teal-600" />
              Watch Demo
            </button>
          </div>

          {/* Stats Preview */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-gray-100 pt-10 animate-fade-in-up delay-300">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-default">
                <div className="text-3xl font-bold text-teal-800 mb-1 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                <div className="text-sm text-gray-500 font-medium group-hover:text-teal-600 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose TRIKSHA?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform addresses the unique healthcare challenges
              faced by rural communities in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlights.map((highlight, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <div className="mb-4">
                  {highlight.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Healthcare Access?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients and healthcare providers who trust TRIKSHA
            for reliable, accessible healthcare solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;