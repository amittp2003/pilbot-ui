// import React, { useState, useEffect, useRef } from 'react';
// import { Send, Mic, PlusCircle, Moon, Sun, X } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';
// import axios from 'axios';
// import LinkifyText from './LinkifyText';

// const ChatInterface = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isListening, setIsListening] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [topics, setTopics] = useState([
//     { id: 1, name: 'General Inquiry', active: true },
//     { id: 2, name: 'Academics', active: false },
//     { id: 3, name: 'Campus Life', active: false },
//     { id: 4, name: 'Admissions', active: false },
//   ]);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const messagesEndRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Function to get the currently active topic
//   const getActiveTopic = () => {
//     return topics.find(topic => topic.active)?.name || 'General Inquiry';
//   };

//   useEffect(() => {
//     // Set welcome message based on active topic
//     const activeTopic = getActiveTopic();
//     let welcomeMessage = "Welcome to PILBOT! I'm here to assist you ";
    
//     switch(activeTopic) {
//       case 'General Inquiry':
//         welcomeMessage += "with general information about Pillai College of Engineering. How can I help you today?";
//         break;
//       case 'Academics':
//         welcomeMessage += "with academic-related queries. What would you like to know about courses, curriculum, or academic programs?";
//         break;
//       case 'Campus Life':
//         welcomeMessage += "about campus life. Ask me anything about student activities, facilities, or campus experience!";
//         break;
//       case 'Admissions':
//         welcomeMessage += "about admissions. I can help you with application process, requirements, and more.";
//         break;
//       default:
//         welcomeMessage += ". How can I assist you today?";
//     }

//     setMessages([{ 
//       text: welcomeMessage,
//       sender: 'bot'
//     }]);
//   }, [topics]);

//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDarkMode]);

//   // const handleSend = async (e) => {
//   //   e.preventDefault();
//   //   if (input || selectedFile) {
//   //     const newMessage = { 
//   //       text: input, 
//   //       sender: 'user',
//   //       file: selectedFile
//   //     };
//   //     setMessages(prevMessages => [...prevMessages, newMessage]);
//   //     setInput('');
//   //     setSelectedFile(null);
//   //     setIsLoading(true);
      
//   //     try {
//   //       const response = await axios.post("http://127.0.0.1:8000/chat", {
//   //         message: input
//   //       });
        
//   //       setMessages(prevMessages => [...prevMessages, { 
//   //         text: response.data.reply, 
//   //         sender: 'bot' 
//   //       }]);
//   //     } catch (error) {
//   //       console.error('Error:', error);
//   //       setMessages(prevMessages => [...prevMessages, { 
//   //         text: "Sorry, I'm having trouble responding right now. Please try again later.", 
//   //         sender: 'bot' 
//   //       }]);
//   //     } finally {
//   //       setIsLoading(false);
//   //     }
//   //   }
//   // };
//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (input || selectedFile) {
//       const activeTopic = getActiveTopic();
//       const newMessage = { 
//         text: input, 
//         sender: 'user',
//         file: selectedFile,
//         topic: activeTopic
//       };
//       setMessages(prevMessages => [...prevMessages, newMessage]);
//       setInput('');
//       setSelectedFile(null);
//       setIsLoading(true);
      
//       try {
        // const response = await axios.post("http://127.0.0.1:8000/chat", {
        //   message: input,
        //   topic: activeTopic // Send the active topic to the backend
        // });
        
//         setMessages(prevMessages => [...prevMessages, { 
//           text: response.data.reply, 
//           sender: 'bot',
//           topic: activeTopic
//         }]);
//       } catch (error) {
//         console.error('Error:', error);
//         setMessages(prevMessages => [...prevMessages, { 
//           text: "Sorry, I'm having trouble responding right now. Please try again later.", 
//           sender: 'bot' 
//         }]);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const handleTopicSelect = (topicId) => {
//     setTopics(topics.map(topic => ({
//       ...topic,
//       active: topic.id === topicId
//     })));
//   };

//   const handleVoiceInput = () => {
//     setIsListening(true);
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (SpeechRecognition) {
//       const recognition = new SpeechRecognition();
//       recognition.onresult = (event) => {
//         const transcript = event.results[0][0].transcript;
//         setInput(transcript);
//         setIsListening(false);
//       };
//       recognition.start();
//     } else {
//       alert("Sorry, your browser doesn't support speech recognition.");
//       setIsListening(false);
//     }
//   };

//   const handleFileSelect = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//     }
//   };

//   // const handleTopicSelect = (topicId) => {
//   //   setTopics(topics.map(topic => ({
//   //     ...topic,
//   //     active: topic.id === topicId
//   //   })));
//   // };

//   return (
//     <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
//       {/* Sidebar */}
//       <div 
//         className={`${
//           isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
//         } md:translate-x-0 fixed md:static w-64 h-full transition-transform duration-300 ease-in-out ${
//           isDarkMode ? 'bg-gray-800' : 'bg-white'
//         } border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} z-50`}
//       >
//         <div className="p-4 flex items-center justify-between">
//           <img 
//             src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/PCECroppedLogo.png/512px-PCECroppedLogo.png" 
//             alt="PCE Logo" 
//             className="h-8"
//           />
//           <button 
//             onClick={() => setIsSidebarOpen(false)}
//             className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//           >
//             <X size={20} />
//           </button>
//         </div>
//         <div className="p-4">
//           <h2 className="text-lg font-semibold mb-4">Conversation Topics</h2>
//           <div className="space-y-2">
//             {topics.map(topic => (
//               <button
//                 key={topic.id}
//                 onClick={() => handleTopicSelect(topic.id)}
//                 className={`w-full p-2 rounded-lg text-left transition-colors duration-200 ${
//                   topic.active
//                     ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
//                     : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
//                 }`}
//               >
//                 {topic.name}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Main Chat Area */}
//       <div className="flex-1 flex flex-col w-full">
//         {/* Chat Header */}
//         <div className={`p-4 flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//           <div className="flex items-center">
//             <button 
//               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
//               className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               </svg>
//             </button>
//             <h1 className="text-xl font-semibold">PILBOT</h1>
//           </div>
//           <button
//             onClick={() => setIsDarkMode(!isDarkMode)}
//             className={`p-2 rounded-full ${
//               isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
//             }`}
//           >
//             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//           </button>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           <AnimatePresence>
//             {messages.map((msg, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -20 }}
//                 transition={{ duration: 0.3 }}
//                 className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
//                   msg.sender === 'user' 
//                     ? (isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
//                     : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')
//                 }`}>
//                   <p className="text-sm" 
//                   style={{
//                     whiteSpace: 'pre-wrap', // Preserve line breaks and spaces
//                     overflowWrap: 'break-word', // Break long words
//                   }}
//                   ><LinkifyText text={msg.text}/></p>
//                   {msg.file && (
//                     <div className="mt-2 p-2 bg-opacity-50 bg-gray-800 rounded">
//                       <p className="text-xs">📎 {msg.file.name}</p>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//           {isLoading && (
//             <div className="flex justify-start">
//               <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
//                 isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
//               }`}>
//                 <p className="text-sm">Typing...</p>
//               </div>
//             </div>
//           )}
//           <div ref={messagesEndRef} />
//         </div>

//         {/* Input Area */}
//         <form onSubmit={handleSend} className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
//           <div className="flex items-center space-x-2">
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileSelect}
//               className="hidden"
//             />
//             <button
//               type="button"
//               onClick={() => fileInputRef.current?.click()}
//               className={`p-2 rounded-full ${
//                 isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
//               }`}
//             >
//               <PlusCircle size={20} />
//             </button>
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               className={`flex-grow px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 ${
//                 isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
//               }`}
//               placeholder="Type to start chatting..."
//             />
//             <button
//               type="button"
//               onClick={handleVoiceInput}
//               className={`p-2 rounded-full ${
//                 isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
//               } ${isListening ? 'animate-pulse' : ''}`}
//             >
//               <Mic size={20} />
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading || (!input.trim() && !selectedFile)}
//               className={`p-2 rounded-full ${
//                 isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
//               } text-white transition duration-300 ${
//                 (isLoading || (!input.trim() && !selectedFile)) ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               <Send size={20} />
//             </button>
//           </div>
//           {selectedFile && (
//             <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-between">
//               <span className="text-sm truncate">{selectedFile.name}</span>
//               <button
//                 type="button"
//                 onClick={() => setSelectedFile(null)}
//                 className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ChatInterface;

import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, PlusCircle, Moon, Sun, X, Mail, MoreVertical} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// Simple URL detection and linking function
const linkifyText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a 
          key={index} 
          href={part} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-500 hover:underline"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const topicApiEndpoints = {
  'General Inquiry': "http://127.0.0.1:8000/chat/general",
  'Academics': "http://127.0.0.1:8000/chat/academics",
  'Campus Navigation': "http://127.0.0.1:8000/chat/campus-nav",
  'Admissions': "http://127.0.0.1:8000/chat/admissions"
};

const ChatInterface = () => {
  const [topicMessages, setTopicMessages] = useState({
    'General Inquiry': [{ 
      text: "Welcome to PILBOT! I'm here to assist you with general information about Pillai College of Engineering. How can I help you today?", 
      sender: 'bot' 
    }],
    'Academics': [{ 
      text: "Welcome to PILBOT! I'm here to assist you with academic-related queries. What would you like to know about courses, curriculum, or academic programs?", 
      sender: 'bot' 
    }],
    'Campus Navigation': [{ 
      text: "Welcome to PILBOT! I'm here to assist you with Campus Navigation. \n\nYou can provide me your [Current Location] and your [Destination] I'll be guiding you to there.", 
      sender: 'bot' 
    }],
    'Admissions': [{ 
      text: "Welcome to PILBOT! I'm here to assist you about admissions. I can help you with application process, requirements, and more.", 
      sender: 'bot' 
    }]
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [topics, setTopics] = useState([
    { id: 1, name: 'General Inquiry', active: true },
    { id: 2, name: 'Academics', active: false },
    { id: 3, name: 'Campus Navigation', active: false },
    // { id: 4, name: 'Admissions', active: false },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isMessageOptionsOpen, setIsMessageOptionsOpen] = useState(false);

  // Alert states
  // const [showAlert, setShowAlert] = useState(true);
  // const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    scrollToBottom();
  }, [topicMessages]);

  // Function to get the currently active topic
  const getActiveTopic = () => {
    return topics.find(topic => topic.active)?.name || 'General Inquiry';
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input || selectedFile) {
      const activeTopic = getActiveTopic();

      // Select the appropriate API endpoint
      const apiEndpoint = topicApiEndpoints[activeTopic];
      
      const newMessage = { 
        text: input, 
        sender: 'user',
        file: selectedFile,
        topic: activeTopic
      };
      
      // Update messages for the current topic
      setTopicMessages(prev => ({
        ...prev,
        [activeTopic]: [...prev[activeTopic], newMessage]
      }));

      setInput('');
      setSelectedFile(null);
      setIsLoading(true);
      
      try {
        const response = await axios.post(apiEndpoint,{
          message: input,
          topic: activeTopic // Send the active topic to the backend
          },);
          console.log(activeTopic)
          // {
          // method: 'POST',
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        //   body: JSON.stringify({
        //     message: input,
        //     topic: activeTopic // Send the active topic to the backend
        //   })
        // }
        
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        
        // const data = await response.json();
        const data = await response.data;
        console.log(data)
        
        // Update messages for the current topic with bot response
        setTopicMessages(prev => ({
          ...prev,
          [activeTopic]: [...prev[activeTopic], { 
            text: data.reply, 
            sender: 'bot',
            topic: activeTopic
          }]
        }));
      } catch (error) {
        console.error('Error:', error);
        // Update messages for the current topic with error message
        setTopicMessages(prev => ({
          ...prev,
          [activeTopic]: [...prev[activeTopic], { 
            text: "Sorry, I'm having trouble responding right now. Please try again later.", 
            sender: 'bot' 
          }]
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  // const showAlertWithMessage = (message) => {
  //   setAlertMessage(message);
  //   setShowAlert(true);
  //   setTimeout(() => setShowAlert(false), 3000);
  // };

  const handleTopicSelect = (topicId) => {
    setTopics(topics.map(topic => ({
      ...topic,
      active: topic.id === topicId
    })));
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      recognition.start();
    } else {
      alert("Sorry, your browser doesn't support speech recognition.");
      setIsListening(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // Basic email validation
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail) || newEmail === '');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("iam here")
    if (isEmailValid && email) {
      // Handle email submission here
      // showAlertWithMessage('Email saved successfully!');
      
      console.log('Email submitted:', email);
      // You can add your email handling logic here
    }
  };

  const openMessageOptions = (msg) => {
    setSelectedMessage(msg);
    setIsMessageOptionsOpen(true);
  };

  const handleGetEmail = () => {
    // Implement email retrieval logic
    if (!email || !email.trim()) {
      // showAlertWithMessage('Please enter an email address first');
      return;
    }
    const trimmedEmail = email.split('@')[0];
    console.log(trimmedEmail); 
    const resp=axios.post('http://127.0.0.1:8000/chat/mail', {
      message: selectedMessage,  // Dictionary data
      email: email,     // Separate email
    })
    console.log(resp.reply)
    console.log('Selected Message:', selectedMessage);
    // Add your specific email retrieval logic here
    setIsMessageOptionsOpen(false);
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <div 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed md:static w-64 h-full transition-transform duration-300 ease-in-out ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} z-50`}
      >
        <div className="p-4 flex items-center justify-between">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/PCECroppedLogo.png/512px-PCECroppedLogo.png" 
            alt="PCE Logo" 
            className="h-8"
          />
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Conversation Topics</h2>
          <div className="space-y-2">
            {topics.map(topic => (
              <button
                key={topic.id}
                onClick={() => handleTopicSelect(topic.id)}
                className={`w-full p-2 rounded-lg text-left transition-colors duration-200 ${
                  topic.active
                    ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900')
                    : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
        </div>
        
      {/* Email Input Section */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <form onSubmit={handleEmailSubmit} className="space-y-2">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium mb-1"
          >
            Enter your email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={16} className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="your@email.com"
              className={`w-full pl-10 pr-4 py-2 rounded-lg transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-purple-500' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-purple-500'
              } focus:outline-none focus:ring-2 ${
                !isEmailValid ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
          </div>
          {!isEmailValid && email && (
            <p className="text-red-500 text-xs mt-1">Please enter a valid email address</p>
          )}
          <button
            type="submit"
            disabled={!isEmailValid || !email}
            className={`w-full py-2 px-4 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-purple-500 hover:bg-purple-600'
            } text-white font-medium ${
              (!isEmailValid || !email) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Save Email
          </button>
        </form>
      </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Chat Header */}
        <div className={`p-4 flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden mr-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">PILBOT</h1>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {/* {topicMessages[getActiveTopic()].map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                  msg.sender === 'user' 
                    ? (isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')
                }`}>
                  <p className="text-sm" 
                  style={{
                    whiteSpace: 'pre-wrap', // Preserve line breaks and spaces
                    overflowWrap: 'break-word', // Break long words
                  }}
                  >{linkifyText(msg.text)}</p>
                  {msg.file && (
                    <div className="mt-2 p-2 bg-opacity-50 bg-gray-800 rounded">
                      <p className="text-xs">📎 {msg.file.name}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))} */}
            {topicMessages[getActiveTopic()].map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} relative mb-2`}
                onClick={() => {
                  // Close options if clicking anywhere else
                  setIsMessageOptionsOpen(false);
                  setSelectedMessage(null);
                }}
              >
                <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 pr-10 relative group ${
                  msg.sender === 'user' 
                    ? (isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                    : (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800')
                }`}>
                  <p 
                    className="text-sm" 
                    style={{
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {linkifyText(msg.text)}
                  </p>
                  {msg.file && (
                    <div className="mt-2 p-2 bg-opacity-50 bg-gray-800 rounded">
                      <p className="text-xs">📎 {msg.file.name}</p>
                    </div>
                  )}
                  
                  {/* Three-dot menu button only shows dropdown for its specific message */}
                  {msg.sender=== 'bot' &&(<button 
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click from propagating to parent
                      openMessageOptions(msg);
                      if (selectedMessage === msg && isMessageOptionsOpen) {
                        setIsMessageOptionsOpen(false);
                        setSelectedMessage(null);
                      } else {
                        setIsMessageOptionsOpen(true);
                        setSelectedMessage(msg);
                      }
                    }}
                    className="absolute top-1 right-1 p-1 rounded-full transition-all duration-200 
                      hover:bg-opacity-20 hover:bg-gray-500 "
                  >
                    <MoreVertical size={16} />
                  </button>)}

                  {/* Dropdown only shows for the specific selected message */}
                  {selectedMessage === msg && isMessageOptionsOpen && (
                    <div 
                      className={`absolute z-50 right-0 mt-1 w-52 rounded-lg shadow-lg 
                        transform origin-top-right transition-all duration-200 ease-in-out 
                        ${isDarkMode 
                          ? 'bg-gray-800 border border-gray-700 text-white' 
                          : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                    >
                      <div className="py-1">
                        <button
                          onClick={handleGetEmail}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center 
                            transition-colors duration-200 
                            ${isDarkMode 
                              ? 'hover:bg-gray-700 focus:bg-gray-600' 
                              : 'hover:bg-gray-100 focus:bg-gray-200'
                            }`}
                        >
                          <Mail size={16} className="mr-3 text-blue-400" />
                          Get Email
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <div className="flex justify-start">
              <div className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg p-3 ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
              }`}>
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              <PlusCircle size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-grow px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
              }`}
              placeholder="Type to start chatting..."
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-2 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } ${isListening ? 'animate-pulse' : ''}`}
            >
              <Mic size={20} />
            </button>
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !selectedFile)}
              className={`p-2 rounded-full ${
                isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
              } text-white transition duration-300 ${
                (isLoading || (!input.trim() && !selectedFile)) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send size={20} />
            </button>
          </div>
          {selectedFile && (
            <div className="mt-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-between">
              <span className="text-sm truncate">{selectedFile.name}</span>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;