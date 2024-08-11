// src/utils/determineService.js
import checkNominatimAccessibility from './checkNominatimAccessibility';

const determineService = async () => {
    const isNominatimAccessible = await checkNominatimAccessibility();
    return isNominatimAccessible ? 'nominatim' : 'baidu';
};

export default determineService;
