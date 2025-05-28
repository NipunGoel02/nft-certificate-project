import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Coursecard = ({ course }) => {
  // Category badge color based on course category
  const getCategoryColor = (category) => {
    const colors = {
      'blockchain': 'bg-blue-100 text-blue-800',
      'web-development': 'bg-green-100 text-green-800',
      'design': 'bg-secondary-300 text-secondary-700',
      'data-science': 'bg-amber-100 text-amber-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[category?.toLowerCase()] || colors['default'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img 
          src={course.thumbnail || './th.jpeg'} 
          alt={course.title} 
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getCategoryColor(course.category)}`}>
            {course.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">{course.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-primary-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span className="text-sm text-gray-500">{course.lessonCount} lessons</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-primary-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span className="text-sm text-gray-500">{course.duration}</span>
            </div>
          </div>
        </div>
        
        <Link 
          to={`/courses/${course._id || course.id}`}
          className="mt-6 block w-full"
        >
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-lg text-center transition-all duration-300 hover:from-primary-600 hover:to-primary-700 focus:ring-4 focus:ring-primary-300 focus:outline-none"
          >
            View Course
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default Coursecard;
