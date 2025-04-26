/* eslint-disable import/no-default-export */
import React from 'react';
import { observer } from 'mobx-react';
import useConfigTabHelpers from '../../../../hooks/useConfigTabHelpers';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import SelectListDataConfigRow from '../config-row/SelectListDataConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import HorizontalListModel from '../../../../models/mobile-components/HorizontalListModel';
import i18n from './HorizontalListConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import useStores from '../../../../hooks/useStores';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import ConfigTab from './ConfigTab';
import { HorizontalListAttributes } from '../../../mobile-components/ZHorizontalList';
import { InputNumber, Row, Switch, Empty, Collapse } from '../../../../zui';
import cssModule from './HorizontalListConfigTab.module.scss';

const HorizontalListStyleConfigTab = observer((props: { model: HorizontalListModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { diffStore } = useStores();
  const { model } = props;
  const dataAttributes = model.dataAttributes as HorizontalListAttributes;
  return (
    <>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={dataAttributes.backgroundColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />

      <Row justify="space-between" align="middle" style={styles.multiLine}>
        <ZConfigRowTitle text={content.label.horizontalPadding} />
        <InputNumber
          min={0}
          style={styles.inputNumber}
          key={dataAttributes.horizontalPadding}
          defaultValue={dataAttributes.horizontalPadding}
          onChange={(value) => {
            const horizontalPadding = typeof value === 'number' ? value : 0;
            model.onUpdateDataAttributes('horizontalPadding', horizontalPadding);
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.multiLine}>
        <ZConfigRowTitle text={content.label.pagingEnabled} />
        <Switch
          checked={dataAttributes.pagingEnabled}
          onChange={(checked) => {
            let diffItems = [
              ComponentDiff.buildUpdateDataAttributesDiff({
                model,
                valueKey: 'pagingEnabled',
                newValue: checked,
              }),
            ];
            if (!checked) {
              diffItems = diffItems.concat([
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'autoplay',
                  newValue: false,
                }),
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'circular',
                  newValue: false,
                }),
                ComponentDiff.buildUpdateDataAttributesDiff({
                  model,
                  valueKey: 'indicatorDots',
                  newValue: false,
                }),
              ]);
            }
            diffStore.applyDiff(diffItems);
          }}
        />
      </Row>

      {dataAttributes.pagingEnabled ? (
        <>
          <Row justify="space-between" align="middle" style={styles.multiLine}>
            <ZConfigRowTitle text={content.label.autoplay} />
            <Switch
              checked={dataAttributes.autoplay}
              onChange={(checked) => {
                model.onUpdateDataAttributes('autoplay', checked);
              }}
            />
          </Row>

          <Row justify="space-between" align="middle" style={styles.multiLine}>
            <ZConfigRowTitle text={content.label.circular} />
            <Switch
              checked={dataAttributes.circular}
              onChange={(checked) => {
                model.onUpdateDataAttributes('circular', checked);
              }}
            />
          </Row>

          <Row justify="space-between" align="middle" style={styles.multiLine}>
            <ZConfigRowTitle text={content.label.showIndicatorDots} />
            <Switch
              checked={dataAttributes.indicatorDots}
              onChange={(checked) => {
                model.onUpdateDataAttributes('indicatorDots', checked);
              }}
            />
          </Row>
        </>
      ) : null}

      {dataAttributes.indicatorDots ? (
        <>
          <ZConfigRowTitle text={content.label.dotColor} />
          <ColorPicker
            style={styles.colorSelect}
            color={dataAttributes.indicatorColor}
            name={content.label.indicatorColor}
            onChange={(color) => {
              model.onUpdateDataAttributes('indicatorColor', DataBinding.withColor(color));
            }}
          />
          <ColorPicker
            style={styles.colorSelect}
            color={dataAttributes.indicatorActiveColor}
            name={content.label.indicatorActiveColor}
            onChange={(color) => {
              model.onUpdateDataAttributes('indicatorActiveColor', DataBinding.withColor(color));
            }}
          />
        </>
      ) : null}
    </>
  );
});

const HorizontalListDataConfigTab = observer((props: { model: HorizontalListModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  return (
    <>
      <Collapse
        bordered
        defaultOpenIndex={0}
        className={cssModule.collapse}
        setContentFontColorToOrangeBecauseHistoryIsCruel
        items={[
          {
            title: content.label.list,
            content: <SelectListDataConfigRow mRef={model.mRef} title={content.label.limit} />,
          },
        ]}
      />
    </>
  );
});

function HorizontalListConfigTab(props: MRefProp): NullableReactElement {
  const { model } = useConfigTabHelpers<HorizontalListModel>(props.mRef);

  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={HorizontalListDataConfigTab}
      StyleConfigTab={HorizontalListStyleConfigTab}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  inputNumber: {
    marginLeft: '5px',
  },
  multiLine: {
    marginTop: '10px',
  },
};

export default observer(HorizontalListConfigTab);
