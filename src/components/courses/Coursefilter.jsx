import { useState } from 'react';
import { motion } from 'framer-motion';

const Coursefilter = ({ categories, selectedCategory, onCategoryChange, searchTerm, onSearchChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-12"
    >
      <div className="bg-white rounded-xl shadow-card backdrop-blur-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="relative">
              <select
                className="w-full py-3 px-4 border border-gray-200 rounded-lg appearance-none focus:ring-primary-500 focus:border-primary-500 transition-all duration-300"
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-primary-600 text-sm font-medium flex items-center"
          >
            Advanced Filters
            <svg 
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ 
              height: isExpanded ? 'auto' : 0,
              opacity: isExpanded ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <div className="flex space-x-2">
                  {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                    <button
                      key={level}
                      className="px-3 py-1 rounded-full text-sm border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg">
                  <option>Any Duration</option>
                  <option>Under 1 Hour</option>
                  <option>1-3 Hours</option>
                  <option>3+ Hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select className="w-full p-2 border border-gray-200 rounded-lg">
                  <option>Any Rating</option>
                  <option>4+ Stars</option>
                  <option>3+ Stars</option>
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={() => onCategoryChange('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            selectedCategory === 'all' 
              ? 'bg-primary-500 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedCategory === category.id 
                ? 'bg-primary-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default Coursefilter;
