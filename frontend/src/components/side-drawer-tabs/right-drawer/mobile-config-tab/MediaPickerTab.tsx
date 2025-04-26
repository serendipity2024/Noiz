/* eslint-disable import/no-default-export */
import React from 'react';
import { observer } from 'mobx-react';
import { cloneDeep } from 'lodash';
import useModel from '../../../../hooks/useModel';
import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import ImageSourceConfigRow, { ImageSourceAttributes } from '../config-row/ImageSourceConfigRow';
import VideoSourceConfigRow, { VideoSourceAttributes } from '../config-row/VideoSourceConfigRow';
import ImagePickerModel from '../../../../models/mobile-components/ImagePickerModel';
import VideoPickerModel from '../../../../models/mobile-components/VideoPickerModel';
import ConfigTab from './ConfigTab';
import { VideoPickerAttributes } from '../../../mobile-components/ZVideoPicker';
import SwitchRow from '../shared/SwitchRow';
import { ImagePickerAttributes } from '../../../mobile-components/ZImagePicker';
import i18n from './MediaPickerTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import ClickActionConfigRow, {
  getDefaultDisabledClickActionList,
  getWithDefaultActions,
} from '../config-row/ClickActionConfigRow';

const MediaPickerStyleConfigTab = observer(
  (props: { model: ImagePickerModel | VideoPickerModel }) => {
    const { model } = props;
    const { localizedContent: content } = useLocale(i18n);
    const dataAttributes = model.dataAttributes as ImagePickerAttributes & VideoPickerAttributes;
    return (
      <>
        <SwitchRow
          title={content.label.disablePreview}
          componentModel={model}
          dataAttribute={dataAttributes}
          field="disablePreview"
        />
        <CombinedStyleConfigRow data={model} />
      </>
    );
  }
);

const MediaPickerDataConfigTab = observer(
  (props: { model: ImagePickerModel | VideoPickerModel }) => {
    const { model } = props;
    const { localizedContent: content } = useLocale(i18n);
    const dataAttributes = model.dataAttributes as ImagePickerAttributes & VideoPickerAttributes;
    return (
      <>
        <SwitchRow
          title={content.label.uploadLoadingEnabled}
          componentModel={model}
          dataAttribute={dataAttributes}
          field="uploadLoadingEnabled"
        />
        {model.type === ComponentModelType.IMAGE_PICKER ? (
          <>
            <SwitchRow
              title={content.label.original}
              componentModel={model}
              dataAttribute={dataAttributes}
              field="original"
            />
            <ImageSourceConfigRow
              model={model}
              belongsToDataAttribute
              imageSourceDataAttributes={model.dataAttributes as ImageSourceAttributes}
            />
          </>
        ) : null}
        {model.type === ComponentModelType.VIDEO_PICKER ? (
          <VideoSourceConfigRow
            model={model}
            videoSourceDataAttributes={model.dataAttributes as VideoSourceAttributes}
          />
        ) : null}
      </>
    );
  }
);

const MediaPickerActionConfigTab = observer(
  (props: { model: ImagePickerModel | VideoPickerModel }) => {
    const { model } = props;
    const { localizedContent: content } = useLocale(i18n);
    const dataAttributes = model.dataAttributes as ImagePickerAttributes & VideoPickerAttributes;
    const onSuccessActions = cloneDeep(dataAttributes.onSuccessActions);
    return (
      <>
        <ZConfigRowTitle text={content.label.onSuccessActions} />
        <ClickActionConfigRow
          componentModel={model}
          enabledActions={getWithDefaultActions(getDefaultDisabledClickActionList())}
          eventList={onSuccessActions}
          eventListOnChange={(value) => model.onUpdateDataAttributes('onSuccessActions', value)}
        />
      </>
    );
  }
);

export default function MediaPickerTab(props: MRefProp): NullableReactElement {
  const model = useModel<ImagePickerModel | VideoPickerModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={MediaPickerActionConfigTab}
      DataConfigTab={MediaPickerDataConfigTab}
      StyleConfigTab={MediaPickerStyleConfigTab}
    />
  );
}
