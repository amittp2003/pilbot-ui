// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Sun, Moon, LogOut } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { ThemeContext, UserContext } from '../App';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
//   const { user, logout } = useContext(UserContext);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   return (
//     <nav className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <img src="/pce-logo.png" alt="PCE Logo" className="h-8 w-auto mr-2" />
//             <Link to="/" className="font-bold text-xl text-blue-600">PILBOT</Link>
//           </div>
//           <div className="flex items-center">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={toggleDarkMode}
//               className={`p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'}`}
//             >
//               {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
//             </motion.button>
//             {user ? (
//               <>
//                 <span className={`ml-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
//                   Welcome, {user.name}
//                 </span>
//                 <motion.button
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.9 }}
//                   onClick={handleLogout}
//                   className={`ml-4 p-2 rounded-md ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'}`}
//                 >
//                   <LogOut className="h-6 w-6" />
//                 </motion.button>
//               </>
//             ) : (
//               <Link to="/login" className={`ml-4 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}`}>
//                 Login
//               </Link>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;