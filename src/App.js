import React from 'react';
import './App.css';
import OpenLayersMap from './components/OpenLayersMap';


function App() {
  return (
    <div className="App">
      <header className="">
        <h1>OpenLayers Map in React</h1>
      </header>
      <OpenLayersMap />
    </div>
  );
}

export default App;
