/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-param-reassign */
import { observer, useObserver } from 'mobx-react';
import React from 'react';
import useModel from '../../../hooks/useModel';
import ZFrame, { ZPosition, ZSize } from '../../../models/interfaces/Frame';
import { VerticalDirection, VerticalLayoutMode } from '../../../shared/type-definition/Layout';
import { NullableReactElement, ShortId } from '../../../shared/type-definition/ZTypes';
import ZConfigRowTitle from './shared/ZConfigRowTitle';
import i18n from './ComponentFrameTab.i18n.json';
import useLocale from '../../../hooks/useLocale';
import { ZThemedColors } from '../../../utils/ZConst';
import { LabeledNumberInput, InputNumber, Row, Select, Switch } from '../../../zui';
import styles from './ComponentFrameTab.module.scss';

export interface Props {
  mRef: ShortId;
}

export default observer(function ComponentFrameTab(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const model = useModel(props.mRef);
  const frame = useObserver(() => model?.getComponentFrame());

  if (!model || !model?.mRef || !frame) return null;

  const isFrameConfigurationDisabled = model.isFrameConfigurationDisabled();

  const handleInputSaving = (
    frameableKey: keyof ZFrame,
    frameAxis: keyof ZPosition | keyof ZSize,
    newValue: number
  ): void => {
    if (newValue === undefined) {
      return;
    }

    const adjustedValue =
      frameAxis === 'width' || frameAxis === 'height' ? Math.max(newValue, 1) : newValue;

    const newFrame = { [frameableKey]: { ...frame[frameableKey], [frameAxis]: adjustedValue } };
    model.onUpdateFrame({ ...frame, ...newFrame });
  };

  const renderLabeledInput = (label: string, value: number, onChange: (value: number) => void) => (
    <LabeledNumberInput
      className={styles.labeledNumberInput}
      label={label}
      value={value}
      onChange={onChange}
      disabled={isFrameConfigurationDisabled}
    />
  );

  const renderFixedComponent = () => {
    return model.isRootContainer ? null : (
      <div key={model.mRef}>
        {model.getLayoutConfiguration().floatEnabled && (
          <Row justify="space-between" align="middle" style={inlineStyles.fixedRow}>
            <ZConfigRowTitle text={content.label.isFloating} />
            <Switch
              checked={model.isFloating}
              onChange={(checked) => {
                model.onUpdateModel('isFloating', checked);
              }}
            />
          </Row>
        )}
        {model.getLayoutConfiguration().locationEnabled && (
          <Row justify="space-between" align="middle" style={inlineStyles.fixedRow}>
            <ZConfigRowTitle text={content.label.verticalFlexDirection} />
            <Select
              bordered={false}
              value={model.verticalLayout?.location ?? VerticalDirection.TOP_DOWN}
              size="large"
              style={inlineStyles.typeSelect}
              onChange={(value) => {
                model.onUpdateModel('verticalLayout', {
                  ...model.verticalLayout,
                  location: value,
                });
              }}
            >
              {Object.entries(VerticalDirection).map(([key, value]) => (
                <Select.Option key={key} style={inlineStyles.titleText} value={value}>
                  {content.direction[value] ?? value}
                </Select.Option>
              ))}
            </Select>
          </Row>
        )}
        {model.getLayoutConfiguration().layoutModeEnabled && (
          <Row justify="space-between" align="middle" style={inlineStyles.fixedRow}>
            <ZConfigRowTitle text={content.label.verticalLayoutMode} />
            <Select
              bordered={false}
              value={model.verticalLayout?.layoutMode ?? VerticalLayoutMode.FIXED}
              size="large"
              style={inlineStyles.typeSelect}
              onChange={(value) => {
                model.onUpdateModel('verticalLayout', {
                  ...model.verticalLayout,
                  layoutMode: value,
                  minValue:
                    value === VerticalLayoutMode.FIXED
                      ? undefined
                      : model.getComponentFrame().size.height,
                });
              }}
            >
              {Object.values(VerticalLayoutMode).map((e) => (
                <Select.Option key={e} value={e} style={inlineStyles.selectOption}>
                  {content.mode[e] ?? e}
                </Select.Option>
              ))}
            </Select>
          </Row>
        )}
        {model.verticalLayout?.layoutMode !== VerticalLayoutMode.FIXED && (
          <Row justify="space-between" align="middle" style={inlineStyles.fixedRow}>
            <ZConfigRowTitle text={content.label.verticalMinValue} />
            <InputNumber
              type="number"
              value={model.verticalLayout?.minValue}
              min={0}
              onChange={(value) => {
                model.onUpdateModel('verticalLayout', {
                  ...model.verticalLayout,
                  minValue: typeof value === 'number' ? value : 0,
                });
              }}
            />
          </Row>
        )}
      </div>
    );
  };

  return (
    <div>
      {model.getFrameConfiguration().positionEnabled ? (
        <div className={styles.twoColNumberInputRow}>
          {renderLabeledInput('x', frame.position?.x ?? 0, (n) =>
            handleInputSaving('position', 'x', n)
          )}
          {renderLabeledInput('y', frame.position?.y ?? 0, (n) =>
            handleInputSaving('position', 'y', n)
          )}
        </div>
      ) : null}
      {model.getFrameConfiguration().sizeEnabled ? (
        <div className={styles.twoColNumberInputRow}>
          {renderLabeledInput('w', frame.size?.width ?? 0, (n) =>
            handleInputSaving('size', 'width', n)
          )}
          {renderLabeledInput('h', frame.size?.height ?? 0, (n) =>
            handleInputSaving('size', 'height', n)
          )}
        </div>
      ) : null}
      {renderFixedComponent()}
    </div>
  );
});

const inlineStyles: Record<string, React.CSSProperties> = {
  typeSelect: {
    width: '40%',
    fontSize: '14px',
    background: ZThemedColors.SECONDARY,
    textAlign: 'center',
    borderRadius: '6px',
  },
  fixedRow: {
    marginTop: '10px',
  },
};
