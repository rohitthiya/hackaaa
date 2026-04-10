// src/components/layout/AppLayout.jsx
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/holdings': 'My Holdings',
  '/ai-research': 'AI Research',
  '/alerts': 'Alerts & Signals',
  '/goals': 'Investment Goals',
  '/news': 'Market News',
  '/profile': 'Profile & Settings',
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'InvestIQ';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Navbar pageTitle={title} />
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
