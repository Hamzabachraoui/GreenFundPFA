'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { projectsService } from '../services/projects';
import { Project } from '../types';
import Layout from '../components/Layout';
import ProjectCard from '../components/ProjectCard';
import Hero from '../components/Hero';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomePage() {
  const { user, isLoggedIn } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsService.getProjects({
          ordering: '-date_creation',
        });
        setProjects(response.results.slice(0, 6)); // Show only first 6 projects
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Layout showBreadcrumbs={false} className="bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Projects Section */}
      {isLoggedIn && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Projets à la Une
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Découvrez les projets innovants qui cherchent votre soutien pour devenir réalité.
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/projects"
                className="btn btn-primary btn-lg"
              >
                Voir tous les projets
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                100+
              </div>
              <div className="text-lg text-gray-600">
                Projets financés
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                500K€
              </div>
              <div className="text-lg text-gray-600">
                Montant total collecté
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">
                1000+
              </div>
              <div className="text-lg text-gray-600">
                Investisseurs actifs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté et donnez vie à vos projets ou investissez dans l'avenir.
          </p>
          
          {isLoggedIn ? (
            <div className="space-x-4">
              {user?.role === 'PORTEUR' ? (
                <Link
                  href="/dashboard/projects/create"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
                >
                  Créer un projet
                </Link>
              ) : user?.role === 'ADMIN' ? (
                <Link
                  href="/admin"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
                >
                  👑 Administration
                </Link>
              ) : (
                <Link
                  href="/projects"
                  className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
                >
                  Découvrir les projets
                </Link>
              )}
              <Link
                href="/dashboard"
                className="btn btn-outline text-white border-white hover:bg-white hover:text-primary-600 btn-lg"
              >
                Mon tableau de bord
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                href="/auth/register"
                className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg"
              >
                S'inscrire
              </Link>
              <Link
                href="/auth/login"
                className="btn btn-outline text-white border-white hover:bg-white hover:text-primary-600 btn-lg"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
} 