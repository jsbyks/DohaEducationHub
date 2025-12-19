import React from 'react';

interface FinancialDetailsProps {
  tuitionFeesByGrade?: Record<string, number>;
  registrationFee?: number;
  registrationFeeRefundable?: boolean;
  depositRequired?: number;
  depositRefundable?: boolean;
  additionalCosts?: Record<string, number>;
  paymentTerms?: string[];
  acceptsEducationalVoucher?: boolean;
  educationalVoucherAmount?: number;
  corporateDiscountsAvailable?: boolean;
  siblingDiscountPercentage?: number;
  currency?: string;
}

export const SchoolFinancialDetails: React.FC<FinancialDetailsProps> = ({
  tuitionFeesByGrade,
  registrationFee,
  registrationFeeRefundable,
  depositRequired,
  depositRefundable,
  additionalCosts,
  paymentTerms,
  acceptsEducationalVoucher,
  educationalVoucherAmount = 28000,
  corporateDiscountsAvailable,
  siblingDiscountPercentage,
  currency = 'QAR'
}) => {
  return (
    <div className="card card-gradient p-8 space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Fees & Financial Information
        </h2>
      </div>

      {/* Tuition Fees by Grade */}
      {tuitionFeesByGrade && Object.keys(tuitionFeesByGrade).length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            Annual Tuition Fees
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(tuitionFeesByGrade).map(([grade, fee]) => (
              <div key={grade} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200 hover:scale-105 transition-transform">
                <div className="text-sm font-semibold text-gray-600 mb-1">{grade}</div>
                <div className="text-2xl font-bold gradient-text-ocean">{currency} {fee.toLocaleString()}</div>
                <div className="text-xs text-gray-500 mt-1">per year</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* One-time Fees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {registrationFee !== undefined && (
          <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-gray-900">Registration Fee</h4>
              {!registrationFeeRefundable && (
                <span className="badge badge-red text-xs">Non-Refundable</span>
              )}
            </div>
            <div className="text-3xl font-bold text-amber-700">{currency} {registrationFee.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-2">One-time payment</div>
          </div>
        )}

        {depositRequired !== undefined && (
          <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-gray-900">Deposit</h4>
              {depositRefundable && (
                <span className="badge badge-green text-xs">Refundable</span>
              )}
            </div>
            <div className="text-3xl font-bold text-green-700">{currency} {depositRequired.toLocaleString()}</div>
            <div className="text-sm text-gray-600 mt-2">Required at enrollment</div>
          </div>
        )}
      </div>

      {/* Additional Costs */}
      {additionalCosts && Object.keys(additionalCosts).length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-600"></div>
            Additional Costs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(additionalCosts).map(([item, cost]) => (
              <div key={item} className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-colors">
                <div className="text-sm text-gray-600 capitalize">{item.replace(/_/g, ' ')}</div>
                <div className="text-lg font-bold text-gray-900">{currency} {cost.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Options */}
      {paymentTerms && paymentTerms.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-600"></div>
            Payment Options
          </h3>
          <div className="flex flex-wrap gap-3">
            {paymentTerms.map((term, index) => (
              <span key={index} className="inline-flex items-center px-4 py-2 bg-cyan-100 text-cyan-800 rounded-full font-semibold text-sm">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {term}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Special Offers & Discounts */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
          Special Offers & Discounts
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {acceptsEducationalVoucher && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="font-bold text-sm">Educational Voucher</div>
              <div className="text-2xl font-bold my-1">{currency} {educationalVoucherAmount.toLocaleString()}</div>
              <div className="text-xs opacity-90">Accepted for eligible students</div>
            </div>
          )}

          {siblingDiscountPercentage && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div className="font-bold text-sm">Sibling Discount</div>
              <div className="text-2xl font-bold my-1">{siblingDiscountPercentage}% OFF</div>
              <div className="text-xs opacity-90">For additional children</div>
            </div>
          )}

          {corporateDiscountsAvailable && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div className="font-bold text-sm">Corporate Discounts</div>
              <div className="text-2xl font-bold my-1">Available</div>
              <div className="text-xs opacity-90">Contact school for details</div>
            </div>
          )}
        </div>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="font-bold text-yellow-800 mb-1">Important</div>
            <p className="text-sm text-yellow-700">
              Fees are subject to change and should be confirmed directly with the school. All amounts shown are approximate and may vary based on grade level and additional services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
