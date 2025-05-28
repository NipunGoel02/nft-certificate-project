import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CourseCard from '../components/courses/Coursecard';
import CourseFilter from '../components/courses/Coursefilter';
import { getCourses } from '../services/courseService';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([
    { id: 'blockchain', name: 'Blockchain' },
    { id: 'web-development', name: 'Web Development' },
    { id: 'design', name: 'Design' },
    { id: 'data-science', name: 'Data Science' },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Simulated API call - replace with actual API
        const data = await getCourses();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course => {
      const matchesCategory = category === 'all' || (course.category && course.category.toLowerCase() === category.toLowerCase());
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    setFilteredCourses(filtered);
  }, [category, searchTerm, courses]);

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Explore Courses
            </span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Discover courses, earn certificates, and build your blockchain credentials
          </p>
        </motion.div>

        <CourseFilter
          categories={categories}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-white rounded-xl shadow-card p-4 h-80">
                <div className="animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
{filteredCourses.map(course => (
  <CourseCard key={course._id || course.id} course={course} />
))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-16"
          >
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No courses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;
