/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { observer, useObserver } from 'mobx-react';
import React, { CSSProperties, useEffect, useState } from 'react';
import { head } from 'lodash';
import useColorBinding from '../../hooks/useColorBinding';
import useModel from '../../hooks/useModel';
import useStores from '../../hooks/useStores';
import { UserFlow, useSelectionTrigger } from '../../hooks/useUserFlowTrigger';
import BaseComponentModel from '../../models/base/BaseComponentModel';
import ConditionalContainerModel from '../../models/mobile-components/ConditionalContainerModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import ZComponentSelectionWrapper from '../base/ZComponentSelectionWrapper';
import ZDroppableArea from '../dnd/ZDroppableArea';
import { MRefProp } from '../mobile-components/PropTypes';
import ZConditionalContainer, {
  ConditionalContainerAttributes,
} from '../mobile-components/ZConditionalContainer';
import { prepareBorderStyles } from '../side-drawer-tabs/right-drawer/config-row/BorderStyleConfigRow';
import ZConfigRowTitle from '../side-drawer-tabs/right-drawer/shared/ZConfigRowTitle';
import i18n from './Common.i18n.json';
import useLocale from '../../hooks/useLocale';
import ZChessBoardForTransparentBackground from '../editor/ZChessBoardForTransparentBackground';
import { ZMoveableClassName } from '../../utils/ZConst';
import { Row } from '../../zui';

export default observer(function ZConditionalContainerFocusView(
  props: MRefProp
): NullableReactElement {
  const uft = useSelectionTrigger();
  const cb = useColorBinding();
  const model = useModel<ConditionalContainerModel>(props.mRef);
  const { editorStore } = useStores();
  const selectedMRef = useObserver(() => head(editorStore.selectedTargets) ?? '');
  const { localizedContent: content } = useLocale(i18n);

  const childMRefSet = new Set(model?.childMRefs);
  const initialPreviewChildMRef = childMRefSet.has(selectedMRef)
    ? selectedMRef
    : (model?.childMRefs ?? [])[childMRefSet.size - 1]; // last element as default preview
  const [currPreviewChildMRef, setCurrPreviewChildMRef] = useState(initialPreviewChildMRef);

  useEffect(() => {
    if (childMRefSet.has(selectedMRef) && selectedMRef !== currPreviewChildMRef)
      setCurrPreviewChildMRef(selectedMRef);
  }, [childMRefSet, selectedMRef, currPreviewChildMRef]);

  if (!model) return null;

  const dataAttributes = model.dataAttributes as ConditionalContainerAttributes;
  const configuredStyle = prepareBorderStyles(dataAttributes, cb);
  const backgroundColor = cb(dataAttributes.backgroundColor);

  const renderChild = (component: BaseComponentModel) => (
    <div key={component.mRef} style={styles.childContainer}>
      <ZConfigRowTitle
        text={component.componentName}
        onClick={(e) => {
          uft(UserFlow.SELECT_TARGET)(component.mRef);
          editorStore.clipBoardContainerMRef = component.mRef;
          e.stopPropagation();
        }}
      />
      <ZComponentSelectionWrapper component={component} clickable={false}>
        <ZChessBoardForTransparentBackground>
          <div style={{ ...configuredStyle, backgroundColor }}>
            <ZDroppableArea mRef={component.mRef} />
          </div>
        </ZChessBoardForTransparentBackground>
      </ZComponentSelectionWrapper>
    </div>
  );

  return (
    <div style={styles.container}>
      <Row align="middle" justify="center">
        {model.children().map(renderChild)}
      </Row>
      <div className={`${ZMoveableClassName.PREVIEW}`} style={styles.preview}>
        <div>
          <ZConfigRowTitle text={content.preview} />
          <ZComponentSelectionWrapper component={model}>
            <ZConditionalContainer mRef={model.mRef} childPreviewMRef={currPreviewChildMRef} />
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
  childContainer: {
    margin: '0 15px',
  },
  preview: {
    marginTop: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
