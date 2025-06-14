'use client';

import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { Project } from '../../types';
import { projectsService } from '../../services/projects';
import LoadingSpinner from '../../components/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency } from '../../utils/formatCurrency';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    statut: '',
    ordering: '-date_creation'
  });

  useEffect(() => {
    loadProjects();
  }, [filters]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsService.getProjects(filters);
      setProjects(response.results || []);
      setError(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur lors du chargement des projets');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête avec fond dégradé */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-300">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-3">🚀 Tous les projets</h1>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Découvrez et soutenez les projets innovants qui façonnent l'avenir
            </p>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Rechercher</label>
              <input
                type="text"
                className="input w-full"
                placeholder="Titre ou description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                className="input w-full"
                value={filters.statut}
                onChange={(e) => handleFilterChange('statut', e.target.value)}
              >
                <option value="">Tous les statuts</option>
                <option value="EN_COURS">En cours</option>
                <option value="FINANCE">Financé</option>
                <option value="ECHOUE">Échoué</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Trier par</label>
              <select
                className="input w-full"
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
              >
                <option value="-date_creation">Plus récent</option>
                <option value="date_creation">Plus ancien</option>
                <option value="-objectif">Objectif le plus élevé</option>
                <option value="objectif">Objectif le plus bas</option>
                <option value="-pourcentage_finance">Plus financé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-red-700">
            <div className="flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {/* Liste des projets */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
                {project.image && (
                  <div className="relative h-48">
                    <Image
                      src={project.image}
                      alt={project.titre}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                    <Link href={`/projects/${project.id}`}>
                      {project.titre}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Objectif:</span>
                      <span className="font-semibold">{formatCurrency(project.objectif)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Collecté:</span>
                      <span className="font-semibold text-green-600">{formatCurrency(project.montant_actuel)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progression:</span>
                      <span className="font-semibold">{project.pourcentage_finance}%</span>
                    </div>

                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                        <div
                          className="bg-blue-600 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(project.pourcentage_finance, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        project.statut === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                        project.statut === 'FINANCE' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {project.statut_display}
                      </span>
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        Voir plus →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <p className="text-gray-600 text-lg">Aucun projet trouvé</p>
            <p className="text-gray-500 mt-2">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </Layout>
  );
} 