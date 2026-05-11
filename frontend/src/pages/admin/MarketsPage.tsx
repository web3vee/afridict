import React from 'react';
import { useOutletContext } from 'react-router-dom';
import AdminMarkets from '../../components/admin/AdminMarkets';
import type { AdminOutletContext } from '../../layouts/AdminLayout';

export default function MarketsPage() {
  const { adminSearch, adminMarkets, setAdminMarkets, pendingMarkets, removePendingMarket, addMarket } = useOutletContext<AdminOutletContext>();
  return (
    <AdminMarkets
      adminMarkets={adminMarkets}
      setAdminMarkets={setAdminMarkets}
      adminSearch={adminSearch}
      pendingMarkets={pendingMarkets}
      removePendingMarket={removePendingMarket}
      addMarket={addMarket}
    />
  );
}
