import React, { ReactElement, useState } from 'react';
import cx from 'classnames';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import useStores from '../../hooks/useStores';
import { PrimaryMenuItem, SecondaryMenuItem } from '../../shared/type-definition/ManagementConsole';
import { ZManagementConsoleTabConfigRow } from './ZManagementConsoleTabConfigRow';
import { ZRadioGroup } from './ZRadioGroup';
import cssModule from './ZManagementConsoleTabs.module.scss';
import { useMutations } from '../../hooks/useMutations';
import i18n from './ZManagementConsoleTabs.i18n.json';
import useLocale from '../../hooks/useLocale';
import { Collapse, Row, ZInput } from '../../zui';

export const ZManagementConsoleTabs = observer((): ReactElement => {
  const { localizedContent } = useLocale(i18n);
  const { coreStore } = useStores();
  const { managementConsoleMutation } = useMutations();
  const { menuItems } = coreStore.mcConfiguration;

  const [activeIndex, setActiveIndex] = useState(0);
  const [editNameModalVisible, setEditNameModalVisible] = useState<boolean>(false);
  const [currentPrimaryMenuItem, setCurrentPrimaryMenuItem] = useState<PrimaryMenuItem | undefined>(
    menuItems[0]
  );
  const [currentSecondaryMenuItem, setCurrentSecondaryMenuItem] = useState<
    SecondaryMenuItem | undefined
  >(currentPrimaryMenuItem?.subItems[0]);

  function deleteSecondaryMenuItem(item: PrimaryMenuItem) {
    if (!currentSecondaryMenuItem) return;
    managementConsoleMutation.deleteSecondaryMenuItem(currentSecondaryMenuItem, item);
    setCurrentSecondaryMenuItem(item.subItems[0]);
  }

  // TODO: 待配置详细信息时再细分mutation func
  function updateSecondaryMenuItem(item: PrimaryMenuItem, displayName: string) {
    if (!currentSecondaryMenuItem) return;
    const newSecondaryMenuItem: SecondaryMenuItem = {
      ...currentSecondaryMenuItem,
      displayName,
    };
    managementConsoleMutation.updateSecondaryMenuItem(newSecondaryMenuItem, item, menuItems);
    setEditNameModalVisible(false);
    setCurrentSecondaryMenuItem(newSecondaryMenuItem);
  }

  return (
    <Row className={cssModule.container} justify="start" align="top">
      <div className={cssModule.leftContanier}>
        <Collapse
          size="large"
          noBackground
          noHeaderHighlight
          noContentPadding
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          items={menuItems.map((item, idx) => ({
            title: item.displayName,
            icon: (
              <PlusOutlined
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(idx);
                  managementConsoleMutation.addSecondaryMenuItem(item, menuItems);
                }}
              />
            ),
            content: (
              <ZRadioGroup
                selectedValue={currentSecondaryMenuItem}
                dataSource={item.subItems}
                itemRender={(data, index, selected) => (
                  <>
                    {!selected ? (
                      <Row
                        className={cx(cssModule.radioItem, cssModule.normalItem)}
                        justify="space-between"
                        align="middle"
                      >
                        <div className={cssModule.itemContent}>{data.displayName}</div>
                      </Row>
                    ) : (
                      <>
                        {!editNameModalVisible ? (
                          <Row
                            className={cx(cssModule.radioItem, cssModule.selectedItem)}
                            justify="space-between"
                            align="middle"
                          >
                            <div className={cssModule.itemContent}>{data.displayName}</div>
                            {index > 0 && (
                              <>
                                <EditOutlined
                                  className={cssModule.icon}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    setEditNameModalVisible(true);
                                  }}
                                />
                                <DeleteOutlined
                                  className={cssModule.icon}
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    deleteSecondaryMenuItem(item);
                                  }}
                                />
                              </>
                            )}
                          </Row>
                        ) : (
                          <Row
                            className={cx(cssModule.radioItem, cssModule.editItem)}
                            justify="space-between"
                            align="middle"
                          >
                            <ZInput
                              onBlur={(e) => {
                                updateSecondaryMenuItem(item, e.target.value);
                              }}
                              placeholder={localizedContent.selectPlaceholder}
                              key={currentSecondaryMenuItem?.displayName}
                              defaultValue={currentSecondaryMenuItem?.displayName}
                              onPressEnter={(e) => {
                                updateSecondaryMenuItem(item, e.currentTarget.value);
                              }}
                              autoFocus
                            />
                          </Row>
                        )}
                      </>
                    )}
                  </>
                )}
                onSelected={(data) => {
                  setCurrentSecondaryMenuItem(data);
                  setCurrentPrimaryMenuItem(item);
                }}
              />
            ),
          }))}
        />
      </div>
      {currentSecondaryMenuItem && currentPrimaryMenuItem && (
        <div className={cssModule.detail}>
          <ZManagementConsoleTabConfigRow
            secondaryMenuItem={currentSecondaryMenuItem}
            primaryMenuItem={currentPrimaryMenuItem}
            menuItems={menuItems}
          />
        </div>
      )}
    </Row>
  );
});
