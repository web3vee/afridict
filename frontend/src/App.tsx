import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Spinner, useColorModeValue } from '@chakra-ui/react';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import { useApp } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const Landing        = lazy(() => import('./pages/Landing'));
const CategoryPage   = lazy(() => import('./pages/CategoryPage'));
const MentionsPage       = lazy(() => import('./pages/MentionsPage'));
const MentionDetailPage  = lazy(() => import('./pages/MentionDetailPage'));
const CountriesPage      = lazy(() => import('./pages/CountriesPage'));
const CountryDetailPage  = lazy(() => import('./pages/CountryDetailPage'));
const Portfolio      = lazy(() => import('./pages/Portfolio'));
const Bookmarks      = lazy(() => import('./pages/Bookmarks'));
const Settings       = lazy(() => import('./pages/Settings'));
const LeaderboardPage = lazy(() => import('./pages/LeaderboardPage'));
const ProfilePage     = lazy(() => import('./pages/ProfilePage'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));

const App = () => {
  const {
    activeCategory, howItWorksStep, setHowItWorksStep,
    login, openBetYes, openBetNo, openMarketDetail, openEmbed,
    markets, displayName, displayAddress, displayPhoto,
    portfolioValue, myPositions,
    openDeposit, openWithdraw,
    account, firebaseUser,
    triggerBetSplash,
  } = useApp();

  const pageBg   = useColorModeValue('gray.50', '#0a0e17');
  const pageText = useColorModeValue('gray.900', 'white');

  // Auto-open a market modal when the URL has ?market=ID (e.g. from a copied link)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const marketId = params.get('market');
    if (!marketId) return;
    const found = markets.find((m: any) => String(m.contractId ?? m.id) === marketId);
    if (found) {
      openMarketDetail(found);
      // Clean the query param from the URL without a page reload
      const clean = window.location.pathname;
      window.history.replaceState({}, '', clean);
    }
  }, [markets, openMarketDetail]);

  return (
    <Box bg={pageBg} color={pageText} minH="100vh">
      <Suspense fallback={
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <Spinner size="xl" color="#ffd700" thickness="3px" speed="0.7s" />
        </Box>
      }>
      <Routes>

        {/* Public pages — Navbar + Footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <Landing
              activeCategory={activeCategory}
              howItWorksStep={howItWorksStep}
              onHowItWorksNext={() => setHowItWorksStep(s => s + 1)}
              onHowItWorksClose={() => setHowItWorksStep(0)}
              onLogin={login}
              onBetYes={openBetYes}
              onBetNo={openBetNo}
              onMarketDetail={openMarketDetail}
              onEmbed={openEmbed}
            />
          } />
          <Route path="/market/:category" element={
            <CategoryPage
              markets={markets}
              onBetSuccess={triggerBetSplash}
              onMarketDetail={openMarketDetail}
            />
          } />
          <Route path="/mentions" element={<MentionsPage />} />
          <Route path="/mentions/:id" element={<MentionDetailPage />} />
          <Route path="/countries" element={<CountriesPage />} />
          <Route path="/countries/:name" element={<CountryDetailPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Route>

        {/* Dashboard pages — user sidebar */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/portfolio" element={
            <Portfolio
              displayName={displayName}
              displayAddress={displayAddress}
              displayPhoto={displayPhoto}
              portfolioValue={portfolioValue}
              positions={myPositions}
              onDeposit={openDeposit}
              onWithdraw={openWithdraw}
            />
          } />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={
            <Settings
              displayName={displayName}
              displayAddress={displayAddress}
              displayPhoto={displayPhoto}
              account={account}
              userEmail={firebaseUser?.email || null}
            />
          } />
        </Route>

        {/* Admin — only accessible to users listed in src/data/admins.ts */}
        <Route path="/admin/*" element={
          <AdminRoute><AdminDashboard /></AdminRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </Box>
  );
};

export default App;
