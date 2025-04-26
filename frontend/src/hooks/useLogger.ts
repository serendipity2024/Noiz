/* eslint-disable import/no-default-export */
import { useContext } from 'react';
import LoggerContext from '../context/LoggerContext';
import { ZLogger } from '../utils/logging/ZLogger';

export default function useLogger(): ZLogger {
  const logger = useContext(LoggerContext);
  if (!logger) throw new Error('invalid logger');

  return logger;
}
