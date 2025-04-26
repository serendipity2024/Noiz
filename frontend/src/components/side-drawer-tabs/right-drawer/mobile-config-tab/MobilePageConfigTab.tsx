import { observer, useObserver } from 'mobx-react';
import React from 'react';
import { DraggableScreenAttributes } from '../../../../containers/ZDraggableBoard';
import useModel from '../../../../hooks/useModel';
import useStores from '../../../../hooks/useStores';
import BasicMobileModel from '../../../../models/basic-components/BasicMobileModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ScreenDataConfigRow from '../config-row/ScreenDataConfigRow';
import { BackgroundConfigRow } from '../config-row/BackgroundConfigRow';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './MobilePageConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import { useConfiguration } from '../../../../hooks/useConfiguration';
import { Checkbox, InputNumber, Select } from '../../../../zui';
import ComponentModelType from '../../../../shared/type-definition/ComponentModelType';
import { ZedSupportedPlatform } from '../../../../models/interfaces/ComponentModel';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import ComponentModelBuilder from '../../../../models/ComponentModelBuilder';
import { DiffItem } from '../../../../shared/type-definition/Diff';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import componentI18n from '../../../../hooks/useLocalizedComponentModelType.i18n.json';

const NONE = 'none';

export const MobilePageConfigTab = observer((props: MRefProp): NullableReactElement => {
  const { localizedContent: content } = useLocale(i18n);
  const { localizedContent: componentContent } = useLocale(componentI18n);
  const { coreStore, editorStore, diffStore } = useStores();
  const { initialScreenMRef } = useConfiguration();
  const model = useModel<BasicMobileModel>(props.mRef);
  const dataAttributes = useObserver(() => model?.dataAttributes as DraggableScreenAttributes);
  const footerHeight = useObserver(() => dataAttributes.footerHeight);
  if (!model) return null;

  const navigationBarModel = model
    .children()
    .find(
      (component) =>
        component.type === ComponentModelType.WECHAT_NAVIGATION_BAR ||
        component.type === ComponentModelType.MOBILE_NAVIGATION_BAR
    );

  function onNavigationBarChange(type: string) {
    if (!model) return;
    switch (type) {
      case NONE: {
        // TODO: applyDiff waiting change to mutation
        diffStore.applyDiff(buildDeleteNavigationBarDiffs());
        break;
      }
      case ComponentModelType.WECHAT_NAVIGATION_BAR: {
        const newNavigationBarModel = ComponentModelBuilder.buildByType(
          model.mRef,
          ComponentModelType.WECHAT_NAVIGATION_BAR
        );
        diffStore.applyDiff(buildUpdateNavigationBarDiffs(newNavigationBarModel));
        break;
      }
      case ComponentModelType.MOBILE_NAVIGATION_BAR: {
        const newNavigationBarModel = ComponentModelBuilder.buildByType(
          model.mRef,
          ComponentModelType.MOBILE_NAVIGATION_BAR
        );
        diffStore.applyDiff(buildUpdateNavigationBarDiffs(newNavigationBarModel));
        break;
      }
      default:
        throw new Error(`unsupported navigationBar type, ${type}`);
    }
  }

  function buildDeleteNavigationBarDiffs(): DiffItem[] {
    return navigationBarModel && model
      ? [
          ...ComponentDiff.buildDeleteComponentDiffs(navigationBarModel),
          ComponentDiff.buildDeleteChildMRefsDiff(model.mRef, [navigationBarModel?.mRef]),
        ]
      : [];
  }

  function buildUpdateNavigationBarDiffs(newNavigationBarModel: BaseComponentModel): DiffItem[] {
    return model
      ? [
          ...buildDeleteNavigationBarDiffs(),
          ComponentDiff.buildAddComponentDiff(newNavigationBarModel),
          ComponentDiff.buildAddChildMRefsDiff(model.mRef, [newNavigationBarModel.mRef]),
        ]
      : [];
  }

  return (
    <>
      <Checkbox
        style={styles.checkbox}
        disabled={initialScreenMRef === model.mRef}
        checked={initialScreenMRef === model.mRef}
        onChange={(e) => {
          if (e.target.checked) {
            coreStore.updateConfiguration({ initialScreenMRef: model.mRef });
          }
        }}
      >
        <span style={styles.checkboxTitle}>{content.label.isInitialScreen}</span>
      </Checkbox>
      <ZConfigRowTitle text={content.label.navigationBar} />
      <Select
        style={styles.fullWidth}
        value={navigationBarModel?.type ?? NONE}
        onChange={(value) => onNavigationBarChange(value)}
      >
        <Select.Option key={NONE} value={NONE}>
          {NONE}
        </Select.Option>
        {editorStore.editorPlatform === ZedSupportedPlatform.WECHAT && (
          <Select.Option
            key={ComponentModelType.WECHAT_NAVIGATION_BAR}
            value={ComponentModelType.WECHAT_NAVIGATION_BAR}
          >
            {componentContent[ComponentModelType.WECHAT_NAVIGATION_BAR]}
          </Select.Option>
        )}
        {editorStore.editorPlatform === ZedSupportedPlatform.MOBILE_WEB && (
          <Select.Option
            key={ComponentModelType.MOBILE_NAVIGATION_BAR}
            value={ComponentModelType.MOBILE_NAVIGATION_BAR}
          >
            {componentContent[ComponentModelType.MOBILE_NAVIGATION_BAR]}
          </Select.Option>
        )}
      </Select>
      <BackgroundConfigRow model={model} colorPickerVisiable disableAlpha />
      <ZConfigRowTitle text={content.label.fillMarginFooterHeight} />
      <InputNumber
        min={0}
        value={footerHeight}
        style={styles.input}
        onChange={(value) => {
          model.onUpdateDataAttributes('footerHeight', typeof value === 'number' ? value : 0);
        }}
      />
      <ScreenDataConfigRow model={model} />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  checkbox: {
    marginTop: '20px',
  },
  checkboxTitle: {
    color: 'white',
  },
  colorSelect: {
    verticalAlign: 'middle',
    color: '#fff',
    width: '100%',
    height: '55px',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  input: {
    background: ZThemedColors.SECONDARY,
    border: '0px',
    borderRadius: '6px',
    color: ZColors.WHITE,
    marginBottom: '20px',
  },
  fullWidth: {
    width: '100%',
  },
};
