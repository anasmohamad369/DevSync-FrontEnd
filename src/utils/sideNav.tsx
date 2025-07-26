'use client';
import React, {useEffect} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { User, PlusCircle, Home, FileText, BarChart, CheckSquare, Layers, LogOut } from 'lucide-react';
import useProfile from '@/hooks/useProfile';
import {Button} from '@/components/ui/button';

const SideNav = () => {
  const pathname = usePathname();
  const router = useRouter();
    const { data, loading, error, fetchProfile } = useProfile();

  useEffect(() => {
    fetchProfile();
  }, []);


  const navItems = [
    { name: 'Tasks', path: '/user/tasks', icon: CheckSquare },
    { name: 'PM Board', path: '/user/PmBoard', icon: BarChart },
    { name: 'Chat', path: '/user/dashboard', icon: Layers },
    { name: 'Profile', path: '/user/profile', icon: User },
    {name: 'Team Board', path: '/user/teamboard', icon: Home},
  ];
  

  return (
    <div className="bg-gray-100 h-screen w-64 p-4 flex fixed flex-col">
      {/* Profile Section */}
      <div className="flex items-center space-x-3 mb-6 p-3 bg-white rounded-lg shadow-sm">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          <User size={24} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{data?.name}</p>
          <p className="text-sm text-gray-500">---</p>
        </div>
      </div>

      {/* Assign Task */}
      {/* <button
        onClick={() => router.push('/assign-task')}
        className="flex items-center space-x-2 p-3 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <PlusCircle size={20} />
        <span>Assign Task</span>
      </button> */}

      {/* Navigation Items */}
      <nav className="flex-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex items-center space-x-2 p-3 w-full text-left rounded-lg mb-2 transition-colors ${
              pathname === item.path
                ? 'bg-blue-500 text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </button>
        ))}
      </nav>
      <div className="flex justify-end align-bottom">
        <Button
          onClick={() => {
            localStorage.removeItem('token');
            router.push('/login');
          }}
          className="flex items-center w-full space-x-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout </span>
        </Button>
      </div>
    </div>
  );
};

export default SideNav;