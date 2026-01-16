import React from 'react';
import { Heart, TrendingUp, Users, Building, Globe, DollarSign } from 'lucide-react';

const Impact = () => {
  type ImpactColor = 'red' | 'green' | 'blue' | 'purple' | 'teal' | 'orange';

  type ImpactType = {
    icon: React.ReactNode;
    title: string;
    description: string;
    benefits: string[];
    stats: string;
    color: ImpactColor;
  };

  const impacts: ImpactType[] = [
    {
      icon: <Heart className="h-12 w-12 text-red-500" />,
      title: 'Healthcare Impact',
      description: 'Revolutionizing healthcare delivery in rural India',
      benefits: [
        'Reduced travel time by 80% for medical consultations',
        'Increased doctor accessibility from 1:1700 to 1:500 ratio',
        'Early disease detection through AI-powered symptom checking',
        'Improved maternal and child healthcare outcomes'
      ],
      stats: '1M+ Lives Impacted',
      color: 'red'
    },
    {
      icon: <DollarSign className="h-12 w-12 text-green-500" />,
      title: 'Economic Impact',
      description: 'Reducing healthcare costs and improving economic outcomes',
      benefits: [
        '60% reduction in healthcare expenses for rural families',
        'Decreased loss of income due to travel for medical care',
        'Job creation in telemedicine and healthcare technology',
        'Improved productivity through better health outcomes'
      ],
      stats: '₹500Cr+ Saved Annually',
      color: 'green'
    },
    {
      icon: <Users className="h-12 w-12 text-blue-500" />,
      title: 'Social Impact',
      description: 'Building stronger, healthier communities',
      benefits: [
        'Reduced health inequity between urban and rural areas',
        'Improved quality of life for elderly and disabled patients',
        'Enhanced health literacy through AI-powered education',
        'Strengthened community health networks'
      ],
      stats: '500+ Communities Connected',
      color: 'blue'
    },
    {
      icon: <Building className="h-12 w-12 text-purple-500" />,
      title: 'Government Impact',
      description: 'Supporting public health initiatives and policy',
      benefits: [
        'Real-time health data for evidence-based policy making',
        'Improved monitoring of public health programs',
        'Enhanced emergency response capabilities',
        'Integration with National Digital Health Mission'
      ],
      stats: '25+ Districts Connected',
      color: 'purple'
    },
    {
      icon: <Globe className="h-12 w-12 text-teal-500" />,
      title: 'Environmental Impact',
      description: 'Reducing carbon footprint through digital healthcare',
      benefits: [
        '70% reduction in travel-related carbon emissions',
        'Decreased paper usage through digital health records',
        'Reduced vehicle pollution from medical visits',
        'Sustainable healthcare delivery model'
      ],
      stats: '10K+ Tons CO₂ Saved',
      color: 'teal'
    },
    {
      icon: <TrendingUp className="h-12 w-12 text-orange-500" />,
      title: 'Scalability Impact',
      description: 'Building a foundation for nationwide healthcare access',
      benefits: [
        'Replicable model across all Indian states',
        'Integration with existing healthcare infrastructure',
        'Potential to serve 500M+ rural population',
        'Foundation for future healthcare innovations'
      ],
      stats: 'Pan-India Scalability',
      color: 'orange'
    }
  ];

  const colorClasses: Record<ImpactColor, string> = {
    red: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
    green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    teal: 'from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700',
    orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
  };

  const overallStats = [
    { number: '1M+', label: 'Patients Served', icon: '🏥' },
    { number: '5000+', label: 'Doctors Connected', icon: '👨‍⚕️' },
    { number: '500+', label: 'Villages Covered', icon: '🏘️' },
    { number: '₹500Cr+', label: 'Healthcare Savings', icon: '💰' },
    { number: '80%', label: 'Time Saved', icon: '⏰' },
    { number: '95%', label: 'User Satisfaction', icon: '😊' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Transforming Healthcare Impact
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Measuring the real-world impact of TRIKSHA across healthcare,
            economic, social, and environmental dimensions.
          </p>
        </div>
      </section>

      {/* Overall Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Impact by Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real metrics demonstrating TRIKSHA's transformative impact on rural healthcare delivery.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {overallStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-xl text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Impact Analysis
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              TRIKSHA's multi-dimensional impact across various sectors of society and economy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {impacts.map((impact, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-102 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${colorClasses[impact.color]} p-6 text-white`}>
                  <div className="flex items-center mb-4">
                    {impact.icon}
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold mb-1">
                        {impact.title}
                      </h3>
                      <p className="text-sm opacity-90">
                        {impact.description}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold bg-white/20 px-3 py-1 rounded-full">
                      {impact.stats}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Key Benefits:</h4>
                  <ul className="space-y-3">
                    {impact.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colorClasses[impact.color]} mt-2 flex-shrink-0`}></div>
                        <span className="text-gray-700 leading-relaxed">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from communities transformed by TRIKSHA's telemedicine platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Village Health Transformation",
                location: "Malwa Region, Punjab",
                story: "Reduced emergency hospital visits by 70% through early detection and remote consultations.",
                impact: "300 families benefited"
              },
              {
                title: "Maternal Care Success",
                location: "Rural Mathura District",
                story: "Zero maternal mortality in participating villages through continuous remote monitoring.",
                impact: "150+ safe deliveries"
              },
              {
                title: "Chronic Disease Management",
                location: "Remote Farming Communities",
                story: "Improved diabetes and hypertension management through regular virtual check-ups.",
                impact: "80% better outcomes"
              }
            ].map((story, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{story.title}</h4>
                <p className="text-sm text-blue-600 mb-3 font-medium">{story.location}</p>
                <p className="text-gray-600 mb-4 leading-relaxed">{story.story}</p>
                <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                  {story.impact}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Impact Projections */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Future Impact Projections
            </h2>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              By 2030, TRIKSHA aims to transform healthcare access across rural India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { target: '50M+', metric: 'Rural Patients', year: '2030' },
              { target: '25,000+', metric: 'Healthcare Providers', year: '2030' },
              { target: '28 States', metric: 'Complete Coverage', year: '2028' },
              { target: '₹10,000Cr', metric: 'Healthcare Savings', year: '2030' }
            ].map((projection, index) => (
              <div key={index} className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-3xl font-bold mb-2">{projection.target}</div>
                <div className="text-sm text-green-100 mb-1">{projection.metric}</div>
                <div className="text-xs text-green-200">by {projection.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;