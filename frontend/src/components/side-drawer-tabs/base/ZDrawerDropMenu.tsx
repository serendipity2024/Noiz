/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { ReactNode, useState } from 'react';
import ArrowDown from '../../../shared/assets/icons/arrow-down.svg';
import { ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import ZDrawerSeparator from '../../editor/ZDrawerSeparator';

interface Props {
  title: string;
  initIsOpen?: boolean;
  style?: React.CSSProperties;
  children?: ReactNode;
}

export default function ZDrawerDropMenu(props: Props) {
  const [isOpen, setIsOpen] = useState(props.initIsOpen);

  const { style, title } = props;
  const containerStyle = { ...styles.container, ...style };
  const arrowStyle = {
    ...styles.arrowDown,
    ...(isOpen ? null : styles.rotateToRight),
  };

  const renderTitleRow = (onClick: () => void) => (
    <div style={styles.titleRow} onClick={onClick}>
      <span style={styles.categoryName}>{title}</span>
      <img alt="" style={arrowStyle} src={ArrowDown} />
    </div>
  );

  if (!isOpen) return <div style={containerStyle}>{renderTitleRow(() => setIsOpen(true))}</div>;

  const renderEmptyContent = () => {
    return (
      <div style={styles.emptyContainer}>
        <span style={styles.emptyText}>Nothing in this category</span>
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      {renderTitleRow(() => setIsOpen(false))}
      <ZDrawerSeparator theme="accent" style={styles.separator} />
      {props.children ?? renderEmptyContent()}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.SECONDARY,
    padding: '14px',
  },
  withMarginTop: {
    marginTop: '12px',
  },
  titleRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    cursor: 'pointer',
  },
  categoryName: {
    flex: 1,
    fontSize: '12px',
    color: ZThemedColors.ACCENT,
  },
  arrowDown: {
    width: '12px',
    height: '6px',
  },
  rotateToRight: {
    transform: 'rotate(-90deg)',
  },
  separator: {
    marginTop: '10px',
    marginBottom: '20px',
  },
  emptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '120px',
  },
  emptyText: {
    fontSize: '12px',
    color: ZThemedColors.SECONDARY_TEXT,
  },
};
