'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '../types';
import { formatCurrency } from '../utils/format';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const progress = project.montant_actuel ? (project.montant_actuel / project.montant_cible) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="relative h-36">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.titre}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-2xl">🌱</span>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <Link href={`/projects/${project.id}`}>
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1 hover:text-blue-600 transition-colors">
            {project.titre}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {project.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Objectif:</span>
            <span className="font-medium text-gray-900">{formatCurrency(project.montant_cible)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Collecté:</span>
            <span className="font-medium text-green-600">{formatCurrency(project.montant_actuel || 0)}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{progress.toFixed(1)}%</span>
              <span>{project.investissements?.length || 0} investisseurs</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 