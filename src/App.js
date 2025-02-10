import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ChatInterface from './components/ChatInterface';
import AdminLayout from './components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<ChatInterface />} />
          <Route path="/admin_pan" element={<AdminLayout />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
