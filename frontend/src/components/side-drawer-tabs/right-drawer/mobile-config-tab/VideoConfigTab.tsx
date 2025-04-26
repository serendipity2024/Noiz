/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import { cloneDeep } from 'lodash';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { VideoAttributes, VideoObjectFit } from '../../../mobile-components/ZVideo';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import VideoSourceConfigRow from '../config-row/VideoSourceConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './VideoConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import VideoModel from '../../../../models/mobile-components/VideoModel';
import ConfigTab from './ConfigTab';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import { Row, Select, Switch } from '../../../../zui';

const VideoStyleConfigTab = observer((props: { model: VideoModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as VideoAttributes;
  const { controls, autoplay, loop, showMuteBtn, objectFit, backgroundColor } = dataAttributes;
  return (
    <>
      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.autoplay} />
        <Switch
          checked={autoplay}
          onChange={(checked) => {
            model.onUpdateDataAttributes('autoplay', checked);
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.loop} />
        <Switch
          checked={loop}
          onChange={(checked) => {
            model.onUpdateDataAttributes('loop', checked);
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.controls} />
        <Switch
          checked={controls}
          onChange={(checked) => {
            model.onUpdateDataAttributes('controls', checked);
          }}
        />
      </Row>
      <Row justify="space-between" align="middle" style={styles.row}>
        <ZConfigRowTitle text={content.label.showMuteBtn} />
        <Switch
          checked={showMuteBtn}
          onChange={(checked) => {
            model.onUpdateDataAttributes('showMuteBtn', checked);
          }}
        />
      </Row>
      <ZConfigRowTitle text={content.label.objectFit} />
      <Select
        style={styles.fullWidth}
        value={objectFit}
        onChange={(value) => {
          model.onUpdateDataAttributes('objectFit', value);
        }}
      >
        {Object.values(VideoObjectFit).map((e) => (
          <Select.Option key={e} value={e}>
            {content.objectFit[e] ?? e}
          </Select.Option>
        ))}
      </Select>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />

      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const VideoDataConfigTab = observer((props: { model: VideoModel }) => {
  const { model } = props;
  const dataAttributes = model.dataAttributes as VideoAttributes;
  return <VideoSourceConfigRow model={model} videoSourceDataAttributes={dataAttributes} />;
});

const VideoActionConfigTab = observer((props: { model: VideoModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as VideoAttributes;
  const clickActions = cloneDeep(dataAttributes.onBeginPlay);
  return (
    <>
      <ZConfigRowTitle text={content.label.beginPlay} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={clickActions}
        eventListOnChange={(value) => model.onUpdateDataAttributes('onBeginPlay', value)}
      />
    </>
  );
});

export default observer(function VideoConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<VideoModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={VideoActionConfigTab}
      DataConfigTab={VideoDataConfigTab}
      StyleConfigTab={VideoStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  fullWidth: {
    width: '100%',
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  row: {
    marginTop: '10px',
  },
};
