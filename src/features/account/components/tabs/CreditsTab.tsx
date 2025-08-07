'use client';

import { CreditCardIcon } from '@heroicons/react/24/outline';
import { UserStats, CreditTransaction } from '../../../../types/account';

interface CreditsTabProps {
  stats: UserStats | null;
  creditHistory: CreditTransaction[];
  onCreditPurchase: (amount: number) => Promise<void>;
  isUpdating: boolean;
}

export default function CreditsTab({ 
  stats, 
  creditHistory, 
  onCreditPurchase, 
  isUpdating 
}: CreditsTabProps) {
  return (
    <div className="space-y-6">
      {/* Current Balance */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Current Balance</h4>
            <div className="text-4xl font-bold text-gray-900">{stats?.totalCredits || 0}</div>
            <div className="text-sm text-gray-600">Credits available</div>
          </div>
          <CreditCardIcon className="w-16 h-16 text-gray-300" />
        </div>
      </div>

      {/* Purchase Credits */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h4 className="font-semibold text-gray-900 mb-4">Purchase Credits</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => onCreditPurchase(50)}
            disabled={isUpdating}
            className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg p-4 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="text-2xl font-bold">50 Credits</div>
            <div className="text-sm opacity-90">$1.00</div>
          </button>
          <button
            onClick={() => onCreditPurchase(300)}
            disabled={isUpdating}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg p-4 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="text-2xl font-bold">300 Credits</div>
            <div className="text-sm opacity-90">$5.00</div>
          </button>
          <button
            onClick={() => onCreditPurchase(650)}
            disabled={isUpdating}
            className="bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg p-4 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="text-2xl font-bold">650 Credits</div>
            <div className="text-sm opacity-90">$10.00</div>
          </button>
        </div>
      </div>

      {/* Credit History */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <h4 className="font-semibold text-gray-900 mb-4">Credit History</h4>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {creditHistory.length > 0 ? (
            creditHistory.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    transaction.type === 'earned' ? 'bg-gray-800' : 
                    transaction.type === 'spent' ? 'bg-gray-500' : 'bg-gray-600'
                  }`} />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${
                  transaction.type === 'earned' ? 'text-gray-800' : 
                  transaction.type === 'spent' ? 'text-gray-600' : 'text-gray-700'
                }`}>
                  {transaction.type === 'spent' ? '-' : '+'}
                  {Math.abs(transaction.amount)}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f5f5f7] rounded-lg p-8 text-center">
              <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No credit transactions yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
