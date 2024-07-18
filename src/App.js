// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import DiagramFetcher from './components/DiagramFetcher';
import ImageDisplay from './components/ImageDisplay';
import DownloadManager from './components/DownloadManager';

const App = () => {
  const [svgData, setSvgData] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}

      <h1>Star Trail</h1>
      <DiagramFetcher setSvgData={setSvgData} setErrorMessage={setErrorMessage} />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {svgData && (
        <>
          <div id="svg-container">
            <ImageDisplay svgData={svgData} />
          </div>
          <DownloadManager svgData={svgData} />
        </>
      )}
    </div>
  );
}

export default App;
