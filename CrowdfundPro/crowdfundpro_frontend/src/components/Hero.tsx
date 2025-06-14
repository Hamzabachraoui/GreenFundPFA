'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Hero() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-primary-800 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Donnez vie à vos</span>{' '}
                <span className="block text-primary-200 xl:inline">projets innovants</span>
              </h1>
              <p className="mt-3 text-base text-primary-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Rejoignez la première plateforme de crowdfunding qui connecte les porteurs de projets 
                ambitieux avec les investisseurs visionnaires. Ensemble, construisons l'avenir.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  {isLoggedIn ? (
                    user?.role === 'PORTEUR' ? (
                      <Link
                        href="/dashboard/projects/create"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                      >
                        Créer mon projet
                      </Link>
                    ) : user?.role === 'ADMIN' ? (
                      <Link
                        href="/admin"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                      >
                        👑 Administration
                      </Link>
                    ) : (
                      <Link
                        href="/projects"
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                      >
                        Découvrir les projets
                      </Link>
                    )
                  ) : (
                    <Link
                      href="/auth/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Commencer maintenant
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <div className="h-56 w-full bg-gradient-to-br from-primary-400 to-primary-600 sm:h-72 md:h-96 lg:w-full lg:h-full flex items-center justify-center">
          <svg
            className="w-32 h-32 text-white opacity-20"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
} 