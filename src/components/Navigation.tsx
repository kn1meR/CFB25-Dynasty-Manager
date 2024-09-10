"use client";

import React, { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CoachProfile from './CoachProfile';
import { ThemeToggle } from './ThemeToggle';

const Navigation: React.FC = memo(() => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Team Home', path: '/' },
    { name: 'Top 25', path: '/top25' },
    { name: 'Roster', path: '/roster' },
    { name: 'Recruiting', path: '/recruiting' },
    { name: 'Transfers', path: '/transfers' },
    { name: 'Season Stats', path: '/records' },
    //{ name: 'Player Stats', path: '/player-stats' },
    { name: 'Player Awards', path: '/awards' },
    { name: 'Trophy Case', path: '/trophy-case' }
  ];

  return (
    <nav className="flex justify-between items-center p-4">
      <ul className="flex space-x-4">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`${pathname === item.path ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'} hover:text-blue-800 dark:hover:text-blue-300 transition-colors`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        <CoachProfile />
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;
