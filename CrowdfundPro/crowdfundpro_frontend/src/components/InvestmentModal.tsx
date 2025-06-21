'use client';

import { useState } from 'react';
import { Project } from '../types';
import { investmentsService } from '../services/investments';
import LoadingSpinner from './LoadingSpinner';
import { formatCurrency } from '../utils/format';

interface InvestmentModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function InvestmentModal({ project, isOpen, onClose, onSuccess }: InvestmentModalProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    if (parseFloat(amount) > project.objectif - project.montant_actuel) {
      setError(`Le montant maximum restant à collecter est de ${formatCurrency(project.objectif - project.montant_actuel)}`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await investmentsService.createInvestment({
        projet: project.id,
        montant: parseFloat(amount)
      });
      
      onSuccess();
      onClose();
      setAmount('');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'investissement');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setAmount('');
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  const remainingAmount = project.objectif - project.montant_actuel;
  const progress = (project.montant_actuel / project.objectif) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">💰 Investir dans ce projet</h2>
            <button
              onClick={handleClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Project Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{project.titre}</h3>
            <p className="text-sm text-gray-600 mb-4">{project.description.substring(0, 100)}...</p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progression</span>
                <span>{progress.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Objectif:</span>
                <div className="font-semibold text-gray-900">{formatCurrency(project.objectif)}</div>
              </div>
              <div>
                <span className="text-gray-600">Collecté:</span>
                <div className="font-semibold text-green-600">{formatCurrency(project.montant_actuel)}</div>
              </div>
              <div>
                <span className="text-gray-600">Restant:</span>
                <div className="font-semibold text-blue-600">{formatCurrency(remainingAmount)}</div>
              </div>
              <div>
                <span className="text-gray-600">Investisseurs:</span>
                <div className="font-semibold text-gray-900">{project.investissements?.length || 0}</div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Investment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Montant de votre investissement (DH)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">DH</span>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1"
                  max={remainingAmount}
                  step="0.01"
                  required
                  disabled={loading}
                  className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:opacity-50"
                  placeholder={`Montant maximum: ${formatCurrency(remainingAmount)}`}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Montant maximum: {formatCurrency(remainingAmount)}
              </p>
            </div>

            {/* Investment Benefits */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">🎯 Avantages de votre investissement</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Participation au succès du projet</li>
                <li>• Retour sur investissement potentiel</li>
                <li>• Suivi en temps réel de l'avancement</li>
                <li>• Communication directe avec le porteur</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading || !amount || parseFloat(amount) <= 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    <span>Investissement...</span>
                  </div>
                ) : (
                  <span>💰 Investir maintenant</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 