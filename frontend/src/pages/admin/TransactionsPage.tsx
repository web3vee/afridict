import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AdminTransactions from '../../components/admin/AdminTransactions';
import type { AdminOutletContext } from '../../layouts/AdminLayout';

export default function TransactionsPage() {
  const { adminSearch } = useOutletContext<AdminOutletContext>();
  return <AdminTransactions adminSearch={adminSearch} />;
}
