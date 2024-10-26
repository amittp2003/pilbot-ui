import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, PlusCircle, Moon, Sun, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [topics, setTopics] = useState([
    { id: 1, name: 'General Inquiry', active: true },
    { id: 2, name: 'Academics', active: false },
    { id: 3, name: 'Campus Life', active: false },
    { id: 4, name: 'Admissions', active: false },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([
      { 
        text: "Welcome to PILBOT! I'm here to assist you with information about Pillai College of Engineering. How can I help you today?",
        sender: 'bot'
      }
    ]);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim() || selectedFile) {
      const newMessage = { 
        text: input, 
        sender: 'user',
        file: selectedFile
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
      setSelectedFile(null);
      setIsLoading(true);
      
      try {
        // Simulate API response
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = "Thank you for your message. I'm here to help!";
        setMessages(prevMessages => [...prevMessages, { text: response, sender: 'bot' }]);
      } catch (error) {
        console.error('Error:', error);
        setMessages(prevMessages => [...prevMessages, { 
          text: "Sorry, I'm having trouble responding right now. Please try again later.", 
          sender: 'bot' 
        }]);
      } finally {
        setIsLoading(false);
      }
    }
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

  const handleTopicSelect = (topicId) => {
    setTopics(topics.map(topic => ({
      ...topic,
      active: topic.id === topicId
    })));
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
            {messages.map((msg, index) => (
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
                  <p className="text-sm">{msg.text}</p>
                  {msg.file && (
                    <div className="mt-2 p-2 bg-opacity-50 bg-gray-800 rounded">
                      <p className="text-xs">📎 {msg.file.name}</p>
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
                <p className="text-sm">Typing...</p>
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