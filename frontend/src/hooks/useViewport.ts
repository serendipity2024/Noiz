/* eslint-disable import/no-default-export */
import { ZSize } from '../models/interfaces/Frame';
import { useConfiguration } from './useConfiguration';

export default function useViewport(): ZSize {
  const { viewport } = useConfiguration();
  return viewport;
}
