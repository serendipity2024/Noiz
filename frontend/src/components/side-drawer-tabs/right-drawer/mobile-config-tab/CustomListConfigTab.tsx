/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
import { cloneDeep, head } from 'lodash';
import { observer } from 'mobx-react';
import React from 'react';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import FrameDiff from '../../../../diffs/FrameDiff';
import useModel from '../../../../hooks/useModel';
import useStores from '../../../../hooks/useStores';
import { AllStores } from '../../../../mobx/StoreContexts';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import BaseMobileComponentModel from '../../../../models/base/BaseMobileComponentModel';
import ComponentModelBuilder from '../../../../models/ComponentModelBuilder';
import CustomListModel from '../../../../models/mobile-components/CustomListModel';
import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import { AGGREGATE, DataBinding } from '../../../../shared/type-definition/DataBinding';
import { EventType } from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { MRefProp } from '../../../mobile-components/PropTypes';
import { CustomListAttributes } from '../../../mobile-components/ZCustomList';
import ClickActionConfigRow from '../config-row/ClickActionConfigRow';
import CombinedStyleConfigRow from '../config-row/CombinedStyleConfigRow';
import SelectListDataConfigRow from '../config-row/SelectListDataConfigRow';
import ColorPicker from '../shared/ColorPicker';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './CustomListConfigTab.i18n.json';
import commonI18n from './CommonConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import ConfigTab from './ConfigTab';
import { Checkbox, Collapse, InputNumber, Row, Select, Switch } from '../../../../zui';
import { BackgroundConfigRow } from '../config-row/BackgroundConfigRow';
import cssModule from './CustomListConfigTab.module.scss';

const COLUMN_NUMBER_DATA = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const CustomListStyleConfigTab = observer((props: { model: CustomListModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: commonContent } = useLocale(commonI18n);
  const { diffStore, coreStore } = useStores();
  const { model } = props;
  const dataAttributes = model.dataAttributes as CustomListAttributes;
  const bgColor = dataAttributes.backgroundColor;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const cellModel = useModel<BaseContainerModel>(head(model.childMRefs.slice())!)!;
  return (
    <>
      <ZConfigRowTitle text={content.label.columnCount} />
      <Select
        style={styles.fullWidth}
        value={dataAttributes.columnNum}
        onChange={(value) => {
          const cellWidth = Math.floor(
            (model.getComponentFrame().size.width -
              dataAttributes.horizontalPadding * (value - 1)) /
              value
          );
          const diffItems = [
            ComponentDiff.buildUpdateDataAttributesDiff({
              model,
              valueKey: 'columnNum',
              newValue: value,
            }),
            ...FrameDiff.buildUpdateComponentFrameDiffs(cellModel, {
              ...cellModel.getComponentFrame(),
              size: {
                ...cellModel.getComponentFrame().size,
                width: cellWidth,
              },
            }),
          ];
          AllStores.diffStore.applyDiff(diffItems);
        }}
      >
        {COLUMN_NUMBER_DATA.map((cn) => (
          <Select.Option key={cn} value={cn}>
            {cn}
          </Select.Option>
        ))}
      </Select>

      <Row justify="space-between" align="middle">
        <ZConfigRowTitle text={content.label.hasHeaderView} />
        <Switch
          checked={!!model?.childMRefs.slice()[1]}
          onChange={(checked) => {
            if (checked) {
              const containerModel = ComponentModelBuilder.buildByType(
                model.mRef,
                ComponentModelType.BLANK_CONTAINER
              ) as BaseMobileComponentModel;
              containerModel.setComponentFrame({
                position: { x: 0, y: 0 },
                size: { width: model.getComponentFrame().size.width, height: 120 },
              });
              containerModel.dataAttributes.backgroundColor = DataBinding.withColor(
                ZThemedColors.PRIMARY_TEXT
              );
              diffStore.applyDiff([
                ComponentDiff.buildAddComponentDiff(containerModel),
                ComponentDiff.buildAddChildMRefsDiff(model.mRef, [containerModel.mRef]),
              ]);
            } else {
              const headerViewMRef = model?.childMRefs[1] ?? '';
              const headerModel = coreStore.getModel(headerViewMRef);
              if (!headerModel) throw new Error(`headerModel error, ${JSON.stringify(model)}`);
              diffStore.applyDiff([
                ...ComponentDiff.buildDeleteComponentDiffs(headerModel),
                ComponentDiff.buildDeleteChildMRefsDiff(model.mRef, [headerViewMRef]),
              ]);
            }
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.multiLine}>
        <ZConfigRowTitle text={content.label.horizontalPadding} />
        <InputNumber
          min={0}
          style={styles.inputNumber}
          key={dataAttributes.horizontalPadding}
          defaultValue={dataAttributes.horizontalPadding}
          onChange={(value) => {
            const number = typeof value === 'number' ? value : 0;
            model.onUpdateDataAttributes('horizontalPadding', number);
          }}
        />
      </Row>

      <Row justify="space-between" align="middle" style={styles.multiLine}>
        <ZConfigRowTitle text={content.label.verticalPadding} />
        <InputNumber
          min={0}
          style={styles.inputNumber}
          key={dataAttributes.verticalPadding}
          defaultValue={dataAttributes.verticalPadding}
          onChange={(value) => {
            const number = typeof value === 'number' ? value : 0;
            model.onUpdateDataAttributes('verticalPadding', number);
          }}
        />
      </Row>
      <ZConfigRowTitle text={commonContent.label.color} />
      <ColorPicker
        style={styles.colorSelect}
        color={bgColor}
        name={commonContent.label.backgroundColor}
        onChange={(color) => {
          model.onUpdateDataAttributes('backgroundColor', DataBinding.withColor(color));
        }}
      />
      <BackgroundConfigRow model={model} />
      <CombinedStyleConfigRow data={model} />
    </>
  );
});

const CustomListDataConfigTab = observer((props: { model: CustomListModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as CustomListAttributes;
  let loadMoreVisible = true;
  if (model.queries.some((q) => q.sortFields?.some((s) => s.type === AGGREGATE))) {
    model.onUpdateDataAttributes('loadMoreEnabled', false);
    loadMoreVisible = false;
  }
  const renderCheckboxComponent = (
    attributeName: keyof CustomListAttributes,
    title: string,
    visible = true
  ) => (
    <div>
      {visible && (
        <Checkbox
          style={styles.checkbox}
          checked={dataAttributes[attributeName] as boolean}
          onChange={(e) => {
            model.onUpdateDataAttributes(attributeName, e.target.checked);
            model.queries?.forEach((query) => {
              query.type = EventType.QUERY;
            });
          }}
        >
          <span style={styles.checkboxTitle}>{title}</span>
        </Checkbox>
      )}
    </div>
  );
  const renderListPanel = () => ({
    title: content.label.list,
    content: (
      <>
        <ZConfigRowTitle text={content.list.loadControl} />
        {renderCheckboxComponent('pullDownRefreshEnabled', content.list.pullDownRefreshEnabled)}
        {renderCheckboxComponent('loadMoreEnabled', content.list.loadMoreEnabled, loadMoreVisible)}
        <SelectListDataConfigRow
          mRef={model.mRef}
          title={content.list.pageSize}
          subscriptionEnabled={
            !model.dataAttributes.pullDownRefreshEnabled && !model.dataAttributes.loadMoreEnabled
          }
        />
      </>
    ),
  });
  return (
    <>
      <Collapse
        defaultOpenIndex={0}
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        className={cssModule.collapse}
        items={[renderListPanel()]}
      />
    </>
  );
});

const CustomListActionConfigTab = observer((props: { model: CustomListModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as CustomListAttributes;
  return (
    <>
      <ZConfigRowTitle text={content.label.onScroll} />
      <ClickActionConfigRow
        componentModel={model}
        eventList={cloneDeep(dataAttributes.onScrollActions)}
        eventListOnChange={(value) => model.onUpdateDataAttributes('onScrollActions', value)}
      />
    </>
  );
});

export default observer(function CustomListConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<CustomListModel>(props.mRef);
  const childMRefs = model?.childMRefs.slice() ?? [];
  const cellModel = useModel<BaseContainerModel>(childMRefs[0] ?? undefined);

  if (!model || !cellModel) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={CustomListActionConfigTab}
      DataConfigTab={CustomListDataConfigTab}
      StyleConfigTab={CustomListStyleConfigTab}
    />
  );
});

const styles: Record<string, React.CSSProperties> = {
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  fullWidth: {
    width: '100%',
  },
  checkboxTitle: {
    color: ZColors.WHITE,
  },
};
