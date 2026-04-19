import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import VoiceAssistant from './VoiceAssistant';
import BridgeAI from './BridgeAI';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/auth" element={<BridgeAI initialView="auth" />} />
          <Route path="/dashboard" element={<BridgeAI initialView="dashboard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;