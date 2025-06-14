'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Layout from '../../../components/Layout';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    nom: '',
    password: '',
    password2: '',
    role: 'INVESTISSEUR' as 'PORTEUR' | 'INVESTISSEUR'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.password2) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      await register(formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showFooter={false} className="bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="min-h-screen flex flex-col items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Logo ou Icône */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl text-white">✨</span>
            </div>
          </div>

          {/* En-tête */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Rejoignez GreenFund
            </h2>
            <p className="text-gray-600">
              Déjà membre ?{' '}
              <Link 
                href="/auth/login" 
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Se connecter
              </Link>
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-xl shadow-xl p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-500 text-xl">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Type de compte */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de compte
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">👤</span>
                  </div>
                  <select
                    id="role"
                    name="role"
                    required
                    className="pl-10 w-full input focus:ring-2 focus:ring-blue-500"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="INVESTISSEUR">Investisseur</option>
                    <option value="PORTEUR">Porteur de projet</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">📧</span>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="pl-10 w-full input focus:ring-2 focus:ring-blue-500"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Nom d'utilisateur */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">🏷️</span>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="pl-10 w-full input focus:ring-2 focus:ring-blue-500"
                    placeholder="votre_nom_utilisateur"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Nom complet */}
              <div>
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">📝</span>
                  </div>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    className="pl-10 w-full input focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre nom complet"
                    value={formData.nom}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">🔒</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="pl-10 w-full input focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Confirmation du mot de passe */}
              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">🔐</span>
                  </div>
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    required
                    className="pl-10 w-full input focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirmez votre mot de passe"
                    value={formData.password2}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Bouton d'inscription */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      <span>Inscription en cours...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-2">✨</span>
                      <span>Créer mon compte</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <Link 
                href="/" 
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
} 