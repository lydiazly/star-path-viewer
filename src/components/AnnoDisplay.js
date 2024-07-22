// src/components/AnnoDisplay.js
import React from 'react';
import { dateTimeToStr, formatTimezone } from '../utils/dateUtils';
import { PT_NAMES } from '../utils/constants';

const AnnoDisplay = ({ anno }) => {
  const filteredAnno = anno.filter(item => item.is_displayed);
  const tzStr = formatTimezone(parseFloat(filteredAnno[0].time_zone));
  const redAsterisk = <span style={{ color: 'red' }}>*</span>;
  
  const formatFloat = (number) => {
    const str = number.toFixed(3).padStart(8, 0);
    return str;
  };

  return (
    <div>
      <table border="1" style={{ margin: '0 auto', borderCollapse: 'collapse' }} >
        <thead>
          <tr>
            <th rowSpan="2">Name</th>
            <th rowSpan="2">Altitude</th>
            <th rowSpan="2">Azimuth</th>
            <th colSpan="2">{`Local Standard Time`}{redAsterisk}{` (${tzStr})`}</th>
            <th colSpan="2">UT1 Time</th>
          </tr>
          <tr>
            <th>Gregorian</th>
            <th>Julian</th>
            <th>Gregorian</th>
            <th>Julian</th>
          </tr>
        </thead>
        <tbody>
          {filteredAnno.map((item, index) => (
            <tr key={index}>
              <td>{PT_NAMES[item.name] || item.name}</td>
              <td>{formatFloat(parseFloat(item.alt))}</td>
              <td>{formatFloat(parseFloat(item.az))}</td>
              <td>{dateTimeToStr(item.time_local)}</td>
              <td>{dateTimeToStr(item.time_local_julian)}</td>
              <td>{dateTimeToStr(item.time_ut1)}</td>
              <td>{dateTimeToStr(item.time_ut1_julian)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div class="footnote" style={{ margin: '0.5rem 9rem', textAlign: "left" }}>
        {redAsterisk} Values are in local standard time, not Daylight Saving Time.
      </div>
    </div>
  );
};

export default AnnoDisplay;
