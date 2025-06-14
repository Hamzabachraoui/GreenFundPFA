'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Project, Investment } from '../../types';
import { projectsService } from '../../services/projects';
import { investmentsService } from '../../services/investments';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ProjectCard from '../../components/ProjectCard';
import InvestmentCard from '../../components/InvestmentCard';
import ProfileEditModal from '../../components/ProfileEditModal';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoggedIn, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!isLoggedIn || !user) {
        router.push('/auth/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (user.role === 'PORTEUR') {
          const projectsData = await projectsService.getPorteurProjects(user.id.toString());
          setProjects(projectsData.results);
        } else if (user.role === 'INVESTISSEUR') {
          const investmentsData = await investmentsService.getUserInvestments();
          setInvestments(investmentsData);
        }
      } catch (err: any) {
        console.error('Error loading user data:', err);
        setError(err.message || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Une erreur est survenue
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* En-tête du profil avec gradient */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-lg mb-8 text-white">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-24 w-24 rounded-full bg-white bg-opacity-20 flex items-center justify-center border-4 border-white">
                  <span className="text-4xl font-bold text-white">
                    {(user.nom || user.username)[0].toUpperCase()}
                  </span>
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold">
                    {user.nom || user.username}
                  </h1>
                  <p className="text-primary-100">{user.email}</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-white bg-opacity-20`}>
                      {user.role === 'ADMIN' && '👑 Administrateur'}
                      {user.role === 'PORTEUR' && '🚀 Porteur de projet'}
                      {user.role === 'INVESTISSEUR' && '💰 Investisseur'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center px-4 py-2 border-2 border-white rounded-md shadow-sm text-sm font-medium text-white hover:bg-white hover:text-primary-600 transition-colors duration-200"
              >
                ✏️ Modifier le profil
              </button>
            </div>

            <div className="mt-6 border-t border-white border-opacity-20 pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-primary-100">
                    Membre depuis
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(user.date_inscription).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </dd>
                </div>

                {user.telephone && (
                  <div>
                    <dt className="text-sm font-medium text-primary-100">
                      Téléphone
                    </dt>
                    <dd className="mt-1 text-sm text-white">
                      {user.telephone}
                    </dd>
                  </div>
                )}

                {user.adresse && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-primary-100">
                      Adresse
                    </dt>
                    <dd className="mt-1 text-sm text-white">
                      {user.adresse}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>

        {/* Contenu spécifique au rôle */}
        {user.role === 'PORTEUR' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                🚀 Mes projets
              </h2>
              <button
                onClick={() => router.push('/dashboard/porteur/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                ➕ Créer un projet
              </button>
            </div>
            
            {projects.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">🎯</div>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore créé de projets.
                </p>
                <button
                  onClick={() => router.push('/dashboard/porteur/create')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  🚀 Créer mon premier projet
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        )}

        {user.role === 'INVESTISSEUR' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                💰 Mes investissements
              </h2>
              <button
                onClick={() => router.push('/projects')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                🔍 Découvrir des projets
              </button>
            </div>
            
            {investments.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">💡</div>
                <p className="text-gray-600 mb-4">
                  Vous n'avez pas encore effectué d'investissements.
                </p>
                <button
                  onClick={() => router.push('/projects')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  🔍 Découvrir des projets
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {investments.map((investment) => (
                  <InvestmentCard key={investment.id} investment={investment} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal de modification du profil */}
        {showEditModal && (
          <ProfileEditModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            user={user}
            onSuccess={() => {
              refreshUser();
              setShowEditModal(false);
            }}
          />
        )}
      </div>
    </Layout>
  );
} 