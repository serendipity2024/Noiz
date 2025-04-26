import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { useMutations } from '../../hooks/useMutations';
import { ObjectViewConfig } from '../../shared/type-definition/ManagementConsole';
import cssModule from './ZManagementConsoleObjectConfigRow.module.scss';
import i18n from './ZManagementConsoleObjectConfigRow.i18n.json';
import useLocale from '../../hooks/useLocale';
import useStores from '../../hooks/useStores';
import { ZManagementConsoleColumnConfigRow } from './ZManagementConsoleColumnConfigRow';
import { ZManagementConsoleSelectAction } from './ZManagementConsoleSelectAction';

interface Props {
  object: ObjectViewConfig;
  dataModelObjects: ObjectViewConfig[];
}

export const ZManagementConsoleObjectConfigRow = observer((props: Props): ReactElement => {
  const { dataModelObjects } = props;
  const { localizedContent } = useLocale(i18n);
  const { managementConsoleMutation } = useMutations();
  const { coreStore } = useStores();

  const currentObject: ObjectViewConfig =
    coreStore.mcConfiguration.objects.find(
      (obj) => obj.objectType.table === props.object.objectType.table
    ) ?? props.object;

  function updateObjectConfig<T>(key: keyof ObjectViewConfig, newValue: T) {
    const newObjectConfig: ObjectViewConfig = {
      ...currentObject,
      [key]: newValue,
    };
    managementConsoleMutation.updateObjectView(newObjectConfig, dataModelObjects);
  }

  return (
    <div className={cssModule.container}>
      <div className={cssModule.itemMargin}>
        <div className={cssModule.title}>{localizedContent.detail}</div>
        <ZManagementConsoleColumnConfigRow
          tableName={currentObject.objectType.table}
          columns={currentObject.displayColumns}
          onColumnsChange={(columns) => updateObjectConfig('displayColumns', columns)}
        />
      </div>
      <ZManagementConsoleSelectAction
        title={localizedContent.actions}
        actions={currentObject.actions}
        onSelectChange={(actions) => updateObjectConfig('actions', actions)}
      />
    </div>
  );
});
