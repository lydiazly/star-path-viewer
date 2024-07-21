// src/App.js
// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import AnnoDisplay from './components/AnnoDisplay';
import DiagramFetcher from './components/DiagramFetcher';
import ImageDisplay from './components/ImageDisplay';
import DownloadManager from './components/DownloadManager';
import DateLocationDisplay from './components/DateLocationDisplay';

const App = () => {
  const [diagramId, setDiagramId] = useState('');
  const [svgData, setSvgData] = useState('');
  const [anno, setAnno] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [date, setDate] = useState([2024, 7, 20]); // Default date, you can change this
  const [location, setLocation] = useState({ lat: 0, lng: 0 });

  const clearImage = () => {
    setSvgData('');
    setAnno('');
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}

      <h1>Star Trail</h1>
      <DiagramFetcher 
        setDiagramId={setDiagramId} 
        setSvgData={setSvgData} 
        setAnno={setAnno} 
        setErrorMessage={setErrorMessage} 
        clearImage={clearImage} 
        onLocationChange={handleLocationChange}
      />
      <br />
      <DateLocationDisplay date={date} location={location} />
      <br />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <br />
      {svgData && (
        <>
          <div id="svg-container">
            <ImageDisplay svgData={svgData} />
          </div>
          <br />
          <DownloadManager svgData={svgData} filenameBase={`st_${diagramId}`} dpi="300" />
          <br />
          <div id="annotations">
            <AnnoDisplay anno={anno} />
          </div>
          <br />
        </>
      )}
    </div>
  );
};

export default App;
