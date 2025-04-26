/* eslint-disable import/no-default-export */
import { TooltipPlacement } from 'antd/lib/tooltip';
import React, { useState } from 'react';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import ExclamationSvg from '../../shared/assets/icons/exclamation.svg';
import { Badge, Tooltip } from '../../zui';

interface Props {
  isSelected: boolean;
  src: string;
  hoveredSrc?: string | null;
  selectedSrc?: string | null;
  hide?: boolean;
  notification?: boolean;
  onClick?: () => void;
  containerStyle?: React.CSSProperties;
  iconStyle?: React.CSSProperties;
  toolTip?: string;
  toolTipPlacement?: TooltipPlacement;
}

export default function ZHoverableIcon(props: Props): NullableReactElement {
  const [isHovered, setIsHovered] = useState(false);
  if (props.hide) return null;

  const { isSelected, src, hoveredSrc, selectedSrc, containerStyle, iconStyle, notification } =
    props;

  let source;
  if (isSelected) source = selectedSrc;
  else if (isHovered) source = hoveredSrc;
  source = source ?? src;

  return (
    <Tooltip placement={props.toolTipPlacement ?? 'right'} title={props.toolTip}>
      <div
        style={{ ...styles.container, ...containerStyle }}
        onMouseOver={() => setIsHovered(true)}
        onFocus={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onBlur={() => setIsHovered(false)}
        onClick={props.onClick}
      >
        <Badge count={notification ? <img alt="" src={ExclamationSvg} /> : 0}>
          <img alt="" src={source} style={{ ...styles.icon, ...iconStyle }} />
        </Badge>
      </div>
    </Tooltip>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    cursor: 'pointer',
  },
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
};
