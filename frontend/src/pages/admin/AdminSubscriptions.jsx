import React from 'react'
import { Check, X } from 'lucide-react'

const AdminSubscriptions = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$49',
      features: ['Up to 2 Doctors', 'Basic Analytics', 'Email Support'],
      missing: ['Custom Branding', 'Priority Support', 'Advanced Reports'],
      recommended: false,
    },
    {
      name: 'Pro',
      price: '$99',
      features: ['Up to 10 Doctors', 'Advanced Analytics', 'Priority Support', 'Custom Branding'],
      missing: ['Dedicated Account Manager'],
      recommended: true,
    },
    {
      name: 'Enterprise',
      price: '$199',
      features: ['Unlimited Doctors', 'Custom Reports', '24/7 Phone Support', 'Dedicated Account Manager', 'Custom Branding'],
      missing: [],
      recommended: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Subscription Plans</h1>
        <p className="text-gray-500 mt-2">Manage and simulate pricing tiers for clinics. (Simulation Only)</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white rounded-2xl p-8 shadow-sm border ${
              plan.recommended ? 'border-blue-500 ring-1 ring-blue-500 shadow-blue-100' : 'border-gray-200'
            } transition-transform duration-300 hover:-translate-y-1`}
          >
            {plan.recommended && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-bold text-gray-800 text-center">{plan.name}</h3>
            <div className="mt-4 text-center">
              <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
              <span className="text-gray-500 text-sm">/mo</span>
            </div>

            <ul className="mt-8 space-y-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-600">
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
              {plan.missing.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-400">
                  <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`mt-8 w-full py-3 rounded-xl font-medium transition-colors ${
                plan.recommended
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
              }`}
            >
              Edit Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminSubscriptions
