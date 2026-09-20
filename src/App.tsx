import React from 'react';
import { CasinoProvider, useCasino } from './context/CasinoContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GoldParticleCelebration } from './components/GoldParticleCelebration';
import { ImperialGoldenEagle3DCanvas } from './components/ImperialGoldenEagle3DCanvas';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LiveActivityFeed } from './components/LiveActivityFeed';
import { GameHubGrid } from './components/GameHubGrid';
import { VipEmpireHub } from './components/VipEmpireHub';
import { AffiliateEmpireHub } from './components/AffiliateEmpireHub';
import { ProvablyFairHub } from './components/ProvablyFairHub';
import { InvestmentBettingPlatform } from './components/InvestmentBettingPlatform';
import { WelcomeBonusBanner } from './components/WelcomeBonusBanner';
import { VipLeaderboardTournament } from './components/VipLeaderboardTournament';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

// Stealth Admin Command Modals
import { StealthAdminPinModal } from './components/admin/StealthAdminPinModal';
import { StealthAdminModal } from './components/admin/StealthAdminModal';

// Playable Game Modals
import { CrashGameModal } from './components/games/CrashGameModal';
import { CyberRouletteModal } from './components/games/CyberRouletteModal';
import { CyberSlotModal } from './components/games/CyberSlotModal';
import { CyberPlinkoModal } from './components/games/CyberPlinkoModal';
import { CelestialBlackjackModal } from './components/games/CelestialBlackjackModal';
import { MacauBaccaratModal } from './components/games/MacauBaccaratModal';

// System & Cashier Modals
import { ProvablyFairModal } from './components/ProvablyFairModal';
import { SecurityModal } from './components/SecurityModal';
import { WalletModal } from './components/WalletModal';
import { CashoutModal } from './components/CashoutModal';
import { LiveChatSidebar } from './components/LiveChatSidebar';
import { LiveSocialProofToast } from './components/LiveSocialProofToast';
import { LiveFinancialToast } from './components/cashier/LiveFinancialToast';

import { AnimatePresence, motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

const CasinoApp: React.FC = () => {
  const {
    navTab,
    activeGameModal,
    toastMessage,
    currentLanguage,
  } = useCasino();

  const isRTL = currentLanguage === 'ar';

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-b from-[#090B10] via-[#06080E] to-[#040508] text-slate-100 flex flex-col justify-between selection:bg-amber-400 selection:text-black relative overflow-x-hidden"
    >
      {/* Epic Sovereign 3D Animated Golden Eagle (النسر الذهبي الملكي) & Ambient Mesh */}
      <ImperialGoldenEagle3DCanvas />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] max-w-full h-[400px] bg-gradient-to-b from-amber-500/[0.045] via-amber-700/[0.02] to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-36 right-0 w-[500px] h-[500px] bg-indigo-950/[0.16] rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[50%] left-0 w-[500px] h-[500px] bg-blue-950/[0.12] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 max-w-sm p-4 rounded-xl cyber-glass-gold border border-amber-400/50 shadow-2xl flex items-center gap-3 text-xs text-amber-200"
          >
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-spin" />
            <span className="font-mono leading-tight">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main App Layout */}
      <div className="pb-16 md:pb-0">
        <Header />
        <ErrorBoundary>
          <main>
            {navTab === 'arenas' && (
              <>
                <WelcomeBonusBanner />
                <HeroSection />
                <VipLeaderboardTournament />
                <LiveActivityFeed />
                <GameHubGrid />
              </>
            )}

            {navTab === 'vip-empire' && (
              <>
                <VipEmpireHub />
                <VipLeaderboardTournament />
                <LiveActivityFeed />
              </>
            )}

            {navTab === 'affiliates' && (
              <>
                <AffiliateEmpireHub />
                <LiveActivityFeed />
              </>
            )}

            {navTab === 'provably-fair' && (
              <>
                <ProvablyFairHub />
                <LiveActivityFeed />
              </>
            )}

            {navTab === 'investments' && (
              <>
                <InvestmentBettingPlatform />
                <LiveActivityFeed />
              </>
            )}
          </main>
        </ErrorBoundary>
      </div>

      <Footer />

      {/* Mobile Fixed PWA Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Interactive In-App Game Modals */}
      {activeGameModal === 'crash' && <CrashGameModal />}
      {activeGameModal === 'roulette' && <CyberRouletteModal />}
      {activeGameModal === 'slot' && <CyberSlotModal />}
      {activeGameModal === 'plinko' && <CyberPlinkoModal />}
      {activeGameModal === 'blackjack' && <CelestialBlackjackModal />}
      {activeGameModal === 'baccarat' && <MacauBaccaratModal />}

      {/* Security, Provably Fair, Cashout & Wallet Modals */}
      <ProvablyFairModal />
      <SecurityModal />
      <WalletModal />
      <CashoutModal />

      {/* Hidden Stealth Admin Command Architecture */}
      <StealthAdminPinModal />
      <StealthAdminModal />

      {/* AI Live Casino & Multiplayer Chat Feed */}
      <LiveChatSidebar />

      {/* Live Social Proof Real-Time Toast Feed */}
      <LiveSocialProofToast />

      {/* Live Financial Security Toast Feed */}
      <LiveFinancialToast />

      {/* Dynamic Gold Particle Celebrations Overlay */}
      <GoldParticleCelebration />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <CasinoProvider>
        <CasinoApp />
      </CasinoProvider>
    </ErrorBoundary>
  );
}
