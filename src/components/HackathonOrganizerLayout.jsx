import { Outlet, Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../Context/AuthContext';

export default function HackathonOrganizerLayout() {
  const [activeLink, setActiveLink] = useState('dashboard');
  const { currentUser } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-teal-600 to-teal-700 p-4">
        <h2 className="text-white text-2xl font-bold mb-6">Hackathon Panel</h2>
        <nav className="space-y-2">
          <Link 
            to="/organizer/dashboard" 
            className={`block ${activeLink === 'dashboard' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
            onClick={() => setActiveLink('dashboard')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
              Dashboard
            </div>
          </Link>
          
          <Link 
            to="/organizer/my-hackathons" 
            className={`block ${activeLink === 'my-hackathons' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
            onClick={() => setActiveLink('my-hackathons')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              My Hackathons
            </div>
          </Link>
          
          <Link 
            to="/organizer/participants" 
            className={`block ${activeLink === 'participants' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
            onClick={() => setActiveLink('participants')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              Participants
            </div>
          </Link>
          
          <Link 
            to="/organizer/submissions" 
            className={`block ${activeLink === 'submissions' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
            onClick={() => setActiveLink('submissions')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m-6-4h.01M9 16h.01"></path>
              </svg>
              Submissions
            </div>
          </Link>
          
          <Link 
            to="/organizer/judging" 
            className={`block ${activeLink === 'judging' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
            onClick={() => setActiveLink('judging')}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
            </svg>
            Judging
          </div>
        </Link>
        
        <Link 
          to="/organizer/certificates" 
          className={`block ${activeLink === 'certificates' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
          onClick={() => setActiveLink('certificates')}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            Certificates
          </div>
        </Link>
        
        <Link 
          to="/organizer/analytics" 
          className={`block ${activeLink === 'analytics' ? 'bg-teal-800 text-white' : 'text-teal-100 hover:bg-teal-800'} p-3 rounded-lg transition-all duration-200`}
          onClick={() => setActiveLink('analytics')}
        >
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Analytics
          </div>
        </Link>
      </nav>
      
      <div className="mt-auto pt-8">
        <Link 
          to="/hackathons/create" 
          className="block w-full bg-white text-teal-700 hover:bg-teal-100 font-medium p-3 rounded-lg text-center transition-all duration-200"
        >
          + Create New Hackathon
        </Link>
      </div>
    </div>
    
    {/* Main Content */}
    <div className="flex-1 bg-gray-50">
      <div className="p-6 bg-white border-b">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Hackathon Organizer Dashboard</h1>
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
