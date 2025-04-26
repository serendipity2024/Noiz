/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import {
  ConfigureCameraHandleBinding,
  CameraPosition,
  CameraFlash,
} from '../../../../shared/type-definition/EventBinding';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import i18n from '../mobile-config-tab/CameraViewConfigTab.i18n.json';
import i18nTarget from './CountdownActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { Select } from '../../../../zui';

import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import StoreHelpers from '../../../../mobx/StoreHelpers';

interface Props {
  componentModel: BaseComponentModel;
  event: ConfigureCameraHandleBinding;
  onEventChange: () => void;
}

export default observer(function ConfigureCameraActionRow(props: Props) {
  const { componentModel, event, onEventChange } = props;
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: contentTarget } = useLocale(i18nTarget);

  const screen = StoreHelpers.fetchRootModel(componentModel);
  const targets = screen
    ? StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model) => model.type === ComponentModelType.CAMERA_VIEW,
      })
    : [];

  return (
    <>
      <ZConfigRowTitle text={contentTarget.label.target} />
      <Select
        value={event.targetMRef}
        onChange={(value) => {
          event.targetMRef = value;
          onEventChange();
        }}
        style={styles.fullWidth}
        allowClear
      >
        {targets.map((value) => (
          <Select.Option key={value.mRef} value={value.mRef}>
            {value.componentName}
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={content.label.devicePosition} />
      <Select
        value={event.devicePosition}
        onChange={(value) => {
          event.devicePosition = value;
          onEventChange();
        }}
        style={styles.fullWidth}
        allowClear
      >
        {Object.values(CameraPosition).map((value) => (
          <Select.Option key={value} value={value}>
            {content.devicePosition[value]}
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={content.label.flash} />
      <Select
        value={event.flash}
        onChange={(value) => {
          event.flash = value;
          onEventChange();
        }}
        style={styles.fullWidth}
        allowClear
      >
        {Object.values(CameraFlash).map((value) => (
          <Select.Option key={value} value={value}>
            {content.flash[value]}
          </Select.Option>
        ))}
      </Select>
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  fullWidth: {
    width: '100%',
  },
};
