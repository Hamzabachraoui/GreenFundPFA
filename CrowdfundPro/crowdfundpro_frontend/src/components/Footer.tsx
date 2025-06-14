'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    plateforme: [
      { name: 'Comment ça marche', href: '/how-it-works' },
      { name: 'Frais et commissions', href: '/fees' },
      { name: 'Sécurité', href: '/security' },
      { name: 'FAQ', href: '/faq' }
    ],
    porteurs: [
      { name: 'Créer un projet', href: '/dashboard/projects/create' },
      { name: 'Guide du porteur', href: '/guide-porteur' },
      { name: 'Conseils financement', href: '/conseils' },
      { name: 'Réussites', href: '/success-stories' }
    ],
    investisseurs: [
      { name: 'Découvrir les projets', href: '/projects' },
      { name: 'Guide investisseur', href: '/guide-investisseur' },
      { name: 'Risques et garanties', href: '/risks' },
      { name: 'Statistiques', href: '/stats' }
    ],
    entreprise: [
      { name: 'À propos', href: '/about' },
      { name: 'Notre équipe', href: '/team' },
      { name: 'Presse', href: '/press' },
      { name: 'Carrières', href: '/careers' }
    ],
    legal: [
      { name: 'Conditions d\'utilisation', href: '/terms' },
      { name: 'Politique de confidentialité', href: '/privacy' },
      { name: 'Mentions légales', href: '/legal' },
      { name: 'Cookies', href: '/cookies' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Restez informé des dernières opportunités
              </h3>
              <p className="text-gray-400">
                Recevez les nouveaux projets et actualités directement dans votre boîte mail.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="btn btn-primary whitespace-nowrap">
                S'abonner 📧
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Platform */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🚀</span>
              Plateforme
            </h4>
            <ul className="space-y-3">
              {footerLinks.plateforme.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Porteurs */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">💡</span>
              Porteurs
            </h4>
            <ul className="space-y-3">
              {footerLinks.porteurs.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Investisseurs */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">💰</span>
              Investisseurs
            </h4>
            <ul className="space-y-3">
              {footerLinks.investisseurs.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🏢</span>
              Entreprise
            </h4>
            <ul className="space-y-3">
              {footerLinks.entreprise.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">⚖️</span>
              Légal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GF</span>
                </div>
                <span className="font-bold">GreenFund</span>
              </div>
              <span className="text-gray-400 text-sm">
                © {currentYear} Tous droits réservés
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Suivez-nous:</span>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Facebook"
                >
                  📘
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Twitter"
                >
                  🐦
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  💼
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Instagram"
                >
                  📷
                </a>
              </div>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-gray-400 text-sm max-w-2xl mx-auto">
              GreenFund est une plateforme de financement participatif régulée. 
              Les investissements présentent un risque de perte en capital. 
              Investissez uniquement ce que vous pouvez vous permettre de perdre.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 