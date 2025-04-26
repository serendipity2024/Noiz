/* eslint-disable import/no-default-export */
import { useLayoutEffect, useState } from 'react';
import { ZSize } from '../models/interfaces/Frame';

export default function useWindowSize(): ZSize {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
