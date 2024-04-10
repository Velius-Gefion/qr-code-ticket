import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { Home } from './component/home'
import { Admin } from './component/admin'
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!window.localStorage.getItem('isLoggedIn'));

  const handleLogout = () => {
    window.localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            }
          />
          <Route
            path="/admin"
            element={
              isLoggedIn ? (
                <Admin handleLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;