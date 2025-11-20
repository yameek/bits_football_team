'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Calendar, 
  DollarSign, 
  Bell, 
  BarChart3,
  Settings,
  UserCircle
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Sessions', href: '/sessions', icon: Calendar },
  { name: 'Transactions', href: '/transactions', icon: DollarSign },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

function SidebarContent({ onMobileClose }: { onMobileClose?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4 mb-5">
          <h1 className="text-xl font-bold text-white">BITS Football</h1>
        </div>
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (onMobileClose) {
                    onMobileClose();
                  }
                }}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon
                  className={`mr-3 flex-shrink-0 h-5 w-5 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
        <div className="flex items-center">
          <UserCircle className="h-8 w-8 text-gray-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Treasurer</p>
            <p className="text-xs font-medium text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps = {}) {
  return (
    <>
      {/* Mobile sidebar */}
      {mobileOpen !== undefined && (
        <div className={`
          ${mobileOpen ? 'flex' : 'hidden'} 
          md:hidden fixed inset-y-0 left-0 z-50 w-64 flex-col
        `}>
          <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
            <SidebarContent onMobileClose={onMobileClose} />
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
