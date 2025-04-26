/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import { isArray } from 'lodash';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { PreviewDocumentHandleBinding } from '../../../../shared/type-definition/EventBinding';
import useLocale from '../../../../hooks/useLocale';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { DataBindingKind, DataBinding } from '../../../../shared/type-definition/DataBinding';
import { UploadType, UploadFile } from '../shared/UploadFile';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import { MediaType } from '../../../../shared/type-definition/DataModel';
import i18n from './PreviewDocumentActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: PreviewDocumentHandleBinding;
  onEventChange: () => void;
}

export enum FileSource {
  UPLOAD = 'upload',
  FILE = 'file',
}

export default observer(function PreviewDocumentActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;
  const { fileId } = event;
  const source =
    !isArray(fileId.valueBinding) && fileId.valueBinding.kind === DataBindingKind.LITERAL
      ? FileSource.UPLOAD
      : FileSource.FILE;
  return (
    <>
      <ZConfigRowTitle text={content.label.source} />
      <Select
        value={source}
        onChange={(value) => {
          if (value === FileSource.UPLOAD) {
            event.fileId = DataBinding.withLiteral(0);
          } else {
            event.fileId = DataBinding.withSingleValue(MediaType.FILE);
          }
          onEventChange();
        }}
        dropdownMatchSelectWidth={false}
      >
        {Object.values(FileSource).map((value) => (
          <Select.Option key={value} value={value}>
            {content.source[value]}
          </Select.Option>
        ))}
      </Select>
      {source === FileSource.UPLOAD ? (
        <>
          <ZConfigRowTitle text={content.label.upload} />
          <UploadFile
            uploadType={UploadType.FILE}
            fileExId={fileId.effectiveValue}
            uploadFileResult={(result) => {
              event.fileId = DataBinding.withLiteral(result.id, MediaType.FILE);
              onEventChange();
            }}
          />
        </>
      ) : (
        <></>
      )}
      {source === FileSource.FILE ? (
        <DataBindingConfigRow
          title={content.label.file}
          dataBinding={fileId}
          componentModel={componentModel}
          onChange={(dataBinding) => {
            event.fileId = dataBinding;
            onEventChange();
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
});
