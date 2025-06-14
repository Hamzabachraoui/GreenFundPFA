'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { projectsService } from '../../services/projects';
import { Project } from '../../types';
import Layout from '../../components/Layout';

export default function TestProjectsPage() {
  const { user, isLoggedIn } = useAuth();
  const [userProjects, setUserProjects] = useState<Project[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoggedIn && user) {
      testProjectsEndpoints();
    }
  }, [isLoggedIn, user]);

  const testProjectsEndpoints = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Testing projects endpoints...');
      console.log('👤 Current user:', user);

      // Test 1: Get all projects
      console.log('📋 Test 1: Getting all projects...');
      const allProjectsResponse = await projectsService.getProjects();
      setAllProjects(allProjectsResponse.results);
      console.log('✅ All projects:', allProjectsResponse.results);

      // Test 2: Get user's projects
      console.log('🚀 Test 2: Getting user projects...');
      const myProjects = await projectsService.getUserProjects();
      setUserProjects(myProjects);
      console.log('✅ User projects:', myProjects);

      // Test 3: Filter manually
      console.log('🔍 Test 3: Manual filtering...');
      const manuallyFiltered = allProjectsResponse.results.filter(
        project => project.porteur?.id === user?.id ||
                  project.porteur?.email === user?.email ||
                  project.porteur?.username === user?.username
      );
      console.log('🎯 Manually filtered projects:', manuallyFiltered);

    } catch (err: any) {
      console.error('❌ Error in tests:', err);
      setError(err.message || 'Erreur lors des tests');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">🔐 Test Projects</h1>
          <p>Vous devez être connecté pour voir cette page de test.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">🧪 Test Projects Debug</h1>
        
        {loading && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
            ⏳ Chargement des tests...
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded mb-4 text-red-800">
            ❌ Erreur: {error}
          </div>
        )}

        {/* User Info */}
        <div className="bg-gray-50 border border-gray-200 p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">👤 Informations utilisateur</h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><strong>ID:</strong> {user?.id}</div>
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Username:</strong> {user?.username}</div>
            <div><strong>Nom:</strong> {user?.nom}</div>
            <div><strong>Rôle:</strong> {user?.role}</div>
          </div>
        </div>

        {/* All Projects */}
        <div className="bg-white border border-gray-200 p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">📋 Tous les projets ({allProjects.length})</h2>
          {allProjects.length > 0 ? (
            <div className="space-y-2">
              {allProjects.map((project) => (
                <div key={project.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-medium">{project.titre}</div>
                  <div className="text-sm text-gray-600">
                    Porteur: {project.porteur?.nom || project.porteur?.username} 
                    (ID: {project.porteur?.id}, Email: {project.porteur?.email})
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Aucun projet trouvé.</p>
          )}
        </div>

        {/* User Projects */}
        <div className="bg-green-50 border border-green-200 p-4 rounded mb-6">
          <h2 className="text-lg font-semibold mb-2">🚀 Mes projets ({userProjects.length})</h2>
          {userProjects.length > 0 ? (
            <div className="space-y-2">
              {userProjects.map((project) => (
                <div key={project.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <div className="font-medium">{project.titre}</div>
                  <div className="text-sm text-gray-600">
                    Porteur: {project.porteur?.nom || project.porteur?.username}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">
              <p>Aucun projet trouvé pour cet utilisateur.</p>
              <p className="text-sm mt-2">
                Vérifiez la console du navigateur pour plus de détails.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button 
            onClick={testProjectsEndpoints}
            disabled={loading}
            className="btn btn-primary"
          >
            🔄 Relancer les tests
          </button>
          <button 
            onClick={() => {
              console.clear();
              testProjectsEndpoints();
            }}
            disabled={loading}
            className="btn btn-outline"
          >
            🧹 Clear console et relancer
          </button>
        </div>
      </div>
    </Layout>
  );
} 