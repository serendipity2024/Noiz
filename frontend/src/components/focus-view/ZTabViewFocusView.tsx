/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
import { observer } from 'mobx-react';
import React, { CSSProperties } from 'react';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ZDroppableArea from '../dnd/ZDroppableArea';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import useColorBinding from '../../hooks/useColorBinding';
import useStores from '../../hooks/useStores';
import useViewport from '../../hooks/useViewport';
import TabViewModel from '../../models/mobile-components/TabViewModel';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import StoreHelpers from '../../mobx/StoreHelpers';
import ZBlankContainer from '../mobile-components/ZBlankContainer';
import { TabViewMode } from '../mobile-components/ZTabView';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { ZMoveableClassName } from '../../utils/ZConst';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from '../mobile-components/PropTypes';
import { Row } from '../../zui';

const RESIZABLE_ROW_MARGIN = 20;

export default observer(function ZTabViewFocusView(props: MRefProp): NullableReactElement {
  const uft = useSelectionTrigger();
  const cb = useColorBinding();
  const viewport = useViewport();
  const { coreStore, editorStore } = useStores();
  const { localizedContent: content } = useLocale(i18n);

  const model = StoreHelpers.findComponentModelOrThrow<TabViewModel>(props.mRef);
  const normalTabModel = StoreHelpers.getComponentModel(model.dataAttributes.normalTabMRef);
  const selectedTabModel = StoreHelpers.getComponentModel(model.dataAttributes.selectedTabMRef);

  const onClick = (event: React.MouseEvent, componentModel: BaseComponentModel) => {
    event.stopPropagation();
    uft(UserFlow.SELECT_TARGET)(componentModel.mRef);
    editorStore.clipBoardContainerMRef = componentModel.mRef;
  };

  const renderSelectionBlankContainer = (params: {
    title: string;
    componentModel?: BaseComponentModel;
  }) => {
    const { title, componentModel } = params;

    if (!componentModel) throw new Error(`custom tab error, ${JSON.stringify(model)}`);

    return (
      <div key={componentModel.mRef} style={styles.childContainer}>
        <ZConfigRowTitle text={title} onClick={(e) => onClick(e, componentModel)} />
        <ZComponentSelectionWrapper component={componentModel} clickable={false}>
          <ZChessBoardForTransparentBackground>
            <ZBlankContainer droppable mRef={componentModel.mRef} />
          </ZChessBoardForTransparentBackground>
        </ZComponentSelectionWrapper>
      </div>
    );
  };

  const renderCustomTab = () => {
    return (
      <Row align="middle" justify="center" style={styles.customTabContainer}>
        {renderSelectionBlankContainer({
          title: content.normalTab,
          componentModel: normalTabModel,
        })}
        {renderSelectionBlankContainer({
          title: content.selectTab,
          componentModel: selectedTabModel,
        })}
      </Row>
    );
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          ...styles.focusRow,
          width: model.dataAttributes.tabList.length * (viewport.width + 2 * RESIZABLE_ROW_MARGIN),
        }}
      >
        {model.dataAttributes.mode === TabViewMode.CUSTOM ? renderCustomTab() : null}
        <Row align="middle" justify="center">
          {model.dataAttributes.tabList.map((item) => {
            const itemModel = coreStore.getModel(item.mRef);
            if (!itemModel) return null;
            return (
              <div key={itemModel?.mRef} style={styles.childContainer}>
                <ZConfigRowTitle
                  text={item.title.effectiveValue}
                  onClick={(e) => onClick(e, itemModel)}
                />
                <ZComponentSelectionWrapper component={itemModel} clickable={false}>
                  <ZChessBoardForTransparentBackground>
                    <div style={{ backgroundColor: cb(itemModel.dataAttributes.backgroundColor) }}>
                      <ZDroppableArea mRef={item.mRef} />
                    </div>
                  </ZChessBoardForTransparentBackground>
                </ZComponentSelectionWrapper>
              </div>
            );
          })}
        </Row>
      </div>
      <div className={`${ZMoveableClassName.PREVIEW}`} style={styles.preview}>
        <ZConfigRowTitle text={content.preview} />
        <div style={styles.previewContainer}>
          <ZComponentSelectionWrapper component={model}>
            {model.renderForPreview()}
          </ZComponentSelectionWrapper>
        </div>
      </div>
    </div>
  );
});

const styles: Record<string, CSSProperties> = {
  container: {
    overflow: 'visible',
  },
  focusRow: {
    position: 'relative',
    textAlign: 'center',
  },
  childContainer: {
    margin: '0 15px',
  },
  preview: {
    marginTop: '100px',
    textAlign: 'center',
  },
  previewContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '30px',
  },
  customTabContainer: {
    marginBottom: '20px',
  },
};
