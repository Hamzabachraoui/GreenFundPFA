'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { userService } from '../../../services/users';
import { projectsService } from '../../../services/projects';
import { User, Project } from '../../../types';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [investors, setInvestors] = useState<User[]>([]);
  const [projectOwners, setProjectOwners] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingItem, setDeletingItem] = useState<string | null>(null);

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
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteUser = async (userId: number, userType: 'investor' | 'owner') => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
      return;
    }

    setDeletingItem(`user-${userId}`);
    try {
      await userService.deleteUser(userId);
      
      if (userType === 'investor') {
        setInvestors(prev => prev.filter(user => user.id !== userId));
      } else {
        setProjectOwners(prev => prev.filter(user => user.id !== userId));
      }
      
      alert('Utilisateur supprimé avec succès');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression de l\'utilisateur');
    } finally {
      setDeletingItem(null);
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.')) {
      return;
    }

    setDeletingItem(`project-${projectId}`);
    try {
      await projectsService.deleteProject(projectId);
      setProjects(prev => prev.filter(project => project.id !== projectId));
      alert('Projet supprimé avec succès');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erreur lors de la suppression du projet');
    } finally {
      setDeletingItem(null);
    }
  };

  const handleValidateProject = async (projectId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir valider ce projet ? Il sera alors publié sur la plateforme.')) {
      return;
    }

    setDeletingItem(`validate-${projectId}`);
    try {
      await projectsService.validateProject(projectId);
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, statut: 'EN_COURS' as const }
          : project
      ));
      alert('Projet validé avec succès');
    } catch (error) {
      console.error('Error validating project:', error);
      alert('Erreur lors de la validation du projet');
    } finally {
      setDeletingItem(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  const admins = investors.filter(user => user.role === 'ADMIN');
  const pendingValidationProjects = projects.filter(project => project.statut === 'EN_ATTENTE_VALIDATION');
  const activeProjects = projects.filter(project => project.statut === 'EN_COURS');
  const completedProjects = projects.filter(project => project.statut === 'FINANCE' || project.statut === 'ECHOUE');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* En-tête avec dégradé amélioré */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 py-6 relative overflow-hidden mx-4 my-2 rounded-2xl">
        <div className="absolute inset-0 bg-black opacity-10 rounded-2xl"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3">
              <span className="text-2xl">👑</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">
                Tableau de bord administrateur
              </h1>
              <p className="text-purple-100 text-sm">
                Gérez votre plateforme et suivez les statistiques en temps réel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-2 relative z-20">
        {/* Section Statistiques avec cartes améliorées */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Statistiques générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Carte Administrateurs */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Administrateurs</p>
                  <h3 className="text-3xl font-bold mt-2">{admins.length}</h3>
                  <p className="text-purple-200 text-xs mt-1">Gestionnaires de la plateforme</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <span className="text-2xl">👑</span>
                </div>
              </div>
            </div>

            {/* Carte Porteurs */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Porteurs de projet</p>
                  <h3 className="text-3xl font-bold mt-2">{projectOwners.length}</h3>
                  <p className="text-blue-200 text-xs mt-1">Créateurs de projets</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <span className="text-2xl">🚀</span>
                </div>
              </div>
            </div>

            {/* Carte Investisseurs */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Investisseurs</p>
                  <h3 className="text-3xl font-bold mt-2">{investors.length}</h3>
                  <p className="text-green-200 text-xs mt-1">Financeurs actifs</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>

            {/* Carte Projets */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Projets</p>
                  <h3 className="text-3xl font-bold mt-2">{projects.length}</h3>
                  <p className="text-orange-200 text-xs mt-1">Projets sur la plateforme</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-full p-4">
                  <span className="text-2xl">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Statuts des projets */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Statuts des projets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 rounded-full p-3 mr-4">
                  <span className="text-2xl">⏳</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">En attente</h3>
                  <p className="text-gray-600">Validation requise</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-yellow-600">{pendingValidationProjects.length}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-3 mr-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Actifs</h3>
                  <p className="text-gray-600">En cours de financement</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-blue-600">{activeProjects.length}</div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-3 mr-4">
                  <span className="text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Terminés</h3>
                  <p className="text-gray-600">Financement finalisé</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600">{completedProjects.length}</div>
            </div>
          </div>
        </div>

        {/* Section Tableaux avec style amélioré */}
        <div className="space-y-12">
          {/* Tableau des Projets en attente de validation */}
          {pendingValidationProjects.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-yellow-300">
              <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="mr-3">⏳</span>
                  Projets en attente de validation ({pendingValidationProjects.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-yellow-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Titre</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Porteur</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date création</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {pendingValidationProjects.map(project => (
                      <tr key={project.id} className="hover:bg-yellow-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-yellow-100 rounded-full p-2 mr-3">
                              <span className="text-yellow-600 text-sm">⏳</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{project.titre}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.porteur?.nom || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.montant_actuel}€ / {project.montant_cible}€</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {project.date_creation ? new Date(project.date_creation).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleValidateProject(project.id)}
                            disabled={deletingItem === `validate-${project.id}`}
                            className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                          >
                            {deletingItem === `validate-${project.id}` ? (
                              <span className="flex items-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                Validation...
                              </span>
                            ) : (
                              '✅ Valider'
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={deletingItem === `project-${project.id}`}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                          >
                            {deletingItem === `project-${project.id}` ? (
                              <span className="flex items-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                Suppression...
                              </span>
                            ) : (
                              '🗑️ Supprimer'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tableau des Investisseurs */}
          {investors.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="mr-3">💰</span>
                  Liste des Investisseurs ({investors.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Téléphone</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date d'inscription</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {investors.map(investor => (
                      <tr key={investor.id} className="hover:bg-green-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-green-100 rounded-full p-2 mr-3">
                              <span className="text-green-600 text-sm">💰</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{investor.nom || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{investor.telephone || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {investor.date_inscription ? new Date(investor.date_inscription).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteUser(investor.id, 'investor')}
                            disabled={deletingItem === `user-${investor.id}`}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                          >
                            {deletingItem === `user-${investor.id}` ? (
                              <span className="flex items-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                Suppression...
                              </span>
                            ) : (
                              '🗑️ Supprimer'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tableau des Porteurs de projet */}
          {projectOwners.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="mr-3">🚀</span>
                  Liste des Porteurs de projet ({projectOwners.length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Téléphone</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date d'inscription</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projectOwners.map(owner => (
                      <tr key={owner.id} className="hover:bg-blue-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                              <span className="text-blue-600 text-sm">🚀</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{owner.nom || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{owner.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{owner.telephone || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {owner.date_inscription ? new Date(owner.date_inscription).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteUser(owner.id, 'owner')}
                            disabled={deletingItem === `user-${owner.id}`}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                          >
                            {deletingItem === `user-${owner.id}` ? (
                              <span className="flex items-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                Suppression...
                              </span>
                            ) : (
                              '🗑️ Supprimer'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tableau des Projets */}
          {projects.filter(project => project.statut !== 'EN_ATTENTE_VALIDATION').length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <span className="mr-3">📊</span>
                  Projets validés et actifs ({projects.filter(project => project.statut !== 'EN_ATTENTE_VALIDATION').length})
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Titre</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Porteur</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Montant</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {projects.filter(project => project.statut !== 'EN_ATTENTE_VALIDATION').map(project => (
                      <tr key={project.id} className="hover:bg-purple-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-purple-100 rounded-full p-2 mr-3">
                              <span className="text-purple-600 text-sm">📊</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{project.titre}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.porteur?.nom || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.montant_actuel}€ / {project.montant_cible}€</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                            project.statut === 'EN_COURS' ? 'bg-blue-100 text-blue-800' :
                            project.statut === 'FINANCE' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {project.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            disabled={deletingItem === `project-${project.id}`}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-medium py-2 px-4 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 disabled:transform-none"
                          >
                            {deletingItem === `project-${project.id}` ? (
                              <span className="flex items-center">
                                <LoadingSpinner size="sm" className="mr-2" />
                                Suppression...
                              </span>
                            ) : (
                              '🗑️ Supprimer'
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Message si aucun élément */}
          {investors.length === 0 && projectOwners.length === 0 && projects.length === 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucune donnée disponible</h3>
              <p className="text-gray-600">Le dashboard sera rempli automatiquement lorsque des utilisateurs et projets seront ajoutés à la plateforme.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 