/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import React from 'react';
import _ from 'lodash';
import useScreenModels from '../../../../hooks/useScreenModels';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { HexColor } from '../../../../shared/type-definition/ZTypes';
import ColorPicker from '../shared/ColorPicker';
import { ConfigIcon, LocalIconName } from '../shared/ConfigIcon';
import UploadTabBarIcon from '../shared/UploadTabBarIcon';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './TabBarConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { Input, Select, Space, Collapse } from '../../../../zui';
import cssModule from './TabBarConfigTab.module.scss';
import { useConfiguration } from '../../../../hooks/useConfiguration';
import { TabBarItem, TabBarSetting } from '../../../../mobx/stores/CoreStoreDataType';
import { internalTabBarItemScreenMRef } from '../../../mobile-components/ZTabBar';

interface Props {
  onTabBarChange: (tabBarSetting: TabBarSetting) => void;
}

export const TabBarStyleConfigTab = observer((props: Props) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const screenModelList = useScreenModels();
  const tabBarSetting = _.cloneDeep(useConfiguration().tabBarSetting);
  if (!tabBarSetting) {
    throw new Error('tabBarSetting is null');
  }

  const shouldDisableScreenOption = (screenMRef: string): boolean =>
    StoreHelpers.screenContainsTabBar(screenMRef);

  const onSelected = (item: TabBarItem, screenMRef: string) => {
    tabBarSetting.items = tabBarSetting.items.map((element: TabBarItem) => {
      if (element.mRef === item.mRef) {
        element = internalTabBarItemScreenMRef(element, screenMRef);
      }
      return element;
    });
    updateAllTabBarModel();
  };

  const updateAllTabBarModel = () => {
    props.onTabBarChange(tabBarSetting);
  };

  const renderCollapseComponent = () => (
    <Collapse
      defaultOpenIndex={0}
      className={cssModule.collapse}
      bordered
      setContentFontColorToOrangeBecauseHistoryIsCruel
      items={[
        {
          title: content.label.tabBar,
          content: (
            <>
              <ColorPicker
                style={styles.colorSelect}
                color={tabBarSetting.backgroundColor}
                name={commonContent.label.backgroundColor}
                disableAlpha
                onChange={(color: HexColor) => {
                  tabBarSetting.backgroundColor = DataBinding.withColor(color);
                  updateAllTabBarModel();
                }}
              />
              <ColorPicker
                style={styles.colorSelect}
                color={tabBarSetting.color}
                name={commonContent.label.color}
                disableAlpha
                onChange={(color: HexColor) => {
                  tabBarSetting.color = DataBinding.withColor(color);
                  updateAllTabBarModel();
                }}
              />
              <ColorPicker
                style={styles.colorSelect}
                color={tabBarSetting.selectedColor}
                name={content.label.selectedColor}
                disableAlpha
                onChange={(color: HexColor) => {
                  tabBarSetting.selectedColor = DataBinding.withColor(color);
                  updateAllTabBarModel();
                }}
              />
            </>
          ),
        },
        ...tabBarSetting.items.map((item) => renderTabComponent(item)),
      ]}
    />
  );

  const renderTabComponent = (tabBarItem: TabBarItem) => ({
    title: (content.label as Record<string, any>)[tabBarItem.mRef] ?? tabBarItem.mRef,
    content: (
      <>
        <div>
          <ZConfigRowTitle text={content.tab.targetScreen} />
          <Select
            bordered={false}
            value={tabBarItem.screenMRef.effectiveValue}
            size="large"
            style={styles.screenSelect}
            onChange={(value) => onSelected(tabBarItem, value)}
          >
            <Select.Option value="" style={styles.optionContainer}>
              <label>{content.tab.none}</label>
            </Select.Option>
            {screenModelList.map((screen) => (
              <Select.Option
                disabled={shouldDisableScreenOption(screen.mRef)}
                key={screen.mRef}
                value={screen.mRef}
                style={styles.optionContainer}
              >
                <label>{screen.componentName}</label>
              </Select.Option>
            ))}
          </Select>
          <ZConfigRowTitle text={commonContent.label.text} />
          <Input
            value={tabBarItem.title.effectiveValue}
            style={styles.input}
            onChange={(e) => {
              tabBarSetting.items.forEach((item: TabBarItem) => {
                if (item.mRef === tabBarItem.mRef) {
                  item.title = DataBinding.withLiteral(e.target.value);
                }
              });
              updateAllTabBarModel();
            }}
          />

          {renderIconSelectComponent(content.tab.icon, tabBarItem.icon, (value) => {
            tabBarSetting.items.forEach((item: TabBarItem) => {
              if (item.mRef === tabBarItem.mRef) {
                item.icon = DataBinding.withLiteral(value);
              }
            });
            updateAllTabBarModel();
          })}

          {renderIconSelectComponent(content.tab.selectedIcon, tabBarItem.selectedIcon, (value) => {
            tabBarSetting.items.forEach((item: TabBarItem) => {
              if (item.mRef === tabBarItem.mRef) {
                item.selectedIcon = DataBinding.withLiteral(value);
              }
            });
            updateAllTabBarModel();
          })}
        </div>
      </>
    ),
  });

  const renderIconSelectComponent = (
    title: string,
    icon: DataBinding,
    onChange: (value: string) => void
  ) => {
    const options = Object.values(LocalIconName).includes(icon.effectiveValue)
      ? Object.values(LocalIconName)
      : [icon.effectiveValue].concat(Object.values(LocalIconName));
    return (
      <>
        <ZConfigRowTitle text={title} />
        <Space direction="vertical" style={styles.optionGroup}>
          <Select
            bordered={false}
            value={icon.effectiveValue}
            size="large"
            style={styles.iconSelect}
            onChange={onChange}
          >
            {options.map((item) => {
              return (
                <Select.Option key={item} value={item} style={styles.optionContainer}>
                  <ConfigIcon icon={item} />
                </Select.Option>
              );
            })}
          </Select>
          <UploadTabBarIcon onFileUploaded={onChange} />
        </Space>
      </>
    );
  };

  return <div>{renderCollapseComponent()}</div>;
});

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginTop: '15px',
  },
  screenSelect: {
    width: '100%',
    fontSize: '16px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    textAlign: 'center',
  },
  iconSelectContainer: {
    marginTop: '15px',
  },
  iconSelect: {
    display: 'block',
    fontSize: '16px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
  },
  iconSwitch: {
    background: ZThemedColors.SECONDARY,
    borderRadius: '6px',
  },
  optionContainer: {
    fontSize: '16px',
  },
  optionGroup: {
    display: 'flex',
  },
  input: {
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    border: '0px',
    height: '40px',
    color: ZColors.WHITE,
  },
};
