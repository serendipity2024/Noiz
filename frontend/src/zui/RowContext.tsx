import { createContext } from 'react';

export interface RowContextState {
  gutter?: number;
}

const RowContext = createContext<RowContextState>({
  gutter: 0,
});

export default RowContext;