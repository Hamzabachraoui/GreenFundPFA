'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { investmentsService } from '../services/investments';
import { Project } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onSuccess?: () => void;
}

export default function InvestmentModal({ isOpen, onClose, project, onSuccess }: InvestmentModalProps) {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    const investmentAmount = parseFloat(amount);
    if (!investmentAmount || investmentAmount <= 0) {
      setError('Veuillez entrer un montant valide');
      return;
    }

    if (investmentAmount < 10) {
      setError('Le montant minimum d\'investissement est de 10€');
      return;
    }

    const remainingAmount = project.objectif - project.montant_actuel;
    if (investmentAmount > remainingAmount) {
      setError(`Le montant maximum disponible est de ${remainingAmount}€`);
      return;
    }

    try {
      setLoading(true);
      setStep('processing');

      // Create investment
      const response = await investmentsService.createInvestment({
        projet: project.id,
        montant: investmentAmount
      });

      console.log('Investment created:', response);
      
      // For now, we'll mark as successful (in a real app, this would go through Stripe)
      setStep('success');
      setSuccess('Investissement créé avec succès !');
      
      if (onSuccess) {
        onSuccess();
      }

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setStep('form');
        setAmount('');
        setSuccess('');
      }, 2000);

    } catch (error: any) {
      console.error('Investment error:', error);
      setError(error.response?.data?.error || 'Erreur lors de la création de l\'investissement');
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const progressPercentage = (project.montant_actuel / project.objectif) * 100;
  const remainingAmount = project.objectif - project.montant_actuel;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {step === 'form' && (
          <>
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  💰 Investir dans ce projet
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Project info */}
            <div className="p-6 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-900 mb-2">{project.titre}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Objectif:</span>
                  <span className="font-medium">{formatCurrency(project.objectif)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Collecté:</span>
                  <span className="font-medium text-green-600">{formatCurrency(project.montant_actuel)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Restant:</span>
                  <span className="font-medium text-blue-600">{formatCurrency(remainingAmount)}</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progression</span>
                  <span>{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Investment form */}
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Montant à investir (€)
                </label>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10"
                  max={remainingAmount}
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 100"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Montant minimum: 10€ • Maximum disponible: {formatCurrency(remainingAmount)}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-medium text-blue-900 mb-2">ℹ️ Informations importantes</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Votre investissement sera traité de manière sécurisée</li>
                  <li>• Vous recevrez une confirmation par email</li>
                  <li>• Les fonds seront transférés au porteur si l'objectif est atteint</li>
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 btn btn-outline"
                  disabled={loading}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Investir'}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 'processing' && (
          <div className="p-8 text-center">
            <LoadingSpinner size="lg" />
            <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              Traitement en cours...
            </h3>
            <p className="text-gray-600">
              Nous traitons votre investissement. Veuillez patienter.
            </p>
          </div>
        )}

        {step === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🎉 Investissement réussi !
            </h3>
            <p className="text-gray-600 mb-4">
              Votre investissement de {formatCurrency(parseFloat(amount))} a été créé avec succès.
            </p>
            <p className="text-sm text-gray-500">
              Cette fenêtre va se fermer automatiquement...
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 