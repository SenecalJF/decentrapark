import React from 'react';
import { DrizzleContext } from '@drizzle/react-plugin';
import { Drizzle } from '@drizzle/store';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import drizzleOptions from './drizzleOptions';
import MyComponent from './MyComponent';
import './App.css';
import NavBar from './components/NavBar';
import Owner from './components/Owner';
import Parkings from './components/Parkings';

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
              <Routes>
                <Route exact path="/" element={<Parkings drizzle={drizzle} drizzleState={drizzleState} />} />
                <Route exact path="/owner" element={<Owner drizzle={drizzle} drizzleState={drizzleState} />} />
              </Routes>
            </Router>
          );
        }}
      </DrizzleContext.Consumer>
    </DrizzleContext.Provider>
  );
};

export default App;
