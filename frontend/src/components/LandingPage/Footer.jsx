import { FaXTwitter } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";
import { SiGmail } from "react-icons/si";


const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">U</span>
              </div>
              <span className="text-2xl font-bold">UserManager</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Streamline your user management with our powerful, intuitive platform. 
              Manage users efficiently and securely.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400  ">
                <FaXTwitter className="w-6 h-6 hover:text-black transition-colors duration-200 " />

              </a>
              <a href="#" className="text-gray-400  ">
                <FaDiscord   className="w-6 h-6  hover:text-blue-600 transition-colors duration-200" />

              </a>
              <a href="#" className="text-gray-400  ">
               <SiGmail className="w-6 h-6  hover:text-red-400
                transition-colors duration-200" />

              </a>
            </div>
          </div>
          
         
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">About</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</a></li>
            </ul>
          </div>
          
         
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
      
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 UserManager. All rights reserved. Built with ❤️ for better user management.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
