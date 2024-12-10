import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  ShieldExclamationIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CogIcon,
  ServerIcon,
  LockClosedIcon,
  BugAntIcon,
  DocumentCheckIcon,
  ArrowPathIcon,
  CloudIcon
} from '@heroicons/react/24/outline';
import OwaspNavItem from './OwaspNavItem';

const vulnerabilities = [
  { name: 'Broken Access Control', icon: ShieldExclamationIcon, path: '/lab/access-control' },
  { name: 'Cryptographic Failures', icon: KeyIcon, path: '/lab/crypto' },
  { name: 'Injection', icon: ExclamationTriangleIcon, path: '/lab/injection' },
  { name: 'Insecure Design', icon: BugAntIcon, path: '/lab/insecure-design' },
  { name: 'Security Misconfig', icon: CogIcon, path: '/lab/misconfig' },
  { name: 'Outdated Components', icon: ArrowPathIcon, path: '/lab/outdated' },
  { name: 'Auth Failures', icon: LockClosedIcon, path: '/lab/auth' },
  { name: 'Data Integrity', icon: DocumentCheckIcon, path: '/lab/integrity' },
  { name: 'Logging Failures', icon: CloudIcon, path: '/lab/logging' },
  { name: 'SSRF', icon: ServerIcon, path: '/lab/ssrf' }
];

function OwaspNavigation({ onItemClick }) {
  const location = useLocation();

  return (
    <nav className="grid gap-2 md:grid-cols-2 lg:grid-cols-1">
      {vulnerabilities.map((item) => (
        <OwaspNavItem
          key={item.path}
          {...item}
          isActive={location.pathname === item.path}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
}

export default OwaspNavigation;