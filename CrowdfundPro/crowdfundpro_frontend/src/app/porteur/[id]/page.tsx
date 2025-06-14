'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Project } from '../../../types';
import { projectsService } from '../../../services/projects';
import Layout from '../../../components/Layout';
import ProjectCard from '../../../components/ProjectCard';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function PorteurPage() {
  const { id } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPorteurData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Charger les projets du porteur
        const response = await projectsService.getPorteurProjects(id as string);
        setProjects(response.results);
      } catch (err: any) {
        console.error('Erreur lors du chargement:', err);
        setError(err.message || 'Une erreur est survenue lors du chargement du profil');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPorteurData();
    }
  }, [id]);

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
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Projets du porteur
          </h1>

          {projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">
                Ce porteur n'a pas encore de projets.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 