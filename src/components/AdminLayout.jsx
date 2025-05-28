import { Outlet, Link, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-teal-700 to-teal-900 p-4">
        <h2 className="text-white text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            to="/admin/courses"
            className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
              location.pathname.startsWith('/admin/courses')
                ? 'bg-teal-800 text-white'
                : 'text-teal-100 hover:bg-teal-800'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Courses to view 
            </div>
          </Link>
          <Link
            to="/admin/users"
            className={`block px-4 py-2 rounded-lg transition-all duration-200 ${
              location.pathname.startsWith('/admin/users')
                ? 'bg-teal-800 text-white'
                : 'text-teal-100 hover:bg-teal-800'
            }`}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              Users
            </div>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8">
        <Outlet />
      </div>
    </div>
  );
}
