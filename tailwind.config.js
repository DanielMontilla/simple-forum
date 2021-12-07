const colors = require('tailwindcss/colors');

module.exports = {
   purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
   darkMode: false,
   theme: {
      colors: {
         primary: '#45A29E',
         secundary: '#66FCF1',
         normal: '#C5C6C7',
         regular: '#949494',
         alternate: '#0B0C10',
         background: '#1F2833',
      },
      fontFamily: {},
      extend: {}
   },
   variants: {
      extend: {}
   },
   plugins: []
};
