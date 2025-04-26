import React, { ReactElement } from 'react';
import { createFromIconfontCN } from '@ant-design/icons';
import iconfontConfig from '../../shared/assets/iconfont/iconfont.json';

// Create a custom IconFont component using the configuration from iconfont.json
const IconFont = createFromIconfontCN({
  scriptUrl: iconfontConfig.scriptUrl,
});

interface Props {
  type: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

/**
 * A component for displaying icons from iconfont
 * 
 * @param props Component properties
 * @returns IconFont component
 */
export default function ZIconFont(props: Props): ReactElement {
  const { type, style, className, onClick } = props;
  
  return (
    <IconFont
      type={type}
      style={style}
      className={className}
      onClick={onClick}
    />
  );
}