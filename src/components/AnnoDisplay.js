// src/components/AnnoDisplay.js
import React from 'react';

const MONTHS = [
  { abbr: '', name: '' },
  { abbr: 'Jan', name: 'January' },
  { abbr: 'Feb', name: 'February' },
  { abbr: 'Mar', name: 'March' },
  { abbr: 'Apr', name: 'April' },
  { abbr: 'May', name: 'May' },
  { abbr: 'Jun', name: 'June' },
  { abbr: 'Jul', name: 'July' },
  { abbr: 'Aug', name: 'August' },
  { abbr: 'Sep', name: 'September' },
  { abbr: 'Oct', name: 'October' },
  { abbr: 'Nov', name: 'November' },
  { abbr: 'Dec', name: 'December' }
];

const formatTimeList = (year, month = 1, day = 1, hour = 12, minute = 0, second = 0) => {
    const pad = number => number.toString().padStart(2, '0');
    const yearStr = year > 0 ? `${year} CE` : `${-year + 1} BCE`;
    const monthStr = MONTHS[month].abbr;
    const dateStr = `${day} ${monthStr} ${yearStr}`;
    const secondStr = Number.isInteger(second) ? pad(second) : second.toFixed(3).padStart(6, '0');
    const timeStr = `${pad(hour)}:${pad(minute)}:${secondStr}`;
    return [dateStr, timeStr];
}

const formatTime = (time) => {
  if (!time) return 'N/A';
  const year = parseInt(time[0]);
  const month = parseInt(time[1]);
  const day = parseInt(time[2]);
  const hour = parseInt(time[3]);
  const minute = parseInt(time[4]);
  const second = parseFloat(time[5]);
  const dateTimeStrList = formatTimeList(year, month, day, hour, minute, second);
  return `${dateTimeStrList[0]} ${dateTimeStrList[1]}`;
}

const AnnoDisplay = ({ anno }) => {
  const filteredAnno = anno.filter(item => item.is_displayed);
  const formatFloat = (number => {
    let str = number.toFixed(3).padStart(8, ' ');
    return str;
  })

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
