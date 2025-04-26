/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  AudioHandleBinding,
  EventBinding,
  MediaAction,
} from '../../../../shared/type-definition/EventBinding';
import { ZColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './AudioActionRow.i18n.json';
import { Row, Switch } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function AudioActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const audioHandleBinding = props.event as AudioHandleBinding;
  return (
    <>
      {audioHandleBinding.action === MediaAction.PLAY ? (
        <Row justify="space-between" align="middle">
          <label style={styles.loopTitle}>{content.label.loop}</label>
          <Switch
            key={`${audioHandleBinding.loop}`}
            defaultChecked={audioHandleBinding.loop ?? false}
            onChange={(checked) => {
              audioHandleBinding.loop = checked;
              props.onEventChange();
            }}
          />
        </Row>
      ) : null}
      <DataBindingConfigRow
        title={content.label.source}
        componentModel={props.componentModel}
        dataBinding={audioHandleBinding.src}
        onChange={(value) => {
          audioHandleBinding.src = value;
          props.onEventChange();
        }}
      />
    </>
  );
});
const styles: Record<string, React.CSSProperties> = {
  loopTitle: {
    color: ZColors.WHITE,
    opacity: '0.5',
  },
};
