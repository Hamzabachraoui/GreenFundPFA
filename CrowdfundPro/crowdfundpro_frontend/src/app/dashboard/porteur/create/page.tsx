'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import Link from 'next/link';
import { projectsService } from '../../../../services/projects';
import LoadingSpinner from '../../../../components/LoadingSpinner';
import dynamic from 'next/dynamic';
import { ProjectCreateData } from '../../../../types';

const LocationPicker = dynamic(() => import('../../../../components/LocationPicker'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Chargement de la carte...</div>
});

export default function CreateProjectPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    montant_cible: '',
    date_limite: '',
    image: null as File | null,
    // Nouveaux champs pour la localisation
    adresse: '',
    latitude: '',
    longitude: '',
    // Nouveaux champs pour les documents
    business_plan: null as File | null,
    plan_juridique: null as File | null
  });

  // Vérifier si l'utilisateur est un porteur
  if (!isLoggedIn || (user && user.role !== 'PORTEUR')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-4">
            Seuls les porteurs de projet peuvent créer des projets.
          </p>
          <Link href="/dashboard" className="btn btn-primary">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const projectData: ProjectCreateData = {
        titre: formData.titre,
        description: formData.description,
        objectif: parseFloat(formData.montant_cible),
        date_limite: formData.date_limite,
      };

      if (formData.image) {
        projectData.image = formData.image;
      }

      // Ajouter les champs de localisation
      if (formData.latitude && formData.longitude) {
        projectData.latitude = parseFloat(formData.latitude);
        projectData.longitude = parseFloat(formData.longitude);
      }
      if (formData.adresse) {
        projectData.adresse = formData.adresse;
      }

      // Ajouter les documents
      if (formData.business_plan) {
        projectData.business_plan = formData.business_plan;
      }
      if (formData.plan_juridique) {
        projectData.plan_juridique = formData.plan_juridique;
      }

      await projectsService.createProject(projectData);
      router.push('/dashboard/porteur');
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de la création du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.files![0]
      }));
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));
  };

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* Header avec navigation */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white transform hover:scale-[1.02] transition-transform duration-300 shadow-xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold mb-2">🚀 Créer un Nouveau Projet</h2>
            <p className="text-lg opacity-90">Donnez vie à vos idées innovantes</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <Link 
              href="/dashboard/porteur" 
              className="btn bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
            >
              ⬅️ Retour au Dashboard
            </Link>
            <Link 
              href="/projects" 
              className="btn bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
            >
              🔍 Voir les Projets
            </Link>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        {/* Informations de base */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3">1</span>
            Informations de Base
          </h3>
          
          <div className="grid gap-6">
            <div className="group">
              <label htmlFor="titre" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                Titre du Projet *
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                required
                value={formData.titre}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400"
                placeholder="Un titre accrocheur pour votre projet"
              />
            </div>

            <div className="group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400"
                placeholder="Décrivez votre projet en détail (minimum 50 caractères)..."
              />
            </div>

            <div className="group">
              <label htmlFor="montant_cible" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                Montant cible (DH) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">DH</span>
                <input
                  type="number"
                  id="montant_cible"
                  name="montant_cible"
                  required
                  min="0"
                  value={formData.montant_cible}
                  onChange={handleChange}
                  className="block w-full pl-10 rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400"
                  placeholder="10000"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                💡 Définissez un objectif réaliste pour votre projet
              </p>
            </div>

            <div className="group">
              <label htmlFor="date_limite" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                Date limite *
              </label>
              <input
                type="date"
                id="date_limite"
                name="date_limite"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.date_limite}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400"
              />
              <p className="mt-2 text-sm text-gray-500">
                ⏰ La date limite doit être dans le futur
              </p>
            </div>
          </div>
        </div>

        {/* Localisation */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3">2</span>
            📍 Localisation du Projet
          </h3>
          
          <div className="space-y-6">
            <div className="group">
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                Adresse complète
              </label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400"
                placeholder="Ex: 123 Rue Mohammed V, Casablanca, Maroc"
              />
              <p className="mt-2 text-sm text-gray-500">
                🌍 L'adresse complète de votre projet
              </p>
            </div>

            {/* Sélecteur de carte */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                Sélectionner la position sur la carte
              </label>
              <LocationPicker
                latitude={formData.latitude ? parseFloat(formData.latitude) : null}
                longitude={formData.longitude ? parseFloat(formData.longitude) : null}
                onLocationChange={handleLocationChange}
              />
              <p className="mt-2 text-sm text-gray-500">
                🗺️ Cliquez sur la carte pour placer le marqueur ou déplacez-le
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                  Latitude
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  step="any"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400"
                  placeholder="Ex: 33.5731"
                />
                <p className="mt-2 text-sm text-gray-500">
                  📍 Coordonnée GPS (se remplit automatiquement)
                </p>
              </div>

              <div className="group">
                <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                  Longitude
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  step="any"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 hover:border-green-400"
                  placeholder="Ex: -7.5898"
                />
                <p className="mt-2 text-sm text-gray-500">
                  📍 Coordonnée GPS (se remplit automatiquement)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3">3</span>
            🖼️ Image du Projet
          </h3>
          
          <div className="group">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
              Image du projet *
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-400 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="image" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                    <span>Télécharger un fichier</span>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">ou glisser-déposer</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG jusqu'à 5MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white mr-3">4</span>
            📄 Documents du Projet
          </h3>
          
          <div className="grid gap-6">
            <div className="group">
              <label htmlFor="business_plan" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                Business Plan
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="business_plan" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                      <span>Télécharger le business plan</span>
                      <input
                        type="file"
                        id="business_plan"
                        name="business_plan"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX jusqu'à 10MB
                  </p>
                </div>
              </div>
            </div>

            <div className="group">
              <label htmlFor="plan_juridique" className="block text-sm font-medium text-gray-700 mb-1 group-hover:text-green-600 transition-colors">
                Plan Juridique et Réglementaire
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-green-400 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="plan_juridique" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                      <span>Télécharger le plan juridique</span>
                      <input
                        type="file"
                        id="plan_juridique"
                        name="plan_juridique"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF, DOC, DOCX jusqu'à 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
          <Link
            href="/dashboard/porteur"
            className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="btn bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                <span>Création en cours...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <span>🚀 Créer le projet</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 