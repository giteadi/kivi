import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  FiHome, 
  FiCalendar, 
  FiUser, 
  FiCreditCard, 
  FiFileText,
  FiLogOut,
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiDollarSign
} from 'react-icons/fi';

const UserSidebar = ({ activeItem, setActiveItem, onLogout, onPlanSelect, onBookSession, isMobileOpen = false, onMobileClose }) => {
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'plans', label: 'Plans & Packages', icon: FiPackage },
    { id: 'sessions', label: 'My Sessions', icon: FiCalendar },
    { id: 'booking', label: 'Book Session', icon: FiClock },
    { id: 'payments', label: 'Payments', icon: FiCreditCard },
    { id: 'profile', label: 'My Profile', icon: FiUser },
    { id: 'reports', label: 'Reports', icon: FiFileText },
  ];

  const handlePlanClick = (plan) => {
    if (onPlanSelect) {
      onPlanSelect(plan);
    }
  };

  const handleBookSession = () => {
    if (onBookSession) {
      onBookSession();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <div className={`w-64 bg-white h-full shadow-lg flex flex-col ${
        isMobileOpen ? 'fixed left-0 top-0 z-50 lg:relative lg:z-auto' : 'relative lg:block hidden'
      }`}>
      {/* User Profile */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.first_name?.[0] || 'U'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'booking') {
                      handleBookSession();
                    } else {
                      setActiveItem(item.id);
                    }
                    if (onMobileClose) onMobileClose();
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeItem === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Logout */}
        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </div>
    </>
  );
};

export default UserSidebar;
