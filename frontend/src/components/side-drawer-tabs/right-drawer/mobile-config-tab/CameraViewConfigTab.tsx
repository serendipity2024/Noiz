/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './CameraViewConfigTab.i18n.json';
import ConfigTab from './ConfigTab';
import CameraViewModel from '../../../../models/mobile-components/CameraViewModel';
import {
  CameraFlash,
  CameraPosition,
  CameraResolution,
  CameraFrameSize,
} from '../../../../shared/type-definition/EventBinding';
import { CameraViewAttributes } from '../../../mobile-components/ZCameraView';
import { Select, Empty } from '../../../../zui';

const CameraViewStyleConfigTab = observer((props: { model: CameraViewModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as CameraViewAttributes;
  const { devicePosition, flash, frameSize, resolution } = dataAttributes;

  return (
    <>
      <ZConfigRowTitle text={content.label.devicePosition} />
      <Select
        value={devicePosition}
        onChange={(value) => model.onUpdateDataAttributes('devicePosition', value)}
        style={styles.fullWidth}
      >
        {Object.values(CameraPosition).map((value) => (
          <Select.Option key={value} value={value}>
            {content.devicePosition[value]}
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={content.label.flash} />
      <Select
        value={flash}
        onChange={(value) => model.onUpdateDataAttributes('flash', value)}
        style={styles.fullWidth}
      >
        {Object.values(CameraFlash).map((value) => (
          <Select.Option key={value} value={value}>
            {content.flash[value]}
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={content.label.resolution} />
      <Select
        value={resolution}
        onChange={(value) => model.onUpdateDataAttributes('resolution', value)}
        style={styles.fullWidth}
      >
        {Object.values(CameraResolution).map((value) => (
          <Select.Option key={value} value={value}>
            {content.resolution[value]}
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={content.label.frameSize} />
      <Select
        value={frameSize}
        onChange={(value) => model.onUpdateDataAttributes('frameSize', value)}
        style={styles.fullWidth}
      >
        {Object.values(CameraFrameSize).map((value) => (
          <Select.Option key={value} value={value}>
            {content.frameSize[value]}
          </Select.Option>
        ))}
      </Select>
    </>
  );
});

export default function CameraViewConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<CameraViewModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={() => <Empty description={false} />}
      StyleConfigTab={CameraViewStyleConfigTab}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  fullWidth: {
    width: '100%',
  },
};
