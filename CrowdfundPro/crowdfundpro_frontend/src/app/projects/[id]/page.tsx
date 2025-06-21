'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Project } from '../../../types';
import { projectsService } from '../../../services/projects';
import Layout from '../../../components/Layout';
import LoadingSpinner from '../../../components/LoadingSpinner';
import dynamic from 'next/dynamic';

const ProjectDetails = dynamic(() => import('../../../components/ProjectDetails'), {
  ssr: false,
  loading: () => <div className="flex justify-center items-center min-h-screen"><LoadingSpinner size="lg" /></div>
});

export default function ProjectPage() {
  const { id: projectId } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);
        const projectData = await projectsService.getProject(parseInt(projectId as string));
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProject();
    }
  }, [projectId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Une erreur est survenue
          </h3>
          <p className="text-gray-600">{error || 'Project not found'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <ProjectDetails project={project} />
    </Layout>
  );
} 