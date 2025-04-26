/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import VideoModel from '../../../../models/mobile-components/VideoModel';
import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import { EventBinding, VideoHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { ZThemedColors } from '../../../../utils/ZConst';
import i18n from './VideoActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function VideoActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const videoHandleBinding = props.event as VideoHandleBinding;
  const screen = StoreHelpers.fetchRootModel(props.componentModel);
  let videoModels: VideoModel[] = [];
  if (screen) {
    videoModels = StoreHelpers.findAllModelsWithLogicInContainer({
      container: screen,
      filter: (model) => model.type === ComponentModelType.VIDEO,
    }) as VideoModel[];
  }
  return (
    <Select
      bordered={false}
      dropdownMatchSelectWidth={false}
      key={videoHandleBinding.target}
      defaultValue={videoHandleBinding.target}
      placeholder={content.placeholder}
      size="large"
      style={styles.videoSelect}
      onChange={(value) => {
        videoHandleBinding.target = value;
        props.onEventChange();
      }}
    >
      {videoModels.map((item: VideoModel) => (
        <Select.Option key={item.mRef} value={item.mRef}>
          {item.componentName}
        </Select.Option>
      ))}
    </Select>
  );
});

const styles: Record<string, React.CSSProperties> = {
  videoSelect: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
};
