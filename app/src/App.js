import React from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import drizzleOptions from './drizzleOptions';
import MyComponent from './MyComponent';
import './App.css';
import NavBar from './components/NavBar';

const drizzle = new Drizzle(drizzleOptions);

const App = () => {
  return (
    <DrizzleContext.Provider drizzle={drizzle}>
      <DrizzleContext.Consumer>
        {(drizzleContext) => {
          const { drizzle, drizzleState, initialized } = drizzleContext;

          if (!initialized) {
            return 'Loading...';
          }

          return (
            <Router>
              <NavBar drizzleState={drizzleState} />
              <Routes></Routes>
            </Router>
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
};

export default App;
