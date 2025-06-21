'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import ProjectOwnerActions from './ProjectOwnerActions';
import dynamic from 'next/dynamic';
import InvestmentModal from './InvestmentModal';
import { formatCurrency } from '../utils/format';

const ProjectMap = dynamic(() => import('./ProjectMap'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Chargement de la carte...</div>
});

interface ProjectDetailsProps {
  project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
  const { user } = useAuth();
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);

  // Vérifier si l'utilisateur peut investir
  const canInvest = user && 
    user.role === 'INVESTISSEUR' && 
    project.statut === 'EN_COURS' &&
    project.montant_actuel < project.objectif;

  // Vérifier si l'utilisateur est le porteur du projet
  const isProjectOwner = user && user.id === project.porteur.id;

  const handleInvestmentSuccess = () => {
    // Recharger la page pour mettre à jour les données
    window.location.reload();
  };

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

          {/* Localisation avec carte */}
          {project.latitude && project.longitude && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📍</span>
                Localisation du projet
              </h3>
              {project.adresse && (
                <p className="text-gray-700 mb-3">{project.adresse}</p>
              )}
              <ProjectMap
                latitude={project.latitude}
                longitude={project.longitude}
                title={project.titre}
                address={project.adresse}
              />
            </div>
          )}

          {/* Localisation textuelle si pas de coordonnées GPS */}
          {project.adresse && !project.latitude && !project.longitude && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                <span className="mr-2">📍</span>
                Localisation du projet
              </h3>
              <p className="text-gray-700">{project.adresse}</p>
            </div>
          )}

          {/* Documents */}
          {(project.business_plan || project.plan_juridique) && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <span className="mr-2">📄</span>
                Documents du projet
              </h3>
              <div className="space-y-2">
                {project.business_plan && (
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <span className="mr-2">📊</span>
                      <span className="font-medium">Business Plan</span>
                    </div>
                    <a
                      href={project.business_plan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Télécharger →
                    </a>
                  </div>
                )}
                {project.plan_juridique && (
                  <div className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center">
                      <span className="mr-2">⚖️</span>
                      <span className="font-medium">Plan Juridique et Réglementaire</span>
                    </div>
                    <a
                      href={project.plan_juridique}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Télécharger →
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Objectif de financement
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-gray-900">
                  {formatCurrency(project.objectif)}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Montant collecté
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-green-600">
                  {formatCurrency(project.montant_actuel)}
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
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Progression
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {Math.round((project.montant_actuel / project.objectif) * 100)}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${Math.min((project.montant_actuel / project.objectif) * 100, 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bouton d'investissement pour les investisseurs */}
          {canInvest && !isProjectOwner && (
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  💰 Prêt à investir dans ce projet ?
                </h3>
                <p className="text-gray-600 mb-4">
                  Rejoignez les investisseurs et participez au succès de ce projet innovant !
                </p>
                <button
                  onClick={() => setShowInvestmentModal(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <span className="mr-2">💰</span>
                  Investir maintenant
                </button>
              </div>
            </div>
          )}

          {/* Message si le projet est financé */}
          {project.statut === 'FINANCE' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  🎉 Projet financé avec succès !
                </h3>
                <p className="text-green-700">
                  Ce projet a atteint son objectif de financement. Merci à tous les investisseurs !
                </p>
              </div>
            </div>
          )}

          {/* Message si le projet a échoué */}
          {project.statut === 'ECHOUE' && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-red-900 mb-2">
                  ❌ Projet non financé
                </h3>
                <p className="text-red-700">
                  Ce projet n'a pas atteint son objectif de financement dans les délais.
                </p>
              </div>
            </div>
          )}

          {/* Boutons d'action pour le porteur de projet */}
          {isProjectOwner && <ProjectOwnerActions project={project} />}
        </div>
      </div>

      {/* Modal d'investissement */}
      <InvestmentModal
        project={project}
        isOpen={showInvestmentModal}
        onClose={() => setShowInvestmentModal(false)}
        onSuccess={handleInvestmentSuccess}
      />
    </div>
  );
} 