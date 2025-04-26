import React, { ReactElement, useState } from 'react';
import cx from 'classnames';
import { observer } from 'mobx-react';
import { Row } from '../../zui';
import useStores from '../../hooks/useStores';
import { ZManagementConsoleObjectConfigRow } from './ZManagementConsoleObjectConfigRow';
import cssModule from './ZManagementConsoleDataModel.module.scss';

export const ZManagementConsoleDataModel = observer((): ReactElement => {
  const { coreStore } = useStores();
  const { objects: dataModelObjects } = coreStore.mcConfiguration;
  const [selectedObjectIndex, setSelectedObjectIndex] = useState(0);

  return (
    <Row className={cssModule.container} justify="start" align="middle">
      <div className={cssModule.objectButtonList}>
        {dataModelObjects.map((obj, idx) => (
          <div
            className={cx(cssModule.objectButton, {
              [cssModule.selectedObjectButton]: idx === selectedObjectIndex,
            })}
            key={obj.objectType.table}
            onClick={() => setSelectedObjectIndex(idx)}
          >
            <div className={cssModule.buttonContent}>{obj.objectType.table}</div>
          </div>
        ))}
      </div>
      <div className={cssModule.detail}>
        <ZManagementConsoleObjectConfigRow
          object={dataModelObjects[selectedObjectIndex]}
          dataModelObjects={dataModelObjects}
        />
      </div>
    </Row>
  );
});
