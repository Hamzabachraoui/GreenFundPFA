'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { projectsService } from '../services/projects';

interface ProjectOwnerActionsProps {
  project: Project;
}

export default function ProjectOwnerActions({ project }: ProjectOwnerActionsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Vérifie si l'utilisateur connecté est le porteur du projet
  const isProjectOwner = user?.id === project.porteur.id;

  if (!isProjectOwner) return null;

  const handleEdit = () => {
    router.push(`/dashboard/porteur/projects/${project.id}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await projectsService.deleteProject(project.id.toString());
      router.push('/projects');
      router.refresh();
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={handleEdit}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          disabled={loading}
        >
          ✏️ Modifier
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Suppression...
            </>
          ) : (
            '🗑️ Supprimer'
          )}
        </button>
      </div>
    </div>
  );
} 