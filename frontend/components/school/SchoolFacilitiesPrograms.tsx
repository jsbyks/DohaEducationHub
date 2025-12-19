import React from 'react';

interface FacilitiesProgramsProps {
  facilities?: Record<string, boolean>;
  technologyIntegration?: Record<string, boolean>;
  extracurricularActivities?: string[];
  afterschoolCare?: boolean;
  afterschoolCareFee?: number;
  afterschoolCareTimings?: string;
  senSupport?: boolean;
  senPrograms?: Record<string, boolean>;
  giftedPrograms?: boolean;
  counselingServices?: boolean;
}

export const SchoolFacilitiesPrograms: React.FC<FacilitiesProgramsProps> = ({
  facilities,
  technologyIntegration,
  extracurricularActivities,
  afterschoolCare,
  afterschoolCareFee,
  afterschoolCareTimings,
  senSupport,
  senPrograms,
  giftedPrograms,
  counselingServices
}) => {
  const facilityIcons: Record<string, string> = {
    library: "📚",
    science_lab: "🔬",
    computer_lab: "💻",
    sports_hall: "🏀",
    swimming_pool: "🏊",
    football_field: "⚽",
    basketball_court: "🏀",
    playground: "🎪",
    cafeteria: "🍽️",
    auditorium: "🎭",
    music_room: "🎵",
    art_studio: "🎨",
    prayer_room: "🕌",
    medical_room: "🏥",
    counseling_room: "💭"
  };

  const formatLabel = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-8">
      {/* Facilities */}
      {facilities && Object.keys(facilities).some(key => facilities[key]) && (
        <div className="card card-gradient p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Campus Facilities
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(facilities)
              .filter(([_, available]) => available)
              .map(([facility, _]) => (
                <div key={facility} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 hover:scale-105 transition-transform">
                  <div className="text-3xl mb-2">{facilityIcons[facility] || "🏫"}</div>
                  <div className="text-sm font-bold text-gray-900">{formatLabel(facility)}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Technology Integration */}
      {technologyIntegration && Object.keys(technologyIntegration).some(key => technologyIntegration[key]) && (
        <div className="card card-gradient p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Technology & Digital Learning
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(technologyIntegration)
              .filter(([_, available]) => available)
              .map(([tech, _]) => (
                <div key={tech} className="flex items-center gap-3 bg-purple-50 rounded-xl p-4 border border-purple-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="font-semibold text-gray-900">{formatLabel(tech)}</div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Extra-Curricular Activities */}
      {extracurricularActivities && extracurricularActivities.length > 0 && (
        <div className="card card-gradient p-8">
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Extra-Curricular Activities
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {extracurricularActivities.map((activity, index) => (
              <span key={index} className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm hover:bg-green-200 transition-colors">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {activity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Special Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* After-School Care */}
        {afterschoolCare && (
          <div className="card hero-gradient p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">After-School Care</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-blue-100">Available</span>
                <span className="badge bg-white text-blue-600 font-bold">✓ Yes</span>
              </div>
              {afterschoolCareTimings && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Timings</span>
                  <span className="font-bold">{afterschoolCareTimings}</span>
                </div>
              )}
              {afterschoolCareFee && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Fee</span>
                  <span className="font-bold text-xl">QAR {afterschoolCareFee.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SEN Support */}
        {senSupport && (
          <div className="card bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Special Education Needs Support</h3>
            </div>
            {senPrograms && Object.keys(senPrograms).some(key => senPrograms[key]) && (
              <div className="space-y-2">
                {Object.entries(senPrograms)
                  .filter(([_, available]) => available)
                  .map(([program, _]) => (
                    <div key={program} className="flex items-center gap-2 text-gray-700">
                      <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{formatLabel(program)}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Gifted Programs */}
        {giftedPrograms && (
          <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Gifted & Talented</h3>
                <p className="text-sm text-gray-600">Advanced learning programs available</p>
              </div>
            </div>
          </div>
        )}

        {/* Counseling Services */}
        {counselingServices && (
          <div className="card bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Counseling Services</h3>
                <p className="text-sm text-gray-600">Professional student support available</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
