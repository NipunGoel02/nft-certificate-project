import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-1"
          >
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-secondary-300 bg-clip-text text-transparent">CertiChain</span>
            </Link>
            <p className="text-gray-400 mb-4">Learn, earn certificates, and build your blockchain credentials all in one place.</p>
            <div className="flex space-x-4">
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social}
                  href="#" 
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                  </svg>
                </a>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary-400 to-secondary-300 bg-clip-text text-transparent">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/courses" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Courses</Link></li>
              <li><Link to="/certificates" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Certificates</Link></li>
              <li><Link to="/hackathons" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Hackathons</Link></li>
              <li><Link to="/for-organizations" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">For Organizations</Link></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary-400 to-secondary-300 bg-clip-text text-transparent">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Blog</Link></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary-400 to-secondary-300 bg-clip-text text-transparent">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors duration-300">Cookie Policy</Link></li>
            </ul>
          </motion.div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} NFT Certificate Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
