// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { X } from 'lucide-react';

// const Onboarding = ({ onClose }) => {
//   const [step, setStep] = useState(0);
//   const steps = [
//     {
//       title: 'Welcome to PILBOT',
//       content: "PILBOT is here to assist you with information about Pillai College of Engineering. Let's get started!",
//     },
//     {
//       title: 'Ask Questions',
//       content: 'You can ask PILBOT anything about courses, faculty, campus facilities, or admission processes.',
//     },
//     {
//       title: 'Voice Input',
//       content: 'Try using voice input by clicking the microphone icon for a hands-free experience.',
//     },
//     {
//       title: 'Personalized Assistance',
//       content: 'PILBOT learns from your interactions to provide more personalized responses over time.',
//     },
//   ];

//   const nextStep = () => {
//     if (step < steps.length - 1) {
//       setStep(step + 1);
//     } else {
//       onClose();
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: 50 }}
//         className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//       >
//         <div className="bg-white rounded-lg p-8 max-w-md w-full">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-2xl font-bold">{steps[step].title}</h2>
//             <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//           <p className="mb-6">{steps[step].content}</p>
//           <div className="flex justify-between">
//             <div className="flex space-x-2">
//               {steps.map((_, index) => (
//                 <div
//                   key={index}
//                   className={`w-2 h-2 rounded-full ${
//                     index === step ? 'bg-blue-600' : 'bg-gray-300'
//                   }`}
//                 />
//               ))}
//             </div>
//             <button
//               onClick={nextStep}
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
//             >
//               {step === steps.length - 1 ? 'Get Started' : 'Next'}
//             </button>
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// };

// export default Onboarding;