import { Collapse } from 'antd';
import React, { ReactElement } from 'react';
import cssModule from './TreeCollapse.module.scss';
import expanSvg from '../../../shared/assets/icons/tp-expan.svg';
import packUpSvg from '../../../shared/assets/icons/tp-pack-up.svg';

export interface TreeCollapseItem {
  key: string;
  isPanel: boolean;
  headerComponent: ReactElement;
  content: ReactElement;
}

interface Props {
  dataSource: TreeCollapseItem[];
}

export const TreeCollapse = (props: Props): ReactElement => {
  return (
    <div className={cssModule.container}>
      <Collapse
        className={cssModule.collapse}
        bordered={false}
        expandIcon={(panelProps) => (
          <img alt="" id={cssModule.expandIcon} src={panelProps.isActive ? packUpSvg : expanSvg} />
        )}
      >
        {props.dataSource.map((item) => {
          return item.isPanel ? (
            <Collapse.Panel
              className={cssModule.panel}
              header={item.headerComponent}
              key={item.key}
            >
              <div>{item.content}</div>
            </Collapse.Panel>
          ) : (
            <div className={cssModule.customDivItem} key={item.key}>
              {item.headerComponent}
            </div>
          );
        })}
      </Collapse>
    </div>
  );
};
