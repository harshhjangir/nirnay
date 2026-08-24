import React from 'react';
import { useIncident } from './context/IncidentContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CommandHero } from './components/hero/CommandHero';
import { EmergencyWorkflow } from './components/hero/EmergencyWorkflow';
import { AssessmentWizard } from './components/intake/AssessmentWizard';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { CaseDetailsView } from './components/dashboard/CaseDetailsView';
import { TrackCasePublic } from './components/tracking/TrackCasePublic';
import { NivaranToolsHub } from './components/tools/NivaranToolsHub';
import { SuspiciousCheck } from './components/checker/SuspiciousCheck';
import { PreventionCenter } from './components/learn/PreventionCenter';
import { BankDirectory } from './components/official/BankDirectory';
import { ArchitectureExplainer } from './components/about/ArchitectureExplainer';
import { LoginModal } from './components/auth/LoginModal';

export const App: React.FC = () => {
  const { activeTab } = useIncident();

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-brand-primary text-white font-semibold text-xs rounded-md shadow-card"
      >
        Skip to main content
      </a>

      {/* Persistent Navigation Header */}
      <Header />

      {/* Main Dynamic Content View */}
      <main id="main-content" className="flex-1">
        {activeTab === 'home' && (
          <div className="space-y-0 animate-in fade-in duration-150">
            <CommandHero />
            <EmergencyWorkflow />
          </div>
        )}

        {/* 6-Step Incident Intake Wizard */}
        {activeTab === 'intake' && <AssessmentWizard />}

        {/* Citizen Dashboard (My NIVARAN) */}
        {activeTab === 'dashboard' && <UserDashboard />}

        {/* Detailed Case Dossier & Intelligence Hub */}
        {activeTab === 'case_details' && <CaseDetailsView />}

        {/* Nivaran Investigation Mini-Tools Hub */}
        {activeTab === 'tools' && <NivaranToolsHub />}

        {/* Public Case Status Tracking */}
        {activeTab === 'track_case' && <TrackCasePublic />}

        {/* Pre-Payment Suspicious Identifier Checker */}
        {activeTab === 'checker' && <SuspiciousCheck />}

        {/* Bank Emergency Helplines Directory */}
        {activeTab === 'bank_directory' && <BankDirectory />}

        {/* Prevention & Educational Playbooks */}
        {activeTab === 'learn' && <PreventionCenter />}

        {/* Platform Architecture & About */}
        {activeTab === 'about' && <ArchitectureExplainer />}
      </main>

      {/* Persistent Light Institutional Footer */}
      <Footer />

      {/* Authentication Dialog (Login / Register / CAPTCHA) */}
      <LoginModal />
    </div>
  );
};

export default App;
