import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AdminUsers from '../../components/admin/AdminUsers';
import type { AdminOutletContext } from '../../layouts/AdminLayout';

export default function UsersPage() {
  const { adminSearch } = useOutletContext<AdminOutletContext>();
  return <AdminUsers adminSearch={adminSearch} />;
}
