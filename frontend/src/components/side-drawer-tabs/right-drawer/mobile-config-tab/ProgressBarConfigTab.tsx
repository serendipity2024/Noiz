/* eslint-disable import/no-default-export */
import _ from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { ProgressBarAttributes } from '../../../mobile-components/ZProgressBar';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import { UploadType, UploadFile } from '../shared/UploadFile';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ProgressBarConfigTab.i18n.json';
import ProgressBarModel from '../../../../models/mobile-components/ProgressBarModel';
import ConfigTab from './ConfigTab';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { InputNumber, Row, Empty } from '../../../../zui';

const ProgressBarDataConfigTab = observer((props: { model: ProgressBarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as ProgressBarAttributes;

  return (
    <>
      <ZConfigRowTitle text={content.label.upload} />
      <UploadFile
        uploadType={UploadType.JSON}
        fileExId={dataAttributes.exId}
        uploadFileResult={(result) => {
          model.onUpdateDataAttributes('exId', result.exId);
        }}
      />

      <Row justify="space-between" align="middle">
        <ZConfigRowTitle text={content.label.totalProgress} />
        <InputNumber
          size="small"
          min={1}
          key={dataAttributes.totalProgress}
          defaultValue={dataAttributes.totalProgress}
          style={styles.inputNumber}
          onChange={(value) => {
            const numValue = typeof value === 'number' ? (value as number) : 0;
            model.onUpdateDataAttributes('totalProgress', numValue);
          }}
        />
      </Row>

      <Row justify="space-between" align="middle">
        <ZConfigRowTitle text={content.label.step} />
        <InputNumber
          size="small"
          min={1}
          key={dataAttributes.step}
          defaultValue={dataAttributes.step}
          style={styles.inputNumber}
          onChange={(value) => {
            const numValue = typeof value === 'number' ? (value as number) : 0;
            model.onUpdateDataAttributes('step', numValue);
          }}
        />
      </Row>

      <DataBindingConfigRow
        title={content.label.defaultProgress}
        componentModel={model}
        dataBinding={dataAttributes.defaultProgress}
        onChange={(value) => {
          model.onUpdateDataAttributes('defaultProgress', value);
        }}
      />
    </>
  );
});

const ProgressBarActionConfigTab = observer((props: { model: ProgressBarModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as ProgressBarAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label.onProgressChange} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={_.cloneDeep(dataAttributes.onProgressChangeActions)}
        eventListOnChange={(value) =>
          model.onUpdateDataAttributes('onProgressChangeActions', value)
        }
      />
    </>
  );
});

export default observer(function ProgressBarConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<ProgressBarModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={ProgressBarActionConfigTab}
      DataConfigTab={ProgressBarDataConfigTab}
      StyleConfigTab={() => <Empty description={false} />}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  inputNumber: {
    borderRadius: '6px',
    background: ZThemedColors.SECONDARY,
    border: '0px',
    color: ZColors.WHITE,
  },
};
