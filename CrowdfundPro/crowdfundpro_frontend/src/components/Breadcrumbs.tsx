'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Configuration des breadcrumbs
    const breadcrumbMap: Record<string, { label: string; icon: string }> = {
      'dashboard': { label: 'Tableau de bord', icon: '📊' },
      'projects': { label: 'Projets', icon: '🚀' },
      'profile': { label: 'Mon profil', icon: '👤' },
      'admin': { label: 'Administration', icon: '👑' },
      'auth': { label: 'Authentification', icon: '🔐' },
      'login': { label: 'Connexion', icon: '🔑' },
      'register': { label: 'Inscription', icon: '📝' },
      'create': { label: 'Créer', icon: '➕' },
      'settings': { label: 'Paramètres', icon: '⚙️' },
      'investments': { label: 'Investissements', icon: '💰' }
    };

    const breadcrumbs = [
      { label: 'Accueil', href: '/', icon: '🏠' }
    ];

    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const config = breadcrumbMap[segment];
      
      if (config) {
        breadcrumbs.push({
          label: config.label,
          href: currentPath,
          icon: config.icon
        });
      } else if (!isNaN(Number(segment))) {
        // Si c'est un ID numérique, afficher "Détails"
        breadcrumbs.push({
          label: 'Détails',
          href: currentPath,
          icon: '📄'
        });
      } else {
        // Fallback pour les segments non configurés
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
          icon: '📁'
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Ne pas afficher les breadcrumbs sur la page d'accueil ou si seulement 1 élément
  if (pathname === '/' || breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center">
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400 mx-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              
              {index === breadcrumbs.length - 1 ? (
                // Dernier élément (page actuelle) - non cliquable
                <span className="flex items-center space-x-1 text-gray-900 font-medium">
                  <span>{breadcrumb.icon}</span>
                  <span>{breadcrumb.label}</span>
                </span>
              ) : (
                // Éléments précédents - cliquables
                <Link
                  href={breadcrumb.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <span>{breadcrumb.icon}</span>
                  <span>{breadcrumb.label}</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
} 