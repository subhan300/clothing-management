const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const path = require('path');
function getLocalePath(lng, ns) {
 
  return path.join(__dirname, 'locales', lng, `${ns}.json`);
}
// Initialize i18next with the backend
const In18NextWrapper= i18next
  .use(Backend)
  .init({
    lng: 'de', // Default language
    preload: ['en', 'de'], // Preload languages
    ns: ['translations'], // Namespace for your translation files
    fallbackLng: 'de', // Fallback language if the selected language is not available
    backend: {
      // Path to the translation files on the backend
      // loadPath: path.join(__dirname, 'locales', '{{lng}}', 'de.json'),
      loadPath: (lng, ns) => getLocalePath(lng, ns),
      
    },
  });
module.exports=In18NextWrapper