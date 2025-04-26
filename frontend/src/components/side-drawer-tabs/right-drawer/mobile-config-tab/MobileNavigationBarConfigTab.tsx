/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
import _ from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useColorBinding from '../../../../hooks/useColorBinding';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import { UploadType, UploadFile } from '../shared/UploadFile';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './MobileNavigationBarConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import ConfigTab from './ConfigTab';
import MobileNavigationBarModel from '../../../../models/mobile-components/MobileNavigationBarModel';
import ColorPicker from '../shared/ColorPicker';
import { MobileNavigationButtonConfig } from '../../../mobile-components/ZMobileNavigationBar';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import { Collapse, Row, Switch } from '../../../../zui';
import cssModule from './MobileNavigationBarConfigTab.module.scss';

const MobileNavigationBarStyleConfigTab = observer((props: { model: MobileNavigationBarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const cb = useColorBinding();
  const { model } = props;

  const { dataAttributes } = model;
  const backgroundColor = cb(dataAttributes.backgroundColor);
  const titleColor = cb(dataAttributes.titleColor);

  const leftButtonList = _.cloneDeep(dataAttributes.leftButtonList);
  const rightButtonList = _.cloneDeep(dataAttributes.rightButtonList);

  const renderButtonConfigComponent = (params: {
    buttonList: MobileNavigationButtonConfig[];
    buttonConfig: MobileNavigationButtonConfig;
    title: string;
    index: number;
    onButtonListChange: (buttonList: MobileNavigationButtonConfig[]) => void;
  }) => {
    const { buttonList, buttonConfig, index, title, onButtonListChange } = params;
    return {
      title,
      content: (
        <>
          <Row justify="space-between" align="middle" style={styles.fixedRow}>
            <ZConfigRowTitle text={content.buttonConfig.isHidden} />
            <Switch
              key={`${buttonConfig.isHidden}`}
              defaultChecked={buttonConfig.isHidden}
              onChange={(checked) => {
                const list = buttonList.map((btnCfg, btnIdx) => {
                  if (btnIdx === index) btnCfg.isHidden = checked;
                  return btnCfg;
                });
                onButtonListChange(list);
              }}
            />
          </Row>
          <Row justify="space-between" align="middle" style={styles.fixedRow}>
            <ZConfigRowTitle text={content.buttonConfig.uploadIcon} />
            <div style={{ width: '100px' }}>
              <UploadFile
                key={buttonConfig.imageExId}
                uploadType={UploadType.IMAGE}
                fileExId={buttonConfig.imageExId}
                uploadFileResult={(result) => {
                  const list = buttonList.map((btnCfg, btnIdx) => {
                    if (btnIdx === index) btnCfg.imageExId = result.exId;
                    return btnCfg;
                  });
                  onButtonListChange(list);
                }}
              />
            </div>
          </Row>
        </>
      ),
    };
  };

  return (
    <div>
      <ZConfigRowTitle text="color" />
      <ColorPicker
        style={styles.colorSelect}
        color={backgroundColor}
        name={content.label.backgroundColor}
        onChange={(color) =>
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color))
        }
      />
      <ColorPicker
        style={styles.colorSelect}
        color={titleColor}
        name={content.label.titleColor}
        onChange={(color) =>
          model.onUpdateDataAttributes('titleColor', DataBinding.withColor(color))
        }
      />
      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        className={cssModule.collapse}
        items={[
          ...leftButtonList.map((buttonConfig, index) =>
            renderButtonConfigComponent({
              buttonList: leftButtonList,
              buttonConfig,
              title: `${content.label.leftButton} → ${index + 1}`,
              index,
              onButtonListChange: (buttonList) => {
                model.onUpdateDataAttributes('leftButtonList', buttonList);
              },
            })
          ),
          ...rightButtonList.map((buttonConfig, index) =>
            renderButtonConfigComponent({
              buttonList: rightButtonList,
              buttonConfig,
              title: `${content.label.rightButton} → ${index + 1}`,
              index,
              onButtonListChange: (buttonList) => {
                model.onUpdateDataAttributes('rightButtonList', buttonList);
              },
            })
          ),
        ]}
      />
    </div>
  );
});

const MobileNavigationBarActionConfigTab = observer(
  (props: { model: MobileNavigationBarModel }) => {
    const { localizedContent: content } = useLocale(i18n);
    const { model } = props;
    const { dataAttributes } = model;

    const leftButtonList = _.cloneDeep(dataAttributes.leftButtonList);
    const rightButtonList = _.cloneDeep(dataAttributes.rightButtonList);

    const renderButtonConfigComponent = (params: {
      buttonList: MobileNavigationButtonConfig[];
      buttonConfig: MobileNavigationButtonConfig;
      title: string;
      index: number;
      onButtonListChange: (buttonList: MobileNavigationButtonConfig[]) => void;
    }) => {
      const { buttonList, buttonConfig, index, title, onButtonListChange } = params;
      return {
        title,
        content: (
          <>
            <ZConfigRowTitle text={content.buttonConfig.clickActions} />
            <ClickActionConfigRow
              componentModel={model}
              eventList={buttonConfig.clickActions}
              eventListOnChange={(clickActions) => {
                const list = buttonList.map((btnCfg, btnIdx) => {
                  if (btnIdx === index) btnCfg.clickActions = clickActions;
                  return btnCfg;
                });
                onButtonListChange(list);
              }}
            />
          </>
        ),
      };
    };
    return (
      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        className={cssModule.collapse}
        items={[
          ...leftButtonList.map((buttonConfig, index) =>
            renderButtonConfigComponent({
              buttonList: leftButtonList,
              buttonConfig,
              title: `${content.label.leftButton} → ${index + 1}`,
              index,
              onButtonListChange: (buttonList) => {
                model.onUpdateDataAttributes('leftButtonList', buttonList);
              },
            })
          ),
          ...rightButtonList.map((buttonConfig, index) =>
            renderButtonConfigComponent({
              buttonList: rightButtonList,
              buttonConfig,
              title: `${content.label.rightButton} → ${index + 1}`,
              index,
              onButtonListChange: (buttonList) => {
                model.onUpdateDataAttributes('rightButtonList', buttonList);
              },
            })
          ),
        ]}
      />
    );
  }
);

const MobileNavigationBarDataConfigTab = observer((props: { model: MobileNavigationBarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const { dataAttributes } = model;
  const { title } = dataAttributes;
  return (
    <>
      <DataBindingConfigRow
        key={model.mRef}
        title={content.label.title}
        componentModel={model}
        dataBinding={title}
        onChange={(value) => model.onUpdateDataAttributes('title', value)}
      />
    </>
  );
});

export default observer(function MobileNavigationBarConfigTav(
  props: MRefProp
): NullableReactElement {
  const model = useModel<MobileNavigationBarModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={MobileNavigationBarActionConfigTab}
      DataConfigTab={MobileNavigationBarDataConfigTab}
      StyleConfigTab={MobileNavigationBarStyleConfigTab}
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
    marginBottom: '15px',
  },
  iconSelect: {
    width: '100%',
    fontSize: '16px',
    background: '#eee',
    textAlign: 'center',
  },
};
