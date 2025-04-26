import { observer } from 'mobx-react';
import React, { ReactElement, useState } from 'react';
import _ from 'lodash';
import useDataModelMetadata from '../../hooks/useDataModelMetadata';
import useLocale from '../../hooks/useLocale';
import ComponentModelBuilder from '../../models/ComponentModelBuilder';
import ComponentModelType from '../../shared/type-definition/ComponentModelType';
import ClickActionConfigRow, {
  getDefaultDisabledClickActionList,
  getWithDefaultActions,
} from '../side-drawer-tabs/right-drawer/config-row/ClickActionConfigRow';
import { PageDataConfigRow } from '../side-drawer-tabs/right-drawer/config-row/PageDataConfigRow';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import i18n from './ZAppGlobalSetting.i18n.json';
import AppLifeCycleNormal from '../../shared/assets/editor/app-life-cycle-normal.svg';
import AppLifeCycleHover from '../../shared/assets/editor/app-life-cycle-hover.svg';
import { useConfiguration } from '../../hooks/useConfiguration';
import ZHoverableIcon from './ZHoverableIcon';
import { Modal, Row, Switch } from '../../zui';
import { TabBarStyleConfigTab } from '../side-drawer-tabs/right-drawer/mobile-config-tab/TabBarConfigTab';
import { DefaultTabBarSetting, internalTabBarItemScreenMRef } from '../mobile-components/ZTabBar';
import { TabBarSetting } from '../../mobx/stores/CoreStoreDataType';
import { useMutations } from '../../hooks/useMutations';
import useStores from '../../hooks/useStores';

export const ZAppGlobalSetting = observer((): ReactElement => {
  const { coreStore } = useStores();
  const { dataModelRegistry } = useDataModelMetadata();
  const { localizedContent } = useLocale(i18n);
  const [modelVisible, setModelVisible] = useState<boolean>(false);
  const { appConfigMutators } = useMutations();
  const configuration = useConfiguration();

  const tempComponentModel = ComponentModelBuilder.buildByType(
    '',
    ComponentModelType.BLANK_CONTAINER
  );

  function onTabBarChange(open: boolean) {
    const value: TabBarSetting | undefined = open ? DefaultTabBarSetting : undefined;
    if (
      value &&
      !![...coreStore.wechatRootMRefs, ...coreStore.mobileWebRootMRefs].find(
        (mRef) => configuration.initialScreenMRef === mRef
      )
    ) {
      value.items[0] = internalTabBarItemScreenMRef(
        value.items[0],
        configuration.initialScreenMRef
      );
    }
    appConfigMutators.setProperty('tabBarSetting', value);
  }

  return (
    <>
      <div>
        <ZHoverableIcon
          key={localizedContent.label.globalData}
          isSelected={modelVisible}
          containerStyle={styles.iconContainer}
          iconStyle={styles.icon}
          src={AppLifeCycleNormal}
          selectedSrc={AppLifeCycleHover}
          hoveredSrc={AppLifeCycleHover}
          toolTip={localizedContent.label.tooltip}
          toolTipPlacement="bottom"
          onClick={() => {
            setModelVisible(true);
          }}
        />
      </div>
      <Modal
        title={localizedContent.label.globalSetting}
        centered
        destroyOnClose
        visible={modelVisible}
        footer={null}
        onCancel={() => setModelVisible(false)}
      >
        <div>
          <div style={styles.fixedRow}>
            <Row justify="space-between" align="middle">
              <ZConfigRowTitle text={localizedContent.label.tabBar} />
              <Switch
                checked={!!configuration.tabBarSetting}
                onChange={(checked) => onTabBarChange(checked)}
              />
            </Row>
            {configuration.tabBarSetting && (
              <TabBarStyleConfigTab
                onTabBarChange={(value) => {
                  appConfigMutators.setProperty('tabBarSetting', value);
                }}
              />
            )}
          </div>
          <ZConfigRowTitle text={localizedContent.label.globalData} />
          <PageDataConfigRow
            variableTable={configuration.globalVariableTable}
            dataModelRegistry={dataModelRegistry}
            noDataTitle={localizedContent.label.noGlobalData}
            addDataTitle={localizedContent.label.addGlobalData}
            isGlobalDta
            savePageData={(pageData) => {
              appConfigMutators.setProperty(
                'globalVariableTable',
                Object.fromEntries(pageData.map((element) => [element.name, element.data]))
              );
            }}
          />
          <ZConfigRowTitle text={localizedContent.label.appDidLoad} />
          <ClickActionConfigRow
            componentModel={tempComponentModel}
            eventList={_.cloneDeep(configuration.appDidLoad)}
            eventListOnChange={(value) => {
              appConfigMutators.setProperty('appDidLoad', value);
            }}
            enabledActions={getWithDefaultActions(getDefaultDisabledClickActionList())}
          />
        </div>
      </Modal>
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 3,
  },
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  fixedRow: {
    marginBottom: '24px',
  },
};
