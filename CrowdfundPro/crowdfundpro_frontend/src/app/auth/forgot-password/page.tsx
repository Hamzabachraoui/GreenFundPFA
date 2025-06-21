'use client';

import { useState } from 'react';
import Link from 'next/link';
import { authService } from '../../../services/auth';
import Layout from '../../../components/Layout';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await authService.requestPasswordReset(email);
      setMessage('Si un compte avec cet email existe, un lien pour réinitialiser votre mot de passe a été envoyé.');
    } catch (err: any) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showFooter={false} className="bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center">
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h2>
            <p className="text-sm text-gray-600">
              Entrez votre email et nous vous enverrons un lien pour le réinitialiser.
            </p>
          </div>

          {message && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
               <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Envoyer le lien'}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <Link href="/auth/login" className="text-sm text-gray-600 hover:text-gray-900">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
} 