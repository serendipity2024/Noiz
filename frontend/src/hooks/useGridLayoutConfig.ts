/* eslint-disable import/no-default-export */
import useWindowSize from './useWindowSize';

export default function useGridLayoutConfig(): {
  columnCount: number;
  rowHeight: number;
  webPageWidth: number;
  webPageHeight: number;
} {
  const { width, height } = useWindowSize();
  const columnCount = 20;
  const webPageWidth = (width / 3) * 2;
  const webPageHeight = (height / 3) * 2;

  return {
    columnCount,
    rowHeight: webPageWidth / columnCount,
    webPageWidth,
    webPageHeight,
  };
}
