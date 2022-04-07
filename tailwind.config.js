const colors = require('tailwindcss/colors');

module.exports = {
   purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
   darkMode: false,
   theme: {
      colors: {
         primary: '#45A29E',
         secundary: '#66FCF1',
         tertiary: '#3A419A',
         normal: '#C5C6C7',
         regular: '#949494',
         alternate: '#0B0C10',
         background: '#1F2833',
         other: '#20252C',
         error: '#C3423A',
         succ: '#3AC33F',
      },
      fontFamily: {},
      extend: {}
   },
   variants: {
      extend: {}
   },
   plugins: []
};
