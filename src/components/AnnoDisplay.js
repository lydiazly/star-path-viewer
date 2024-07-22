// src/components/AnnoDisplay.js
import React from 'react';
import { dateTimeToStr, formatTimezone } from '../utils/dateUtils';
import { formatDecimalDgrees } from '../utils/coordUtils';
import { PT_NAMES } from '../utils/constants';

const AnnoDisplay = ({ anno }) => {
  const filteredAnno = anno.filter(item => item.is_displayed);
  const tzStr = formatTimezone(parseFloat(filteredAnno[0].time_zone));
  const redAsterisk = <span style={{ color: 'red' }}>*</span>;

  return (
    <div>
      <table border="1" style={{ borderCollapse: 'collapse' }} >
        <thead>
          <tr>
            <th rowSpan="2">Point</th>
            <th rowSpan="2">Altitude</th>
            <th rowSpan="2">Azimuth</th>
            <th colSpan="2">{`Standard Time`}{redAsterisk}{` (${tzStr})`}</th>
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
              <td>{formatDecimalDgrees(parseFloat(item.alt))}</td>
              <td>{formatDecimalDgrees(parseFloat(item.az))}</td>
              <td>{dateTimeToStr(item.time_local)}</td>
              <td>{dateTimeToStr(item.time_local_julian)}</td>
              <td>{dateTimeToStr(item.time_ut1)}</td>
              <td>{dateTimeToStr(item.time_ut1_julian)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="footnote" style={{ textAlign: "left" }}>
        {redAsterisk} Not in Daylight Saving Time.
      </div>
    </div>
  );
};

export default AnnoDisplay;
