'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import Layout from '../../../../components/Layout';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import { Project } from '../../../../types';
import api from '../../../../services/api';
import { formatCurrency } from '../../../../utils/format';
import Image from 'next/image';

export default function AdminProjectsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/auth/login');
      return;
    }

    loadProjects();
  }, [user, authLoading, router]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/projects/');
      setProjects(response.data.results || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des projets:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'EN_COURS':
        return 'bg-blue-100 text-blue-800';
      case 'FINANCE':
        return 'bg-green-100 text-green-800';
      case 'ECHOUE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'EN_COURS':
        return '🔄';
      case 'FINANCE':
        return '✅';
      case 'ECHOUE':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.statut === 'EN_COURS').length;
  const successfulProjects = projects.filter(p => p.statut === 'FINANCE').length;
  const totalFunding = projects.reduce((sum, p) => sum + p.montant_actuel, 0);

  return (
    <div className="space-y-6 p-6">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">🚀 Gestion des Projets</h2>
            <p className="opacity-90">Liste de tous les projets de la plateforme</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/admin')}
            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-all duration-200 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Retour au Dashboard</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projets</p>
              <p className="text-2xl font-bold text-gray-900">{totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Financement Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalFunding)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <span className="text-2xl">🔄</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Cours</p>
              <p className="text-2xl font-bold text-gray-900">{activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Financés</p>
              <p className="text-2xl font-bold text-gray-900">{successfulProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des projets */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Porteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Financement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Limite
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <Image
                          src={project.image || '/placeholder.jpg'}
                          alt={project.titre}
                          fill
                          className="rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {project.titre}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {project.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                        {(project.porteur?.nom || project.porteur?.username || 'U')[0].toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {project.porteur?.nom || project.porteur?.username}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.porteur?.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(project.montant_actuel)}
                    </div>
                    <div className="text-sm text-gray-500">
                      sur {formatCurrency(project.montant_cible)} ({Math.round((project.montant_actuel / project.montant_cible) * 100)}%)
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-primary-600 h-1.5 rounded-full" 
                        style={{ width: `${Math.min(100, (project.montant_actuel / project.montant_cible) * 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${getStatusBadgeClass(project.statut)}`}>
                      {getStatusEmoji(project.statut)} {project.statut}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(project.date_limite).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-primary-600 hover:text-primary-900 mr-4">
                      Voir
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 