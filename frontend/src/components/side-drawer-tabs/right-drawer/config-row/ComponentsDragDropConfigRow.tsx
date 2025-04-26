/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import { transaction } from 'mobx';
import { observer, useObserver } from 'mobx-react';
import React, { ReactElement } from 'react';
import { head } from 'lodash';
import useModel from '../../../../hooks/useModel';
import useStores from '../../../../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../../../../hooks/useUserFlowTrigger';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import ArrowRight from '../../../../shared/assets/icons/arrow-right.svg';
import ArrowIcon from '../../../../shared/assets/icons/arrow-with-tail-right.svg';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';
import { MRefProp } from '../../../mobile-components/PropTypes';
import ReorderedListConfigRow from './ReorderedListConfigRow';
import BaseMobileSlotModel from '../../../../models/base/BaseMobileSlotModel';
import { Button } from '../../../../zui';

interface ComponentsDragDropProps {
  components: BaseComponentModel[];
  onChange: (components: BaseComponentModel[]) => void;
  expandable?: boolean;
}

export const ComponentsDragDropConfigRow = observer(
  (props: ComponentsDragDropProps): ReactElement => {
    const { editorStore, coreStore } = useStores();
    const utf = useSelectionTrigger();
    const { components } = props;

    const focusItem = (item: BaseComponentModel) => {
      if (!item.hasFocusMode()) return;
      utf(UserFlow.FOCUS_TARGET)(item.mRef);
    };
    const selectItem = (item: BaseComponentModel) => {
      let targetMRef = item.mRef;
      if (item.isSlot) {
        const childMRef = (coreStore.getModel(targetMRef) as BaseMobileSlotModel).getChildMRef();
        if (childMRef) {
          targetMRef = childMRef;
        }
      }
      transaction(() => {
        editorStore.rightDrawerTarget = targetMRef;
        editorStore.selectedTargets = [targetMRef];
      });
    };
    const renderFocusButton = (item: BaseComponentModel) => {
      if (!item.hasFocusMode()) return null;
      return (
        <Button
          type="text"
          icon={<img alt="" style={styles.arrow} src={ArrowIcon} />}
          onClick={() => focusItem(item)}
        />
      );
    };

    const renderUnexpandableRow = (item: BaseComponentModel) => (
      <div style={styles.unexpandableContainer}>
        <div
          style={styles.leftAligned}
          onClick={() => selectItem(item)}
          onDoubleClick={() => focusItem(item)}
        >
          <span style={styles.itemTitle}>{item.componentName}</span>
        </div>
        {renderFocusButton(item)}
      </div>
    );

    return (
      <ReorderedListConfigRow
        axis="y"
        dataSource={components}
        onChange={(items) => props.onChange(items)}
        renderItem={(item) =>
          props.expandable ? (
            <ExpandableComponentTreeRow
              mRef={item.mRef}
              onChange={props.onChange}
              selectItem={selectItem}
              focusItem={focusItem}
              renderFocusButton={renderFocusButton}
            />
          ) : (
            renderUnexpandableRow(item)
          )
        }
      />
    );
  }
);

type ExpandableComponentTreeRowType = MRefProp & {
  onChange: (components: BaseComponentModel[]) => void;
  selectItem: (components: BaseComponentModel) => void;
  focusItem: (components: BaseComponentModel) => void;
  renderFocusButton: (components: BaseComponentModel) => any;
};

const ExpandableComponentTreeRow = observer(
  (props: ExpandableComponentTreeRowType): NullableReactElement => {
    const { editorStore } = useStores();
    const item = useModel(props.mRef);
    const expandedSet = useObserver(() => editorStore.expandedMRefsInComponentTree);
    const isSelected = useObserver(() => head(editorStore.selectedTargets) === props.mRef);
    if (!item) return null;

    const isExpanded = expandedSet.has(props.mRef);
    const switchExpandingStatus = () => {
      if (isExpanded) {
        expandedSet.delete(props.mRef);
      } else {
        expandedSet.add(props.mRef);
      }
    };

    const renderExpandingButton = () => {
      if (!item.isContainer || item.referencedTemplateMRef) return null;
      const arrowStyle = { ...styles.arrow, ...(isExpanded ? styles.rotate : {}) };
      return (
        <Button
          type="text"
          icon={<img alt="" style={arrowStyle} src={ArrowRight} />}
          onClick={() => switchExpandingStatus()}
        />
      );
    };
    const renderExpansion = () => {
      if (!isExpanded || !item.isContainer || item.referencedTemplateMRef) return null;

      const container = item as BaseContainerModel;
      return (
        <div style={styles.expansionContainer}>
          <ComponentsDragDropConfigRow
            expandable
            components={container.children()}
            onChange={(components: BaseComponentModel[]) => {
              container.childMRefs = components.map((component) => component.mRef);
            }}
          />
        </div>
      );
    };

    const containerStyle = {
      ...styles.expandableContainer,
      ...(isSelected ? styles.isSelected : null),
    };
    const onClick = () => {
      if (!isSelected) {
        props.selectItem(item);
      } else {
        editorStore.selectedTargets = [];
      }
    };
    return (
      <div key={props.mRef} style={containerStyle}>
        <div style={styles.titleLine} onClick={onClick}>
          {renderExpandingButton()}
          <div style={styles.leftAligned}>
            <span style={styles.itemTitle}>{item.componentName}</span>
          </div>
          {props.renderFocusButton(item)}
        </div>
        {renderExpansion()}
      </div>
    );
  }
);

const styles: Record<string, React.CSSProperties> = {
  unexpandableContainer: {
    display: 'flex',
    flexDirection: 'row',
    height: '32px',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 12px',
    marginTop: '10px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    borderColor: ZColors.TRANSPARENT,
    borderStyle: 'solid',
    backgroundColor: ZThemedColors.QUATERNARY,
    overflow: 'hidden',
  },
  leftAligned: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '88%',
  },
  itemTitle: {
    fontSize: '14px',
    color: ZColors.WHITE,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
    whiteSpace: 'nowrap',
  },

  // expandable
  expandableContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 6px',
    marginTop: '6px',
    borderWidth: 2,
    borderColor: ZColors.TRANSPARENT,
    borderStyle: 'solid',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    backgroundColor: ZThemedColors.QUATERNARY,
    overflow: 'hidden',
  },
  isSelected: {
    borderWidth: 2,
    borderColor: ZThemedColors.ACCENT,
    borderStyle: 'solid',
  },
  titleLine: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '32px',
    overflow: 'hidden',
  },
  expansionContainer: {
    width: '100%',
    padding: '6px',
    marginBottom: '6px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
    borderColor: ZColors.TRANSPARENT,
    borderStyle: 'solid',
    backgroundColor: ZThemedColors.PRIMARY,
    overflow: 'hidden',
  },
  arrow: {
    width: '12px',
    height: '12px',
  },
  rotate: {
    transform: 'rotate(90deg)',
  },
};
