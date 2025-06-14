'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';

export default function AdminPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'ADMIN') {
      router.push('/auth/login');
    }
  }, [isLoggedIn, user, router]);

  if (!isLoggedIn || user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Tableau de bord administrateur
          </h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            {/* Contenu du tableau de bord */}
            <div className="bg-white shadow rounded-lg p-6">
              <p>Bienvenue dans l'interface d'administration</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 