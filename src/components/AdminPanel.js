import React, { useState } from 'react';
import { Lock, Link as LinkIcon, FileText, ExternalLink, Upload, RefreshCw, Trash2, PlusCircle, Search, Check, X, LayoutGrid, Settings, Users, Database, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminLayout = ({ isDarkMode, onTrainLinks }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('training');
  const [links, setLinks] = useState([]);
  const [websiteLink, setWebsiteLink] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(['pdf']);
  const [isTraining, setIsTraining] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: <LayoutGrid size={20} />, label: 'Dashboard' },
    { id: 'training', icon: <Database size={20} />, label: 'Training' },
    { id: 'users', icon: <Users size={20} />, label: 'Users' },
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' }
  ];

  const linkTypes = [
    { value: 'pdf', icon: <FileText size={16} />, label: 'PDF Links' },
    { value: 'text', icon: <LinkIcon size={16} />, label: 'Text' },
    { value: 'external', icon: <ExternalLink size={16} />, label: 'External Links' }
  ];

  const handleAddLink = () => {
    if (!websiteLink.trim()) return;
    const newLinks = selectedTypes.map(type => ({
      url: websiteLink.trim(),
      type,
      id: `${websiteLink.trim()}-${type}-${Date.now()}`
    }));
    const uniqueNewLinks = newLinks.filter(newLink => 
      !links.some(link => link.url === newLink.url && link.type === newLink.type)
    );
    setLinks([...links, ...uniqueNewLinks]);
    setWebsiteLink('');
    setIsAddModalOpen(false);
  };

  const handleTrainSubmit = async () => {
    if (selectedLinks.length === 0) return;
    setIsTraining(true);
    try {
      const linksToTrain = links.filter(link => selectedLinks.includes(link.id));
      await onTrainLinks(linksToTrain);
      setLinks(links.filter(link => !selectedLinks.includes(link.id)));
      setSelectedLinks([]);
    } catch (error) {
      console.error('Training failed:', error);
    } finally {
      setIsTraining(false);
    }
  };

  const filteredLinks = links.filter(link => 
    link.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAllLinks = () => {
    if (selectedLinks.length === filteredLinks.length) {
      setSelectedLinks([]);
    } else {
      setSelectedLinks(filteredLinks.map(link => link.id));
    }
  };

  const renderAdminPanel = () => (
    <div className="min-h-screen p-6">
      <div className={`max-w-4xl mx-auto rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Lock className="w-6 h-6 mr-2 text-purple-500" />
              <h1 className="text-2xl font-bold">Admin Training Panel</h1>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'
              } text-white`}
            >
              <PlusCircle size={18} />
              Add Link
            </button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search links..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'
                }`}
              />
            </div>
          </div>

          {filteredLinks.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={toggleAllLinks}
                  className={`px-3 py-1 rounded-lg border ${
                    isDarkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {selectedLinks.length === filteredLinks.length ? 'Deselect All' : 'Select All'}
                </button>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  {selectedLinks.length} of {filteredLinks.length} selected
                </span>
              </div>

              <div className="space-y-2">
                {filteredLinks.map((link) => (
                  <div
                    key={link.id}
                    className={`flex items-center p-4 rounded-lg transition-all duration-200 ${
                      selectedLinks.includes(link.id)
                        ? (isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50')
                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-50')
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelectedLinks(prev =>
                          prev.includes(link.id)
                            ? prev.filter(id => id !== link.id)
                            : [...prev, link.id]
                        );
                      }}
                      className="mr-4"
                    >
                      {selectedLinks.includes(link.id) ? (
                        <Check className="w-4 h-4 text-purple-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-sm border-2 border-gray-400" />
                      )}
                    </button>
                    <div className="flex-grow">
                      <p className="font-medium">{link.url}</p>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                        isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                      }`}>
                        {link.type}
                      </span>
                    </div>
                    <button
                      onClick={() => setLinks(prev => prev.filter(l => l.id !== link.id))}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleTrainSubmit}
                disabled={isTraining || selectedLinks.length === 0}
                className={`w-full mt-6 py-3 rounded-lg flex items-center justify-center ${
                  isTraining || selectedLinks.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : isDarkMode
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-purple-500 hover:bg-purple-600'
                } text-white`}
              >
                {isTraining ? (
                  <>
                    <RefreshCw size={18} className="mr-2 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Upload size={18} className="mr-2" />
                    Train {selectedLinks.length} Link{selectedLinks.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <div 
        className={`relative h-full transition-all duration-300 ${
          isDarkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
        } ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="p-4">
          <h1 className={`font-bold mb-8 ${isCollapsed ? 'text-center text-sm' : 'text-xl'}`}>
            {isCollapsed ? 'PB' : 'PILBOT ADMIN'}
          </h1>
          <nav className="space-y-2">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? (isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                    : (isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')
                }`}
              >
                {item.icon}
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </button>
            ))}
          </nav>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 p-2 rounded-full ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-600'
          } shadow-lg`}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className={`flex-1 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
        {activeTab === 'training' ? renderAdminPanel() : (
          <div className="h-full flex items-center justify-center">
            <p className="text-lg">Coming Soon</p>
          </div>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`w-full max-w-md p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Link</h2>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter website URL"
                value={websiteLink}
                onChange={(e) => setWebsiteLink(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-50'
                }`}
              />
              <div className="grid grid-cols-3 gap-2">
                {linkTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => {
                      setSelectedTypes(prev =>
                        prev.includes(type.value)
                          ? prev.filter(t => t !== type.value)
                          : [...prev, type.value]
                      );
                    }}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${
                      selectedTypes.includes(type.value)
                        ? (isDarkMode ? 'bg-purple-600' : 'bg-purple-500 text-white')
                        : (isDarkMode ? 'bg-gray-700' : 'bg-gray-200')
                    }`}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddLink}
                  className={`px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-purple-600' : 'bg-purple-500'
                  } text-white`}
                >
                  Add Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;