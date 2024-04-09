import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Home } from './component/home'
import { Admin } from './component/admin'
import logo from './logo.svg';
import './App.css';

function App() {
  const PrivateWrapper = ({ auth: { isAuthenticated } }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route element={<PrivateWrapper auth={{ isAuthenticated: true }} />}>
            <Route path="/user-dashboard" element={<Admin/>} />
          </Route>
        </Routes>
      </Router>
    </div>
  );

}

export default App;
