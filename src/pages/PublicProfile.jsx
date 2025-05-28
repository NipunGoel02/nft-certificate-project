import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export default function PublicProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [certificates, setCertificates] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/auth/users/${id}`);
        setUser(response.data);
        setLoading(false);
        if (response.data.walletAddress) {
          fetchUserNFTs(response.data.walletAddress);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    const fetchUserNFTs = async (address) => {
      try {
        const response = await axios.get(`/api/nft/certificates?walletAddress=${address}`);
        setCertificates(response.data);
      } catch (error) {
        setCertificates([]);
      }
    };

    fetchUserProfile();
  }, [id]);

  if (loading) return <div className="text-center py-12 text-xl">Loading...</div>;
  if (!user) return <div className="text-center py-12 text-red-500">User not found.</div>;

  // Defensive: always check for arrays
  const completedSet = new Set(user.completedCourses || []);
  const enrolledCoursesFiltered = (user.enrolledCoursesDetails || []).filter(
    (course) => !completedSet.has(course._id)
  );
  const completedCoursesDetails = (user.enrolledCoursesDetails || []).filter(
    (course) => completedSet.has(course._id)
  );

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Share button handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated Header and Share Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-teal-600 to-blue-500 rounded-t-xl shadow-lg p-8 text-white mb-2">
            <h1 className="text-3xl font-bold">{user.name} Public Profile</h1>
            <p className="mt-2 text-teal-100">View courses, hackathons, internships and certificates</p>
            <div className="absolute top-8 right-8 flex flex-col items-end">
              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05, backgroundColor: "#14b8a6" }}
                className="bg-white text-teal-700 px-4 py-2 rounded-lg font-semibold shadow-lg flex items-center gap-2 transition-all duration-300"
                onClick={handleShare}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                  viewBox="0 0 24 24">
                  <path d="M15 12h.01M12 12h.01M9 12h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" />
                </svg>
                Share Profile
              </motion.button>
              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: -40 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 px-3 py-1 bg-teal-700 text-white rounded shadow-lg text-sm"
                  >
                    Link copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <div className="bg-white rounded-b-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Profile Sidebar */}
            <motion.div
              className="md:w-1/3 bg-white p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="text-center">
                <div className="relative mx-auto w-32 h-32 mb-4">
                <div className="w-32 h-32 rounded-full bg-teal-100 flex items-center justify-center text-teal-500 text-4xl font-bold overflow-hidden border-4 border-white shadow-xl">
                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture.startsWith('http') ? user.profilePicture : 'http://localhost:5000' + user.profilePicture}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
                    />
                  ) : (
                    user.name ? user.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{user.name || 'User'}</h2>
                {user.walletAddress && (
                  <div className="text-sm text-gray-500 mt-2">
                    Wallet: <span className="font-mono">{user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="md:w-2/3 border-t md:border-t-0 md:border-l border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {/* Enrolled Courses (filtered) */}
              <motion.div
                className="p-8 border-b border-gray-200"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Enrolled Courses</h2>
                </motion.div>
                {enrolledCoursesFiltered.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCoursesFiltered.map((course) => (
                      <motion.div
                        key={course._id}
                        variants={item}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <Link to={`/courses/${course._id}`} className="block p-4 flex items-center">
                          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-500 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{course.title}</span>
                            <div className="text-sm text-teal-600 mt-1">Continue Learning</div>
                          </div>
                          <svg className="h-5 w-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div variants={item} className="bg-gray-50 rounded-lg p-6 text-center">
                    <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <p className="text-gray-600 mb-4">This user has not enrolled in any courses yet.</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Completed Courses */}
              <motion.div
                className="p-8 border-b border-gray-200"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Completed Courses</h2>
                </motion.div>
                {completedCoursesDetails.length > 0 ? (
                  <div className="space-y-4">
                    {completedCoursesDetails.map((course) => (
                      <motion.div
                        key={course._id}
                        variants={item}
                        className="bg-green-50 border border-green-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <Link to={`/courses/${course._id}`} className="block p-4 flex items-center">
                          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{course.title}</span>
                            <div className="text-sm text-green-700 mt-1">Completed</div>
                          </div>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div variants={item} className="bg-gray-50 rounded-lg p-6 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="text-gray-600 mb-4">This user has not completed any courses yet.</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Registered Hackathons */}
              <motion.div
                className="p-8 border-b border-gray-200"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Registered Hackathons</h2>
                </motion.div>
                {user.registeredHackathons && user.registeredHackathons.length > 0 ? (
                  <div className="space-y-4">
                    {user.registeredHackathons.map((hackathon) => (
                      <motion.div
                        key={hackathon._id}
                        variants={item}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <Link to={`/hackathons/${hackathon._id}`} className="block p-4 flex items-center">
                          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-500 mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800">{hackathon.title}</span>
                            <div className="flex items-center mt-1">
                              <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Already Registered</span>
                              <span className="text-xs text-gray-500 ml-2">
                                {new Date(hackathon.startDate).toLocaleDateString()} - {new Date(hackathon.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <svg className="h-5 w-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div variants={item} className="bg-gray-50 rounded-lg p-6 text-center">
                    <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <p className="text-gray-600 mb-4">This user has not registered for any hackathons yet.</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Internships */}
              <motion.div
                className="p-8 border-b border-gray-200"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Internships</h2>
                </motion.div>
                {user.internships && user.internships.length > 0 ? (
                  <div className="space-y-4">
                    {user.internships.map((internship) => (
                      <motion.div
                        key={internship._id}
                        variants={item}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="p-4">
                          <h3 className="font-medium text-gray-800">{internship.title}</h3>
                          <p className="text-sm text-gray-600">{internship.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(internship.startDate).toLocaleDateString()} - {new Date(internship.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div variants={item} className="bg-gray-50 rounded-lg p-6 text-center">
                    <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <p className="text-gray-600 mb-4">This user has not participated in any internships yet.</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Certificates */}
              <motion.div
                className="p-8"
                variants={container}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={item} className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Certificates</h2>
                </motion.div>
                {certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificates.map((cert, index) => (
                      <motion.div
                        key={cert.tokenId || index}
                        variants={item}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                      >
                        <div className="relative">
                          <img
                            src={cert.metadata?.image?.replace('ipfs://', 'https://ipfs.io/ipfs/') || '/placeholder-certificate.png'}
                            alt={cert.metadata?.name || 'Certificate'}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
                            NFT
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-gray-800 mb-1">
                            {cert.metadata?.name || 'Certificate'}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {cert.metadata?.attributes?.find(attr => attr.trait_type === 'Course')?.value || 'Course Completion'}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mb-4">
                            {cert.metadata?.attributes?.find(attr => attr.trait_type === 'Date')?.value || 'Date not available'}
                          </div>
                          <div className="flex justify-between">
                            <a
                              href={`https://sepolia.etherscan.io/token/${cert.contract_address}?a=${cert.tokenId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors duration-300"
                            >
                              View on Blockchain
                            </a>
                            <button
                              className="text-xs bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-1 rounded-full transition-colors duration-300"
                              onClick={() => navigator.clipboard.writeText(
                                `https://sepolia.etherscan.io/token/${cert.contract_address}?a=${cert.tokenId}`
                              )}
                            >
                              Share
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div variants={item} className="bg-gray-50 rounded-lg p-6 text-center">
                    <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <p className="text-gray-600 mb-4">This user hasn't earned any certificates yet. Complete courses to earn NFT certificates.</p>
                    <Link
                      to="/courses"
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors duration-300"
                    >
                      Continue Learning
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
