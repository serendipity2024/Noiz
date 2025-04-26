import _ from 'lodash';
import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { Row } from '../../zui';
import { useMutations } from '../../hooks/useMutations';
import { PrimaryMenuItem, SecondaryMenuItem } from '../../shared/type-definition/ManagementConsole';
import { ZManagementConsoleTabFilter } from './ZManagementConsoleTabFilter';
import cssModule from './ZManagementConsoleTabConfigRow.module.scss';
import useStores from '../../hooks/useStores';
import i18n from './ZManagementConsoleTabConfigRow.i18n.json';
import useLocale from '../../hooks/useLocale';
import ConfigInput from '../side-drawer-tabs/right-drawer/shared/ConfigInput';
import { ZManagementConsoleColumnConfigRow } from './ZManagementConsoleColumnConfigRow';
import { ZManagementConsoleSelectAction } from './ZManagementConsoleSelectAction';

const DEFAULT_PAGE_SIZE = '10';

interface Props {
  secondaryMenuItem: SecondaryMenuItem;
  primaryMenuItem: PrimaryMenuItem;
  menuItems: PrimaryMenuItem[];
}

export const ZManagementConsoleTabConfigRow = observer((props: Props): ReactElement => {
  const { secondaryMenuItem, primaryMenuItem, menuItems } = props;
  const { managementConsoleMutation } = useMutations();
  const { localizedContent } = useLocale(i18n);
  const { coreStore } = useStores();

  const currentPrimaryMenuItem: PrimaryMenuItem =
    coreStore.mcConfiguration.menuItems.find((mi) => mi.id === primaryMenuItem.id) ??
    primaryMenuItem;

  const currentSecondaryMenuItem: SecondaryMenuItem =
    currentPrimaryMenuItem?.subItems.find((si) => si.id === secondaryMenuItem.id) ??
    secondaryMenuItem;

  function updateSecondaryMenuItem<T>(key: keyof SecondaryMenuItem, newValue: T) {
    const newSecondaryMenuItem: SecondaryMenuItem = {
      ...currentSecondaryMenuItem,
      [key]: newValue,
    };
    managementConsoleMutation.updateSecondaryMenuItem(
      newSecondaryMenuItem,
      currentPrimaryMenuItem,
      menuItems
    );
  }

  function renderDataConfigComponent(): ReactElement {
    return (
      <>
        <div className={cssModule.title}>{localizedContent.data}</div>
        <Row className={cssModule.dataContainer} align="middle">
          <div className={cssModule.dataItem}>
            <div className={cssModule.introduceTitle}>{localizedContent.dataModel}</div>
            <ConfigInput
              className={cssModule.input}
              value={currentSecondaryMenuItem.dataSource.table}
            />
          </div>
          <div className={cssModule.dataItem}>
            <div className={cssModule.introduceTitle}>{localizedContent.pageSize}</div>
            <ConfigInput className={cssModule.input} value={DEFAULT_PAGE_SIZE} />
          </div>
        </Row>
      </>
    );
  }

  return (
    <div className={cssModule.container}>
      <div className={cssModule.itemMargin}>{renderDataConfigComponent()}</div>
      <div className={cssModule.itemMargin}>
        <div className={cssModule.title}>{localizedContent.dataSelection}</div>
        <ZManagementConsoleColumnConfigRow
          tableName={currentSecondaryMenuItem.dataSource.table}
          columns={currentSecondaryMenuItem.displayColumns}
          onColumnsChange={(columns) => updateSecondaryMenuItem('displayColumns', columns)}
        />
      </div>
      <div className={cssModule.itemMargin}>
        <ZManagementConsoleTabFilter
          title={localizedContent.defaultFilter}
          tableName={currentSecondaryMenuItem.dataSource.table}
          filters={_.cloneDeep(currentSecondaryMenuItem.filters)}
          onFilterChange={(newChecks) => updateSecondaryMenuItem('filters', newChecks)}
        />
      </div>
      <div className={cssModule.itemMargin}>
        <ZManagementConsoleSelectAction
          title={localizedContent.actionSelection}
          actions={currentSecondaryMenuItem.actions}
          onSelectChange={(action) => updateSecondaryMenuItem('actions', action)}
        />
      </div>
    </div>
  );
});
