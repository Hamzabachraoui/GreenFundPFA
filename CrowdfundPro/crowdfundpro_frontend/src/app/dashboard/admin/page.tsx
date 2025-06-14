'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/users';
import { projectsService } from '../../../services/projects';
import Link from 'next/link';
import { User, Project } from '../../../types';
import Layout from '../../../components/Layout';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [investors, setInvestors] = useState<User[]>([]);
  const [projectOwners, setProjectOwners] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, projectsData] = await Promise.all([
          userService.getUsers(),
          projectsService.getProjects()
        ]);

        setInvestors(usersData.filter((user: User) => user.role === 'INVESTISSEUR'));
        setProjectOwners(usersData.filter((user: User) => user.role === 'PORTEUR'));
        setProjects(projectsData.results || []);
        
        // Récupérer les 5 derniers utilisateurs et projets
        const sortedUsers = [...usersData].sort((a, b) => 
          new Date(b.date_inscription || 0).getTime() - new Date(a.date_inscription || 0).getTime()
        );
        setRecentUsers(sortedUsers.slice(0, 5));

        const sortedProjects = [...(projectsData.results || [])].sort((a, b) =>
          new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime()
        );
        setRecentProjects(sortedProjects.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const admins = investors.filter(user => user.role === 'ADMIN');

  return (
    <Layout>
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Tableau de bord administrateur
          </h1>
          <p className="text-purple-100">
            Gérez votre plateforme et suivez les statistiques en temps réel
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Carte Administrateurs */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <span className="text-2xl">👑</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Administrateurs</p>
                <h3 className="text-2xl font-bold text-gray-900">{admins.length}</h3>
              </div>
            </div>
          </div>

          {/* Carte Porteurs */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Porteurs</p>
                <h3 className="text-2xl font-bold text-gray-900">{projectOwners.length}</h3>
              </div>
            </div>
          </div>

          {/* Carte Investisseurs */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-green-100 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Investisseurs</p>
                <h3 className="text-2xl font-bold text-gray-900">{investors.length}</h3>
              </div>
            </div>
          </div>

          {/* Carte Projets */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-yellow-100 transform transition-all duration-300 hover:scale-105">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Projets</p>
                <h3 className="text-2xl font-bold text-gray-900">{projects.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Sections récentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Investisseurs récents */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Investisseurs récents</h2>
              <Link 
                href="/dashboard/admin/users" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Voir tous →
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.filter(u => u.role === 'INVESTISSEUR').map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      {user.nom?.[0] || '?'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.date_inscription || '').toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Porteurs récents */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Porteurs de projet récents</h2>
              <Link 
                href="/dashboard/admin/users" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Voir tous →
              </Link>
            </div>
            <div className="space-y-4">
              {recentUsers.filter(u => u.role === 'PORTEUR').map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      {user.nom?.[0] || '?'}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(user.date_inscription || '').toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Projets récents */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Projets récents</h2>
              <Link 
                href="/dashboard/admin/projects" 
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Voir tous →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Porteur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentProjects.map(project => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {project.titre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.porteur?.nom || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.montant_cible.toLocaleString()} DH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.statut === 'EN_COURS' ? 'bg-yellow-100 text-yellow-800' :
                          project.statut === 'FINANCE' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.statut}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 