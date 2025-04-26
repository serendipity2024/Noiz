/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  EventBinding,
  EventType,
  OpenRewardedVideoAdHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZThemedColors } from '../../../../utils/ZConst';
import ClickActionConfigRow, { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import ConfigInput from '../shared/ConfigInput';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './OpenRewardedVideoAdActionRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function OpenRewardedVideoAdActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const handleBinding = props.event as OpenRewardedVideoAdHandleBinding;

  return (
    <>
      <ZConfigRowTitle text={content.label.advertId} />
      <ConfigInput
        value={handleBinding.advertId}
        placeholder="please input advert id"
        style={styles.input}
        onSaveValue={(value) => {
          handleBinding.advertId = value;
          props.onEventChange();
        }}
      />
      <ZConfigRowTitle text={content.label.advertPlayEnded} />
      <ClickActionConfigRow
        componentModel={props.componentModel}
        enabledActions={getWithDefaultActions([
          {
            type: EventType.OPEN_REWARDED_VIDEO_AD,
            enabled: false,
          },
        ])}
        eventList={handleBinding.onCloseWithEndedActions}
        eventListOnChange={(eventList) => {
          handleBinding.onCloseWithEndedActions = eventList;
          props.onEventChange();
        }}
      />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  input: {
    background: ZThemedColors.PRIMARY,
  },
};
