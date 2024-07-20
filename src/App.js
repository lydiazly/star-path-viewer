// import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import AnnoDisplay from './components/AnnoDisplay';
import DiagramFetcher from './components/DiagramFetcher';
import ImageDisplay from './components/ImageDisplay';
import DownloadManager from './components/DownloadManager';

const App = () => {
  const [diagramId, setDiagramId] = useState('');
  const [svgData, setSvgData] = useState('');
  const [anno, setAnno] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const clearImage = () => {setSvgData(''); setAnno('')}

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}

      <h1>Star Trail</h1>
      <DiagramFetcher setDiagramId={setDiagramId} setSvgData={setSvgData} setAnno={setAnno} setErrorMessage={setErrorMessage} clearImage={clearImage} />
      <br></br>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <br></br>
      {svgData && (
        <>
          <div id="svg-container">
            <ImageDisplay svgData={svgData} />
          </div>
          <br></br>
          <DownloadManager svgData={svgData} filenameBase={`st_${diagramId}`} dpi="300" />
          <br></br>
          <div id="annotations">
            <AnnoDisplay anno={anno} />
          </div>
          <br></br>
        </>
      )}
    </div>
  );
}

export default App;
