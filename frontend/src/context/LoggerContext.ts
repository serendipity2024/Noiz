/* eslint-disable import/no-default-export */
import React from 'react';
import { ZLogger } from '../utils/logging/ZLogger';

const LoggerContext = React.createContext<ZLogger | null>(null);

export default LoggerContext;
