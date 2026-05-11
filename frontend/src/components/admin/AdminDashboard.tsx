import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import OverviewPage from '../../pages/admin/OverviewPage';
import MarketsPage from '../../pages/admin/MarketsPage';
import UsersPage from '../../pages/admin/UsersPage';
import TransactionsPage from '../../pages/admin/TransactionsPage';
import AdminAnalytics from './AdminAnalytics';
import AdminModeration from './AdminModeration';
import AdminSettings from './AdminSettings';

export default function AdminDashboard() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview"     element={<OverviewPage />} />
        <Route path="markets"      element={<MarketsPage />} />
        <Route path="users"        element={<UsersPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="analytics"    element={<AdminAnalytics />} />
        <Route path="moderation"   element={<AdminModeration />} />
        <Route path="settings"     element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
