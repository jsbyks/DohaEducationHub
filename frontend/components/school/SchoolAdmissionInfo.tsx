import React from 'react';

interface AdmissionInfoProps {
  entryRequirements?: string;
  applicationDeadline?: string;
  assessmentProcedures?: string;
  requiredDocuments?: string[];
  ageRequirements?: Record<string, { minimum_age: number; cutoff_date: string }>;
  enrollmentSteps?: string[];
  applicationStatus?: string;
}

export const SchoolAdmissionInfo: React.FC<AdmissionInfoProps> = ({
  entryRequirements,
  applicationDeadline,
  assessmentProcedures,
  requiredDocuments,
  ageRequirements,
  enrollmentSteps,
  applicationStatus
}) => {
  return (
    <div className="card card-gradient p-8 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Admission Information
          </h2>
          {applicationStatus && (
            <span className={`px-4 py-2 rounded-full font-bold text-sm ${
              applicationStatus === 'Accepting Applications' ? 'bg-green-100 text-green-800' :
              applicationStatus === 'Limited Spaces' ? 'bg-yellow-100 text-yellow-800' :
              applicationStatus === 'Waiting List' ? 'bg-orange-100 text-orange-800' :
              'bg-red-100 text-red-800'
            }`}>
              {applicationStatus}
            </span>
          )}
        </div>
      </div>

      {/* Application Deadline */}
      {applicationDeadline && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="text-sm text-red-100 font-semibold">Application Deadline</div>
              <div className="text-3xl font-bold mt-1">{new Date(applicationDeadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>
        </div>
      )}

      {/* Entry Requirements */}
      {entryRequirements && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            Entry Requirements
          </h3>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-xl">
            <p className="text-gray-700 leading-relaxed">{entryRequirements}</p>
          </div>
        </div>
      )}

      {/* Age Requirements */}
      {ageRequirements && Object.keys(ageRequirements).length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
            Age Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(ageRequirements).map(([grade, req]) => (
              <div key={grade} className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                <div className="font-bold text-gray-900 mb-2">{grade}</div>
                <div className="text-sm text-gray-600">
                  Minimum age: <span className="font-semibold text-purple-700">{req.minimum_age} years</span>
                </div>
                <div className="text-sm text-gray-600">
                  Cutoff: <span className="font-semibold text-purple-700">{req.cutoff_date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment Procedures */}
      {assessmentProcedures && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
            Assessment Process
          </h3>
          <div className="bg-cyan-50 border-l-4 border-cyan-600 p-4 rounded-r-xl">
            <p className="text-gray-700 leading-relaxed">{assessmentProcedures}</p>
          </div>
        </div>
      )}

      {/* Enrollment Steps */}
      {enrollmentSteps && enrollmentSteps.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-600"></div>
            Enrollment Process
          </h3>
          <div className="space-y-3">
            {enrollmentSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-green-300 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1.5">
                  <p className="text-gray-700 font-medium">{step}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Required Documents */}
      {requiredDocuments && requiredDocuments.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-600"></div>
            Required Documents
          </h3>
          <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-amber-200">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Contact for Admissions */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white text-center">
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <h3 className="text-2xl font-bold mb-2">Ready to Apply?</h3>
        <p className="text-blue-100 mb-6">
          Contact our admissions office for more information or to schedule a school tour
        </p>
        <button className="btn bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-bold">
          Contact Admissions Office
        </button>
      </div>
    </div>
  );
};
