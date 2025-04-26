/* eslint-disable import/no-default-export */
import { cloneDeep } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import SwitchRow from '../shared/SwitchRow';
import { UploadType, UploadFile } from '../shared/UploadFile';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './LottieConfigTab.i18n.json';
import LottieModel from '../../../../models/mobile-components/LottieModel';
import ConfigTab from './ConfigTab';
import { LottieAttributes } from '../../../mobile-components/ZLottie';

const LottieStyleConfigTab = observer((props: { model: LottieModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as LottieAttributes;
  return (
    <>
      <SwitchRow
        componentModel={model}
        title={content.label.loop}
        dataAttribute={dataAttributes}
        field="loop"
        style={styles.fixedRow}
      />
      <SwitchRow
        componentModel={model}
        title={content.label.autoplay}
        dataAttribute={dataAttributes}
        field="autoplay"
        style={styles.fixedRow}
      />
    </>
  );
});

const LottieDataConfigTab = observer((props: { model: LottieModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as LottieAttributes;
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
    </>
  );
});

const LottieActionConfigTab = observer((props: { model: LottieModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as LottieAttributes;
  return (
    <>
      <ZConfigRowTitle
        text={dataAttributes.loop ? content.label.onLoopComplete : content.label.onComplete}
      />
      <ClickActionConfigRow
        componentModel={model}
        eventList={cloneDeep(dataAttributes.completeActions)}
        eventListOnChange={(value) => model.onUpdateDataAttributes('completeActions', value)}
      />
    </>
  );
});

export default observer(function LottieConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<LottieModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={LottieActionConfigTab}
      DataConfigTab={LottieDataConfigTab}
      StyleConfigTab={LottieStyleConfigTab}
    />
  );
});
const styles: Record<string, React.CSSProperties> = {
  fixedRow: {
    marginTop: '10px',
  },
};
