import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'Hackathons', path: '/hackathons' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      // Optionally, you can redirect to home or login page here
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 ">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent"><img className='h-9' src="./CertiChain.png" alt="" /></span>
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link 
                  to={link.path}
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === link.path 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}

            {currentUser && currentUser.role === 'user' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
              >
                <Link
                  to="/profile"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/profile'
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  Profile
                </Link>
              </motion.div>
            )}

            {currentUser && currentUser.role === 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
              >
                <Link
                  to="/admin"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/admin'
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  Admin
                </Link>
              </motion.div>
            )}

            {currentUser && currentUser.role === 'hackathon organizer' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.1 }}
              >
                <Link
                  to="/organizer"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/organizer'
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  Organizer
                </Link>
              </motion.div>
            )}

            {currentUser && currentUser.role === 'internship' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (navLinks.length + 1) * 0.1 }}
              >
                <Link
                  to="/internships"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/internships' || location.pathname.startsWith('/internships/')
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                >
                  Organizer
                </Link>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              {!currentUser ? (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-primary-500 font-medium transition-colors duration-300 mr-4">
                    Login
                  </Link>
                  <Link to="/login" className="btn-primary">
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-primary-500 font-medium transition-colors duration-300 mr-4"
                >
                  Logout
                </button>
              )}
            </motion.div>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-600 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden mt-4 pb-4"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === link.path 
                      ? 'text-primary-600' 
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {currentUser && currentUser.role === 'user' && (
                <Link
                  to="/profile"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/profile'
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Profile
                </Link>
              )}

              {currentUser && currentUser.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`font-medium transition-colors duration-300 ${
                    location.pathname === '/admin'
                      ? 'text-primary-600'
                      : 'text-gray-600 hover:text-primary-500'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}


              <div className="flex flex-col space-y-2 pt-2">
                {!currentUser ? (
                  <>
                    <Link to="/login" className="text-gray-600 hover:text-primary-500 font-medium transition-colors duration-300">
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary text-center">
                      Register
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-primary-500 font-medium transition-colors duration-300"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
