/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZColors } from '../../../../utils/ZConst';
import { MRefProp } from '../../../mobile-components/PropTypes';
import BorderStyleConfigRow from '../config-row/BorderStyleConfigRow';
import ChildComponentsConfigRow from '../config-row/ChildComponentsConfigRow';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './CommonConfigTab.i18n.json';
import BlankContainerModel from '../../../../models/mobile-components/BlankContainerModel';
import ConfigTab from './ConfigTab';
import { BlankContainerAttributes } from '../../../mobile-components/ZBlankContainer';
import { Empty, Collapse } from '../../../../zui';
import cssModule from './BlankContainerConfigTab.module.scss';

const BlankContainerStyleConfigTab = observer((props: { model: BlankContainerModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as BlankContainerAttributes;
  const bgColor = dataAttributes.backgroundColor;
  return (
    <>
      <ZConfigRowTitle text={content.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={bgColor}
        name={content.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <BorderStyleConfigRow data={model} />
      <Collapse
        className={cssModule.collapse}
        items={[
          {
            title: content.label.components,
            content: <ChildComponentsConfigRow mRef={model.mRef} />,
          },
        ]}
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
      />
    </>
  );
});

const BlankContainerActionConfigTab = observer((props: { model: BlankContainerModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const { dataAttributes } = model;
  const clickActions = cloneDeep(dataAttributes.clickActions);
  return (
    <>
      <ZConfigRowTitle text={content.label.clickActions} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={clickActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('clickActions', value)}
      />
    </>
  );
});

export default function BlankContainerConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<BlankContainerModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={BlankContainerActionConfigTab}
      DataConfigTab={() => <Empty description={false} />}
      StyleConfigTab={BlankContainerStyleConfigTab}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  collapse: {
    background: ZColors.WHITE,
    marginTop: '20px',
  },
  panel: {
    background: ZColors.GREY,
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
};
