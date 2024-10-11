import React, { useState, useEffect, useRef, useContext } from 'react';
import { Send, Mic, ArrowLeft, MoreVertical, PlusCircle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeContext, UserContext } from '../App';
import axios from 'axios';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const messagesEndRef = useRef(null);
  const { isDarkMode } = useContext(ThemeContext);
  const { user } = useContext(UserContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([
      { 
        text: "Welcome to PILBOT! I'm here to assist you with information about Pillai College of Engineering. How can I help you today?",
        sender: 'bot'
      }
    ]);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = { text: input, sender: 'user' };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInput('');
      setIsLoading(true);
      
      try {
        const response = await fetchBotResponse(input, user.email);
        setMessages(prevMessages => [...prevMessages, { text: response, sender: 'bot' }]);
      } catch (error) {
        console.error('Error fetching bot response:', error);
        setMessages(prevMessages => [...prevMessages, { text: "Sorry, I'm having trouble responding right now. Please try again later.", sender: 'bot' }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const fetchBotResponse = async (input, userEmail) => {
    // Replace this with your actual API endpoint
    const API_ENDPOINT = 'https://your-chatbot-api-endpoint.com/chat';
    
    try {
      const response = await axios.post(API_ENDPOINT, {
        message: input,
        userEmail: userEmail
      });
      return response.data.message;
    } catch (error) {
      throw new Error('Failed to fetch bot response');
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Implement voice recognition logic here
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

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`w-64 hidden md:flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="p-4 flex items-center justify-between">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/PCECroppedLogo.png/512px-PCECroppedLogo.png" alt="PCE Logo" className="h-8" />
          <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
            <MoreVertical size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Conversation Topics</h2>
            {/* Add your conversation topics here */}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className={`p-4 flex items-center justify-between ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <button className="md:hidden mr-2">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold">PILBOT</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Search size={20} />
            </button>
            <button className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <MoreVertical size={20} />
            </button>
          </div>
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
            <button
              type="button"
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
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
              disabled={isLoading || !input.trim()}
              className={`p-2 rounded-full ${
                isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
              } text-white transition duration-300 ${
                (isLoading || !input.trim()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;