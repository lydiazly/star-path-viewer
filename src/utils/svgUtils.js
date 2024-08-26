// src/utils/svgUtils.js
import DOMPurify from 'dompurify';

const sanitizeSvg = (svgData) => {
  const svgBase64 = svgData;
  /* Decode base64 to binary string */
  const svgBinaryString = atob(svgBase64);
  /* Convert binary string to an array of char codes */
  const charCodes = new Uint8Array(svgBinaryString.length);
  for (let i = 0; i < svgBinaryString.length; i++) {
    charCodes[i] = svgBinaryString.charCodeAt(i);
  }
  /* Decode UTF-8 from char codes */
  const decoder = new TextDecoder('utf-8');
  const svgDecoded = decoder.decode(charCodes);
  /* Sanitize the SVG content using DOMPurify */
  const sanitizedSvg = DOMPurify.sanitize(svgDecoded, {
    ADD_TAGS: ['use', 'clipPath'],
    ADD_ATTR: ['id', 'xlink:href', 'clip-path']
  });
  return sanitizedSvg;
};

export {
  sanitizeSvg,
};