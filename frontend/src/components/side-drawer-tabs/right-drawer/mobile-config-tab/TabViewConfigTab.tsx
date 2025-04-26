/* eslint-disable import/no-default-export */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import uniqid from 'uniqid';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import FrameDiff from '../../../../diffs/FrameDiff';
import useModel from '../../../../hooks/useModel';
import useStores from '../../../../hooks/useStores';
import BaseMobileComponentModel from '../../../../models/base/BaseMobileComponentModel';
import ComponentModelBuilder from '../../../../models/ComponentModelBuilder';
import TabViewModel from '../../../../models/mobile-components/TabViewModel';
import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import { DataBinding, DataBindingKind } from '../../../../shared/type-definition/DataBinding';
import { BaseType, IntegerType } from '../../../../shared/type-definition/DataModel';
import { DiffItem } from '../../../../shared/type-definition/Diff';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { BlankContainerAttributes } from '../../../mobile-components/ZBlankContainer';
import { TabViewAttributes, TabViewMode } from '../../../mobile-components/ZTabView';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './TabViewConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import ConfigTab from './ConfigTab';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { Button, Input, Row, Select, Empty } from '../../../../zui';

const TabViewStyleConfigTab = observer((props: { model: TabViewModel }) => {
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as TabViewAttributes;

  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={dataAttributes.backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
    </>
  );
});

const TabViewDataConfigTab = observer((props: { model: TabViewModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { diffStore, coreStore } = useStores();
  const { model } = props;
  const dataAttributes = model.dataAttributes as TabViewAttributes;
  const tabList = cloneDeep(dataAttributes.tabList);

  const addNewTabItem = () => {
    const containerModel = ComponentModelBuilder.buildByType(
      model.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BaseMobileComponentModel;
    containerModel.setComponentFrame(model.getComponentFrame());
    const newTabList = [
      ...dataAttributes.tabList,
      {
        title: DataBinding.withTextVariable([
          { kind: DataBindingKind.LITERAL, value: `${uniqid.process()}` },
        ]),
        mRef: containerModel.mRef,
      },
    ];
    let diffItems = buildUpdateCustomTabFrameDiffs(newTabList.length);
    diffItems.push(
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'tabList',
        newValue: newTabList,
      })
    );
    diffItems = diffItems.concat([
      ComponentDiff.buildAddComponentDiff(containerModel),
      ComponentDiff.buildAddChildMRefsDiff(model.mRef, [containerModel.mRef]),
    ]);
    diffStore.applyDiff(diffItems);
  };

  const deleteTabItem = (itemMRef: string) => {
    const newTabList = dataAttributes.tabList.filter((tabItem) => tabItem.mRef !== itemMRef);
    let diffItems = buildUpdateCustomTabFrameDiffs(newTabList.length);
    diffItems.push(
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'tabList',
        newValue: newTabList,
      })
    );
    if (model.tabSelectedIndex === 0) {
      diffItems.push(
        ComponentDiff.buildUpdateDataAttributesDiff({
          model,
          valueKey: 'selectedIndex',
          newValue: DataBinding.withLiteral(0, IntegerType.INTEGER),
        })
      );
    }
    const itemModel = coreStore.getModel(itemMRef);
    if (!itemModel) throw new Error(`tab item error, ${JSON.stringify(model)}`);

    diffItems = diffItems.concat([
      ...ComponentDiff.buildDeleteComponentDiffs(itemModel),
      ComponentDiff.buildDeleteChildMRefsDiff(model.mRef, [itemMRef]),
    ]);
    diffStore.applyDiff(diffItems);
  };

  const buildUpdateCustomTabFrameDiffs = (tabLength: number): DiffItem[] => {
    const normalTabModel = coreStore.getModel(dataAttributes.normalTabMRef);
    const selectedTabModel = coreStore.getModel(dataAttributes.selectedTabMRef);
    if (normalTabModel && selectedTabModel) {
      const tabWidth = Math.floor((model.getComponentFrame().size.width ?? 0) / tabLength);
      return [
        ...FrameDiff.buildUpdateComponentFrameDiffs(normalTabModel, {
          ...normalTabModel.getComponentFrame(),
          size: {
            ...normalTabModel.getComponentFrame().size,
            width: tabWidth,
          },
        }),
        ...FrameDiff.buildUpdateComponentFrameDiffs(selectedTabModel, {
          ...selectedTabModel.getComponentFrame(),
          size: {
            ...selectedTabModel.getComponentFrame().size,
            width: tabWidth,
          },
        }),
      ];
    }
    return [];
  };

  const openCustomTabMode = (): DiffItem[] => {
    const normalModel = ComponentModelBuilder.buildByType(
      model.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BaseMobileComponentModel;
    normalModel.setComponentFrame({
      position: { x: 0, y: 0 },
      size: { width: model.tabWidth, height: dataAttributes.tabHeight },
    });
    (normalModel.dataAttributes as BlankContainerAttributes).backgroundColor =
      DataBinding.withColor('white');

    const selectModel = ComponentModelBuilder.buildByType(
      model.mRef,
      ComponentModelType.BLANK_CONTAINER
    ) as BaseMobileComponentModel;
    selectModel.setComponentFrame({
      position: { x: 0, y: 0 },
      size: { width: model.tabWidth, height: dataAttributes.tabHeight },
    });
    (selectModel.dataAttributes as BlankContainerAttributes).backgroundColor =
      DataBinding.withColor('gray');
    return [
      ComponentDiff.buildAddComponentDiff(normalModel),
      ComponentDiff.buildAddComponentDiff(selectModel),
      ComponentDiff.buildAddChildMRefsDiff(model.mRef, [normalModel.mRef, selectModel.mRef]),
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'normalTabMRef',
        newValue: normalModel.mRef,
      }),
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'selectedTabMRef',
        newValue: selectModel.mRef,
      }),
    ];
  };

  const closeCustomTabMode = (): DiffItem[] => {
    const normalTabModel = coreStore.getModel(dataAttributes.normalTabMRef);
    const selectedTabModel = coreStore.getModel(dataAttributes.selectedTabMRef);
    if (!normalTabModel || !selectedTabModel)
      throw new Error(`custom tab error, ${JSON.stringify(model)}`);
    return [
      ...ComponentDiff.buildDeleteComponentDiffs(normalTabModel),
      ...ComponentDiff.buildDeleteComponentDiffs(selectedTabModel),
      ComponentDiff.buildDeleteChildMRefsDiff(model.mRef, [
        dataAttributes.normalTabMRef,
        dataAttributes.selectedTabMRef,
      ]),
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'normalTabMRef',
        newValue: '',
      }),
      ComponentDiff.buildUpdateDataAttributesDiff({
        model,
        valueKey: 'selectedTabMRef',
        newValue: '',
      }),
    ];
  };

  return (
    <>
      <ZConfigRowTitle text={content.label.mode} />
      <Select
        bordered={false}
        value={dataAttributes.mode}
        size="large"
        style={styles.iconSelect}
        onChange={(value) => {
          model.localVariableTable = {
            item: {
              type: BaseType.TEXT,
            },
            index: {
              type: IntegerType.INTEGER,
            },
          };
          const diffItems =
            value === TabViewMode.CUSTOM ? openCustomTabMode() : closeCustomTabMode();
          diffStore.applyDiff([
            ...diffItems,
            ComponentDiff.buildUpdateDataAttributesDiff({
              model,
              valueKey: 'mode',
              newValue: value,
            }),
          ]);
        }}
      >
        {Object.entries(TabViewMode).map(([key, value]) => (
          <Select.Option key={key} value={value}>
            <label>{content.mode[value] ?? value}</label>
          </Select.Option>
        ))}
      </Select>
      <DataBindingConfigRow
        key={dataAttributes.selectedIndex.effectiveValue ?? 0}
        title={content.label.selectedIndex}
        componentModel={model}
        dataBinding={dataAttributes.selectedIndex}
        onChange={(value) => {
          model.onUpdateDataAttributes('selectedIndex', value);
        }}
      />
      <ZConfigRowTitle text={content.label.tabs} />
      {tabList.map((tabItem, index) => {
        const title = tabItem.title.effectiveValue;
        const canDelete = index >= 2;
        const inputWidth = canDelete ? '85%' : '100%';
        return (
          <Row
            key={tabItem.mRef}
            align="middle"
            justify="space-between"
            style={styles.itemContainer}
          >
            <Input
              style={{ width: inputWidth, ...styles.input }}
              value={title}
              placeholder={`Tab ${index + 1}`}
              onChange={(e) => {
                const newTabList = tabList.map((eTabItem) => {
                  if (tabItem.mRef === eTabItem.mRef) {
                    eTabItem.title = DataBinding.withLiteral(e.target.value);
                  }
                  return eTabItem;
                });
                model.onUpdateDataAttributes('tabList', newTabList);
              }}
            />
            {canDelete ? (
              <DeleteOutlined style={styles.menuItem} onClick={() => deleteTabItem(tabItem.mRef)} />
            ) : null}
          </Row>
        );
      })}
      <Button style={{ ...styles.addButton }} icon={<PlusOutlined />} onClick={addNewTabItem}>
        {content.label.addTab}
      </Button>
    </>
  );
});

export default observer(function TabViewConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<TabViewModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={TabViewDataConfigTab}
      StyleConfigTab={TabViewStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  itemContainer: {
    textAlign: 'center',
    marginBottom: '15px',
  },
  addButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
    backgroundColor: 'transparent',
    color: ZThemedColors.ACCENT,
  },
  menuItem: {
    fontSize: '20px',
    color: 'white',
    padding: '5px',
  },
  iconSelect: {
    width: '100%',
    fontSize: '14px',
    background: ZThemedColors.SECONDARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  input: {
    color: ZColors.WHITE,
    background: ZThemedColors.SECONDARY,
    borderRadius: '6px',
    border: '0px',
  },
};
