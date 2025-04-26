/* eslint-disable import/no-default-export */
import { useContext } from 'react';
import StoreContexts, { AllStores } from '../mobx/StoreContexts';

const useStores = (): AllStores => useContext(StoreContexts);

export default useStores;
