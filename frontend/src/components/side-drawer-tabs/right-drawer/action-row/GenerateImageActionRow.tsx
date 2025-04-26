/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import { isNumber } from 'lodash';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { GenerateImageHandleBinding } from '../../../../shared/type-definition/EventBinding';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import { UploadType, UploadFile } from '../shared/UploadFile';
import ArgumentsConfigRow, { DataBindingParameterEdit } from '../config-row/ArgumentsConfigRow';
import AssignPageDataConfigRow from '../config-row/AssignPageDataConfigRow';
import { MediaType, BaseType } from '../../../../shared/type-definition/DataModel';
import i18n from './GenerateImageActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import RequestResultActionRow from './RequestResultActionRow';
import { Row, Switch, InputNumber } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: GenerateImageHandleBinding;
  onEventChange: () => void;
}

export default observer(function GenerateImageActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, event, onEventChange } = props;

  return (
    <>
      <AssignPageDataConfigRow
        title={content.label.assignTo}
        pageDataFilter={(type) => type === MediaType.IMAGE}
        model={props.componentModel}
        pathComponents={event.assignTo}
        onPathComponentsChange={(pathComponents) => {
          event.assignTo = pathComponents;
          props.onEventChange();
        }}
      />
      {event.args ? (
        <>
          <ZConfigRowTitle text={content.label.parameters} />
          <ArgumentsConfigRow
            componentModel={componentModel}
            args={event.args}
            onChange={(args) => {
              event.args = args;
              onEventChange();
            }}
            producer={() => DataBinding.withSingleValue(BaseType.TEXT)}
            Edit={DataBindingParameterEdit}
          />
        </>
      ) : (
        <></>
      )}
      <Row justify="space-between" align="middle">
        <ZConfigRowTitle text={content.label.hasBackgroundImage} />
        <Switch
          checked={!!event.backgroundRelativePosition}
          onChange={(checked) => {
            if (checked) {
              event.backgroundRelativePosition = [0, 0];
            } else {
              event.backgroundRelativePosition = undefined;
            }
            event.backgroundImageExId = undefined;
            onEventChange();
          }}
        />
      </Row>
      {event.backgroundRelativePosition ? (
        <>
          <ZConfigRowTitle text={content.label.backgroundImage} />
          <UploadFile
            uploadType={UploadType.IMAGE}
            fileExId={event.backgroundImageExId}
            uploadFileResult={(result) => {
              event.backgroundImageExId = result.exId;
              onEventChange();
            }}
          />
          <ZConfigRowTitle text={content.label.size} />
          <InputNumber
            value={event.size}
            onChange={(value) => {
              if (isNumber(value)) {
                event.size = value;
                onEventChange();
              }
            }}
            // https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
            min={280}
            max={1280}
          />
          <ZConfigRowTitle text={content.label.relativePosition} />
          <Row justify="space-between" style={styles.row}>
            <div>x</div>
            <InputNumber
              value={event.backgroundRelativePosition[0]}
              onChange={(value) => {
                if (event.backgroundRelativePosition && isNumber(value)) {
                  event.backgroundRelativePosition[0] = value;
                  onEventChange();
                }
              }}
            />
          </Row>
          <Row justify="space-between" style={styles.row}>
            <div>y</div>
            <InputNumber
              value={event.backgroundRelativePosition[1]}
              onChange={(value) => {
                if (event.backgroundRelativePosition && isNumber(value)) {
                  event.backgroundRelativePosition[1] = value;
                  onEventChange();
                }
              }}
            />
          </Row>
        </>
      ) : (
        <></>
      )}
      <RequestResultActionRow
        componentModel={componentModel}
        event={event}
        onEventChange={onEventChange}
      />
    </>
  );
});

const styles: Record<string, CSSProperties> = {
  row: {
    margin: '10px 5px',
  },
};
