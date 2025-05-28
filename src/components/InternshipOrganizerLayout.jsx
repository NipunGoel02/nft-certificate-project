import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

export default function InternshipOrganizerLayout() {
  const [activeLink, setActiveLink] = useState('my-internships');
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-teal-600 to-teal-700 p-4">
        <h2 className="text-white text-2xl font-bold mb-6">Internship Panel</h2>
        <nav className="space-y-2">
          <Link 
            to="/internships/my-internships" 
            className={`block ${activeLink === 'my-internships' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
            onClick={() => setActiveLink('my-internships')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              My Internships
            </div>
          </Link>
          
          <Link 
            to="/internships/create" 
            className={`block ${activeLink === 'create' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
            onClick={() => setActiveLink('create')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Internship
            </div>
          </Link>
        </nav>
      
        <div className="mt-auto pt-8">
          <Link 
            to="/internships/create" 
            className="block w-full bg-white text-teal-700 hover:bg-teal-100 font-medium p-3 rounded-lg text-center transition-all duration-200"
          >
            + Create New Internship
          </Link>
        </div>
      </div>
    
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="p-6 bg-white border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Internship Organizer Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </button>
              <div className="relative">
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span className="ml-2">{currentUser.name}</span>
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
