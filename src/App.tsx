/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Philosophy } from './components/Philosophy';
import { AcademicTimeline } from './components/AcademicTimeline';
import { ExperienceActivities } from './components/ExperienceActivities';
import { AwardsSection } from './components/AwardsSection';
import { ArticlesSection } from './components/ArticlesSection';
import { MediaGallerySection } from './components/MediaGallerySection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAuthModal } from './components/AdminAuthModal';
import { NafisLogo } from './components/NafisLogo';

const PortfolioContent: React.FC = () => {
  const { currentView, loading } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F6F0] dark:bg-[#0B1F33]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#142B3D] border-2 border-[#C6A15B] flex items-center justify-center p-2 shadow-xl">
            <NafisLogo size={46} animated={true} />
          </div>
          <div className="text-xs font-semibold tracking-widest text-[#3E7180] dark:text-[#C6A15B] uppercase">
            Loading Ehsanul Haque Khan Nafis Portfolio...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F6F0] dark:bg-[#0B1F33] text-[#0B1F33] dark:text-[#F8F6F0] selection:bg-[#C6A15B]/30 transition-colors duration-300">
      <Navbar />

      <main className="flex-grow">
        {currentView === 'admin' ? (
          <AdminDashboard />
        ) : (
          <>
            <Hero />
            <Philosophy />
            <AcademicTimeline />
            <ExperienceActivities />
            <AwardsSection />
            <ArticlesSection />
            <MediaGallerySection />
            <ContactSection />
          </>
        )}
      </main>

      <Footer />
      <SearchModal />
      <AdminAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioContent />
    </PortfolioProvider>
  );
}
