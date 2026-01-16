import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Shield, Users, Zap, Globe } from 'lucide-react';
import { useState } from "react";
import hospitalVideo from "./hospital_video.mp4";


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
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="mb-6">
                {/* <span className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-4">
                  Smart India Hackathon 2025 • Problem ID: 25018
                </span> */}
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  TRIKSHA
                  <span className="block text-2xl md:text-3xl font-normal text-blue-200 mt-2">
                    त्रिक्षा - Your Health, Our Priority
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                  A multilingual, AI-enabled telemedicine platform bringing quality
                  healthcare to rural India through innovative technology.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-900 transition-all duration-300">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-blue-200">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Telemedicine consultation"
                  className="rounded-xl w-full h-64 object-cover mb-6"
                />
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Transforming Rural Healthcare</h3>
                  <p className="text-blue-100 leading-relaxed">
                    Connecting patients in remote areas with qualified doctors through
                    secure video consultations, AI-powered symptom checking, and
                    real-time pharmacy integration.
                  </p>
                </div>
              </div>
            </div>
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