import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Web3Fullstack } from './components/Web3Fullstack';
import { ReactUI } from './components/ReactUI';

function App() {
  return (
    <div className='app'>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Web3Fullstack/>} />
          <Route path='/web3stack' element={<Web3Fullstack/>} />
          <Route path='/reactui' element={<ReactUI />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
