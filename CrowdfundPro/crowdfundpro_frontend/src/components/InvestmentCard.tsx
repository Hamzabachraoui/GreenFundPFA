'use client';

import Link from 'next/link';
import { Investment } from '../types';

interface InvestmentCardProps {
  investment: Investment;
}

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALIDE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REFUSE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VALIDE':
        return '✅';
      case 'EN_ATTENTE':
        return '⏳';
      case 'REFUSE':
        return '❌';
      default:
        return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VALIDE':
        return 'Investissement confirmé';
      case 'EN_ATTENTE':
        return 'En attente de confirmation';
      case 'REFUSE':
        return 'Investissement refusé';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {investment.projet.titre}
            </h3>
            <p className="text-sm text-gray-500">
              par {investment.projet.porteur.nom || investment.projet.porteur.username}
            </p>
          </div>
          <Link
            href={`/projects/${investment.projet.id}`}
            className="text-primary-600 hover:text-primary-700"
          >
            👁️ Voir
          </Link>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Montant investi</p>
            <p className="text-xl font-semibold text-gray-900">
              {investment.montant.toLocaleString()}€
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Date d'investissement</p>
            <p className="text-gray-900">
              {new Date(investment.date_investissement).toLocaleDateString()}
            </p>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(investment.statut)}`}>
            {getStatusIcon(investment.statut)} {getStatusText(investment.statut)}
          </div>
        </div>
      </div>
    </div>
  );
} 