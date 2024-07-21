// src/components/AnnoDisplay.js
import React from 'react';
import { formatTime } from './DateFormat';

const AnnoDisplay = ({ anno }) => {
  const filteredAnno = anno.filter(item => item.is_displayed);
  const formatFloat = (number => {
    let str = number.toFixed(3).padStart(8, ' ');
    return str;
  });

  return (
    <div>
      <table border="1"  style={{ margin: '0 auto', borderCollapse: 'collapse' }} >
        <thead>
          <tr>
            <th>Name</th>
            <th>Altitude</th>
            <th>Azimuth</th>
            <th>Time UT1</th>
            <th>Time Local</th>
            <th>Time Zone</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnno.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{formatFloat(parseFloat(item.alt))}</td>
              <td>{formatFloat(parseFloat(item.az))}</td>
              <td>{formatTime(item.time_ut1)}</td>
              <td>{formatTime(item.time_local)}</td>
              <td>{item.time_zone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AnnoDisplay;
