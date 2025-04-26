/* eslint-disable import/no-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-param-reassign */
import { ArrowRightOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import React from 'react';
import { UserFlow, useSelectionTrigger } from '../../../../hooks/useUserFlowTrigger';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import ComponentModelBuilder from '../../../../models/ComponentModelBuilder';
import { ComponentModelType } from '../../../../shared/type-definition/ComponentModelType';
import { DataBinding } from '../../../../shared/type-definition/DataBinding';
import {
  EventBinding,
  EventType,
  ModalViewMode,
  ShowModalHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import ConfigInput from '../shared/ConfigInput';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import ClickActionConfigRow, { getWithDefaultActions } from '../config-row/ClickActionConfigRow';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './ShowModalActionRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { DiffItem } from '../../../../shared/type-definition/Diff';
import ComponentDiff from '../../../../diffs/ComponentDiff';
import { AllStores } from '../../../../mobx/StoreContexts';
import { ZThemedColors } from '../../../../utils/ZConst';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function ShowModalActionRow(props: Props) {
  const { localizedContent: content } = useLocale(i18n);
  const uft = useSelectionTrigger();
  const showModalEvent: ShowModalHandleBinding = props.event as ShowModalHandleBinding;

  function onSaveValue(
    filed: 'title' | 'detail' | 'cancelTitle' | 'confirmTitle' | 'confirmActions',
    value: any
  ) {
    showModalEvent[filed] = value;
    props.onEventChange();
  }

  function onSelectMode(mode: ModalViewMode) {
    let diffItems: DiffItem[] = [];
    switch (mode) {
      case ModalViewMode.ALERT: {
        if (showModalEvent.modalViewMRef) {
          diffItems = getDeleteCustomModalViewDiffItems(showModalEvent);
          showModalEvent.title = '';
          showModalEvent.detail = DataBinding.withTextVariable();
          showModalEvent.cancelTitle = 'CANCEL';
          showModalEvent.confirmTitle = 'OK';
          showModalEvent.confirmActions = [];
          showModalEvent.modalViewMRef = undefined;
        }
        break;
      }
      case ModalViewMode.CUSTOM: {
        if (showModalEvent.modalViewMRef === undefined) {
          const customModalView = ComponentModelBuilder.buildByType(
            props.componentModel.mRef,
            ComponentModelType.MODAL_VIEW
          );
          showModalEvent.modalViewMRef = customModalView.mRef;
          diffItems = [
            ComponentDiff.buildAddComponentDiff(customModalView),
            ComponentDiff.buildAddRelatedMRefsDiff(props.componentModel.mRef, [
              customModalView.mRef,
            ]),
          ];
        }
        break;
      }
      default:
        throw new Error(`unsupported ModalViewMode, ${JSON.stringify(showModalEvent)}`);
    }
    showModalEvent.mode = mode;
    props.componentModel.unexecutedDiffItems = diffItems;
    props.onEventChange();
  }

  return (
    <div>
      <ZConfigRowTitle text={content.label.mode} />
      <Select
        bordered={false}
        value={showModalEvent.mode}
        size="large"
        style={styles.iconSelect}
        onChange={onSelectMode}
      >
        {Object.values(ModalViewMode).map((value) => (
          <Select.Option key={value} value={value}>
            {content.mode[value] ?? value}
          </Select.Option>
        ))}
      </Select>
      {showModalEvent.mode === ModalViewMode.CUSTOM ? (
        <div
          style={styles.itemContainer}
          onClick={() => {
            if (showModalEvent.modalViewMRef) {
              uft(UserFlow.FOCUS_TARGET)(showModalEvent.modalViewMRef);
              uft(UserFlow.SELECT_TARGET)(showModalEvent.modalViewMRef);
            }
          }}
        >
          <div style={styles.itemLeft}>
            <div style={styles.itemTitle}>{content.label.editMode}</div>
          </div>
          <ArrowRightOutlined />
        </div>
      ) : (
        <>
          <ZConfigRowTitle text={content.label.title} />
          <ConfigInput
            value={showModalEvent.title}
            placeholder="Enter title..."
            style={styles.input}
            onSaveValue={(text) => onSaveValue('title', text)}
          />
          <DataBindingConfigRow
            title={content.label.content}
            componentModel={props.componentModel}
            dataBinding={showModalEvent.detail}
            onChange={(dataBinding) => onSaveValue('detail', dataBinding)}
          />
          <ZConfigRowTitle text={content.label.cancelText} />
          <ConfigInput
            value={showModalEvent.cancelTitle}
            placeholder="Enter cancelTitle..."
            style={styles.input}
            onSaveValue={(text) => onSaveValue('cancelTitle', text)}
          />
          <ZConfigRowTitle text={content.label.confirmText} />
          <ConfigInput
            value={showModalEvent.confirmTitle}
            placeholder="Enter confirmTitle..."
            style={styles.input}
            onSaveValue={(text) => onSaveValue('confirmTitle', text)}
          />
          <ZConfigRowTitle text={content.label.confirmActions} />
          <ClickActionConfigRow
            componentModel={props.componentModel}
            enabledActions={getWithDefaultActions([
              {
                type: EventType.SHOW_MODAL,
                enabled: false,
              },
            ])}
            eventList={showModalEvent.confirmActions}
            eventListOnChange={(eventList) => onSaveValue('confirmActions', eventList)}
          />
        </>
      )}
    </div>
  );
});

export const getDeleteCustomModalViewDiffItems = (event: ShowModalHandleBinding): DiffItem[] => {
  if (event.modalViewMRef) {
    const modelComponent = AllStores.coreStore.getModel(event.modalViewMRef);
    if (!modelComponent) {
      throw new Error(`modalViewMRef error, ${JSON.stringify(event)}`);
    }
    return [
      ...ComponentDiff.buildDeleteComponentDiffs(modelComponent),
      ComponentDiff.buildDeleteRelatedMRefsDiff(modelComponent.parentMRef, [modelComponent.mRef]),
    ];
  }
  return [];
};

const styles: Record<string, React.CSSProperties> = {
  iconSelect: {
    width: '100%',
    fontSize: '14px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    border: '0px',
    textAlign: 'center',
  },
  titleInput: {
    background: '#eee',
    height: '40px',
  },
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginTop: '10px',
    padding: '5px 10px',
    borderRadius: '5px',
  },
  itemLeft: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '88%',
  },
  itemTitle: {
    fontSize: '14px',
    color: '#aaa',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    wordBreak: 'break-all',
  },
  input: {
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
  },
};
