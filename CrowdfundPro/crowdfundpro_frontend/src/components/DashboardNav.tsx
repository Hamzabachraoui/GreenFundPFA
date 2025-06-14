import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

interface DashboardNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DashboardNav({ activeTab, onTabChange }: DashboardNavProps) {
  const { user } = useAuth();
  const isPorteur = user?.role === 'PORTEUR';
  const isInvestisseur = user?.role === 'INVESTISSEUR';

  const porteurTabs = [
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'create', label: 'Créer un Projet', icon: '➕' },
    { id: 'projects', label: 'Tous les Projets', icon: '📁' },
    { id: 'profile', label: 'Profil', icon: '👤' }
  ];

  const investisseurTabs = [
    { id: 'home', label: 'Accueil', icon: '🏠' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'discover', label: 'Découvrir', icon: '🔍' },
    { id: 'profile', label: 'Profil', icon: '👤' }
  ];

  const tabs = isPorteur ? porteurTabs : investisseurTabs;

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-6 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
} 