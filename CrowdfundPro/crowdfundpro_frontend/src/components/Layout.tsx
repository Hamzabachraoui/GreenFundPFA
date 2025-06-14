'use client';

import { ReactNode } from 'react';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  showBreadcrumbs?: boolean;
  showFooter?: boolean;
  className?: string;
}

export default function Layout({
  children,
  showBreadcrumbs = true,
  showFooter = true,
  className = ''
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      {showBreadcrumbs && <Breadcrumbs />}
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}