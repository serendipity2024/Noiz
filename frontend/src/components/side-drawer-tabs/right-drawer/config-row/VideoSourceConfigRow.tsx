/* eslint-disable import/no-default-export */
/* eslint-disable default-case */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import useLocale from '../../../../hooks/useLocale';
import { AllStores } from '../../../../mobx/StoreContexts';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { IdentityType, MediaType } from '../../../../shared/type-definition/DataModel';
import { UploadType, UploadFile } from '../shared/UploadFile';
import VideoPreviewView from '../shared/VideoPreviewView';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import DataBindingConfigRow from './DataBindingConfigRow';
import i18n from './VideoSourceConfigRow.i18n.json';
import { Select } from '../../../../zui';

export enum VideoSource {
  UPLOAD = 'upload',
  VIDEO = 'video',
}

export const VideoSourceDefaultDataAttributes = {
  videoSource: VideoSource.UPLOAD,
  videoObject: DataBinding.withTextVariable(),
};

export type VideoSourceAttributes = typeof VideoSourceDefaultDataAttributes;

interface Props {
  model: BaseComponentModel;
  videoSourceDataAttributes: VideoSourceAttributes;
}

export default observer(function VideoSourceConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { model, videoSourceDataAttributes } = props;
  const { videoSource, videoObject } = videoSourceDataAttributes;

  function renderVideoSourceComponent() {
    switch (videoSource) {
      case VideoSource.UPLOAD: {
        const videoExId: string = videoObject.effectiveValue;
        return (
          <div style={styles.imageContainer}>
            <UploadFile
              uploadType={UploadType.VIDEO}
              fileExId={videoExId}
              uploadFileResult={(result) => {
                model.onUpdateDataAttributes(
                  'videoObject',
                  DataBinding.withLiteral(result.exId, IdentityType.EXID)
                );
              }}
            />
          </div>
        );
      }
      case VideoSource.VIDEO: {
        return (
          <DataBindingConfigRow
            title={content.source.video}
            componentModel={model}
            dataBinding={videoObject}
            onChange={(dataBinding) => {
              model.onUpdateDataAttributes('videoObject', dataBinding);
            }}
          />
        );
      }
      default:
        return <div />;
    }
  }

  return (
    <>
      <ZConfigRowTitle text={content.label.source} />
      <Select
        style={styles.fullWidth}
        value={videoSource}
        onChange={(value) => {
          const diffItems = [
            ComponentDiff.buildUpdateDataAttributesDiff({
              model,
              valueKey: 'videoSource',
              newValue: value,
            }),
          ];
          switch (value) {
            case VideoSource.UPLOAD: {
              diffItems.push(
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'videoObject',
                  newValue: DataBinding.withTextVariable(),
                })
              );
              break;
            }
            case VideoSource.VIDEO: {
              diffItems.push(
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'videoObject',
                  newValue: DataBinding.withSingleValue(MediaType.VIDEO),
                })
              );
              break;
            }
          }
          AllStores.diffStore.applyDiff(diffItems);
        }}
      >
        {Object.values(VideoSource).map((e) => (
          <Select.Option key={e} value={e}>
            {content.source[e] ?? e}
          </Select.Option>
        ))}
      </Select>
      {renderVideoSourceComponent()}
      {videoSource === VideoSource.UPLOAD && videoObject.effectiveValue ? (
        <VideoPreviewView videoExId={videoObject.effectiveValue} />
      ) : undefined}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  titleContainer: {
    margin: '10px 5px',
  },
  imageContainer: {
    marginTop: '25px',
  },
  fullWidth: {
    width: '100%',
  },
};
