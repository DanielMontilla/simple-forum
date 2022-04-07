import { useState, useEffect } from 'react';

type Size = { width: number, height: number };
const getWindowSize = (): Size => {
   return { width: window.innerWidth, height: window.innerHeight }
};

const useWindowSize = () => {
   const [windowSize, setWindowSize] = useState<Size>(getWindowSize());

   useEffect(() => {
      const handleResize = () => setWindowSize(getWindowSize());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   return windowSize
};

export default useWindowSize;
