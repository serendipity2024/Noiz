/* eslint-disable import/no-default-export */
import { observer, useObserver } from 'mobx-react';
import React, { CSSProperties } from 'react';
import useLocale from '../../../hooks/useLocale';
import useStores from '../../../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../../../hooks/useUserFlowTrigger';
import StoreHelpers from '../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../models/base/BaseComponentModel';
import BaseContainerModel from '../../../models/base/BaseContainerModel';
import CollapseAllHover from '../../../shared/assets/icons/collapse-all-hover.svg';
import CollapseAll from '../../../shared/assets/icons/collapse-all.svg';
import ExpandAllHover from '../../../shared/assets/icons/expand-all-hover.svg';
import ExpandAll from '../../../shared/assets/icons/expand-all.svg';
import GoToTopHover from '../../../shared/assets/icons/go-to-top-hover.svg';
import GoToTop from '../../../shared/assets/icons/go-to-top.svg';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import ZHoverableIcon from '../../editor/ZHoverableIcon';
import { ComponentsDragDropConfigRow } from '../right-drawer/config-row/ComponentsDragDropConfigRow';
import i18n from './ComponentTreeTab.i18n.json';
import PlaceholderTab from './PlaceholderTab';
import LeftDrawerTitle from './shared/LeftDrawerTitle';

export default observer(function ComponentTreeTab(): NullableReactElement {
  const utf = useSelectionTrigger();
  const { localizedContent: content } = useLocale(i18n);
  const { coreStore, editorStore } = useStores();
  const focusedModel = useObserver(() => coreStore.getModel(editorStore.editorState.target ?? ''));
  const rootModel = StoreHelpers.fetchRootModel(focusedModel);

  if (!focusedModel || !rootModel || !rootModel.isRootContainer) return <PlaceholderTab />;
  const screenModel = rootModel as BaseContainerModel;

  const expandAll = () => {
    const expandChildren = (component: BaseContainerModel) => {
      component.children().forEach((item: BaseComponentModel) => {
        if (!item.isContainer) return;
        editorStore.expandedMRefsInComponentTree.add(item.mRef);
        expandChildren(item as BaseContainerModel);
      });
    };
    expandChildren(screenModel);
  };
  const collapseAll = () => {
    editorStore.expandedMRefsInComponentTree.clear();
  };
  const focusHome = () => {
    utf(UserFlow.FOCUS_TARGET)(screenModel.mRef);
  };

  return (
    <>
      <LeftDrawerTitle containerStyle={styles.title}>{content.title}</LeftDrawerTitle>
      <div style={styles.iconRow}>
        <ZHoverableIcon
          isSelected={false}
          src={ExpandAll}
          hoveredSrc={ExpandAllHover}
          iconStyle={styles.icon}
          toolTip={content.iconTips.expandAll}
          toolTipPlacement="top"
          onClick={expandAll}
        />
        <ZHoverableIcon
          isSelected={false}
          src={CollapseAll}
          hoveredSrc={CollapseAllHover}
          iconStyle={styles.icon}
          toolTip={content.iconTips.collapseAll}
          toolTipPlacement="top"
          onClick={collapseAll}
        />
        <ZHoverableIcon
          isSelected={false}
          src={GoToTop}
          hoveredSrc={GoToTopHover}
          iconStyle={styles.icon}
          toolTip={content.iconTips.goToTop}
          toolTipPlacement="top"
          onClick={focusHome}
        />
      </div>
      <ComponentsDragDropConfigRow
        expandable
        components={Object.values(screenModel.children()).reverse()}
        onChange={(components: BaseComponentModel[]) => {
          screenModel.childMRefs = Object.values(components)
            .reverse()
            .map((e) => e.mRef);
        }}
      />
    </>
  );
});

const styles: Record<string, CSSProperties> = {
  title: {
    margin: '14px 0 24px 0',
  },
  iconRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  icon: {
    width: 36,
    height: 36,
    cursor: 'pointer',
  },
};
