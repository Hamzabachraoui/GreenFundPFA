import Image from 'next/image';
import { Project } from '../types';
import ProjectOwnerActions from './ProjectOwnerActions';

interface ProjectDetailsProps {
  project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden rounded-lg">
        {project.image && (
          <div className="relative h-64 w-full">
            <Image
              src={project.image}
              alt={project.titre}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {project.titre}
          </h1>

          <div className="flex items-center text-sm text-gray-500 mb-6">
            <span>Par {project.porteur.nom || project.porteur.username}</span>
            <span className="mx-2">•</span>
            <span>
              Créé le {new Date(project.date_creation).toLocaleDateString()}
            </span>
          </div>

          <div className="prose max-w-none mb-6">
            <p>{project.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Objectif de financement
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {project.objectif.toLocaleString()}€
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Montant collecté
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {project.montant_actuel.toLocaleString()}€
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date limite
                </dt>
                <dd className="mt-1 text-lg text-gray-900">
                  {new Date(project.date_limite).toLocaleDateString()}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Statut
                </dt>
                <dd className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.statut === 'EN_COURS'
                      ? 'bg-blue-100 text-blue-800'
                      : project.statut === 'FINANCE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {project.statut === 'EN_COURS'
                      ? 'En cours'
                      : project.statut === 'FINANCE'
                      ? 'Financé'
                      : 'Échoué'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary-600 bg-primary-200">
                    Progression
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-primary-600">
                    {Math.round((project.montant_actuel / project.objectif) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary-200">
                <div
                  style={{ width: `${Math.min((project.montant_actuel / project.objectif) * 100, 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action pour le porteur de projet */}
          <ProjectOwnerActions project={project} />
        </div>
      </div>
    </div>
  );
} 