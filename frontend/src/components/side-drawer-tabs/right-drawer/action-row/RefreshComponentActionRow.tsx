/* eslint-disable import/no-default-export */
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import { CascaderOptionType } from 'antd/lib/cascader';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import uniqid from 'uniqid';
import useLocale from '../../../../hooks/useLocale';
import useScreenModels from '../../../../hooks/useScreenModels';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import {
  EventBinding,
  RefreshHandleBinding,
} from '../../../../shared/type-definition/EventBinding';
import { ZThemedColors } from '../../../../utils/ZConst';
import i18n from './RefreshComponentActionRow.i18n.json';
import { Button, Cascader, Row } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: EventBinding;
  onEventChange: () => void;
}

export default observer(function RefreshComponentActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const components = useScreenModels();
  const refreshEvent: RefreshHandleBinding = props.event as RefreshHandleBinding;
  const renderFollowUpEventComponent = (componentMRef: string, index: number) => {
    const componentHasQuery = (component: BaseContainerModel): boolean => {
      return (
        (component.queries?.length ?? 0) > 0 ||
        (component.thirdPartyQueries?.length ?? 0) > 0 ||
        (component.dataPathComponents?.length ?? 0) > 0
      );
    };

    const fields: CascaderOptionType[] = [];
    const value: string[] = [];

    components.forEach((screen) => {
      const children = [];
      const containerModels = StoreHelpers.findAllModelsWithLogicInContainer({
        container: screen,
        filter: (model) => {
          return model.isContainer && componentHasQuery(model as BaseContainerModel);
        },
      }) as BaseContainerModel[];
      containerModels.forEach((model) => {
        const cascaderSelectModel = {
          value: model.mRef,
          label: model.componentName,
          isLeaf: true,
        };
        children.push(cascaderSelectModel);
        if (model.mRef === componentMRef) {
          value.push(screen.mRef, model.mRef);
        }
      });
      if (componentHasQuery(screen)) {
        children.push({
          value: screen.mRef,
          label: screen.componentName,
          isLeaf: true,
        });
        if (screen.mRef === componentMRef) {
          value.push(screen.mRef, screen.mRef);
        }
      }

      const cascaderSelectModel: CascaderOptionType = {
        value: screen.mRef,
        label: screen.componentName,
        children,
      };
      if (children.length > 0) fields.push(cascaderSelectModel);
    });

    if (componentMRef.trim().length > 0 && value.length === 0) {
      refreshEvent.refreshList = refreshEvent.refreshList.map(
        (e, elementIndex) => (index !== elementIndex ? e : '') as string
      );
      props.onEventChange();
    }
    return (
      <Row justify="center" align="middle" style={styles.container} key={uniqid.process()}>
        <Cascader
          style={styles.cascader}
          options={fields}
          placeholder={content.placeholder}
          defaultValue={value}
          onChange={(_, selectedOptions) => {
            if (selectedOptions && selectedOptions.length > 0) {
              const selectOption = selectedOptions[selectedOptions.length - 1];
              refreshEvent.refreshList = refreshEvent.refreshList.map(
                (e, elementIndex) =>
                  (index !== elementIndex ? e : selectOption.value ?? '') as string
              );
              props.onEventChange();
            } else {
              refreshEvent.refreshList[index] = '';
            }
          }}
        />
        <DeleteFilled
          onClick={(e) => {
            e.stopPropagation();
            refreshEvent.refreshList = refreshEvent.refreshList.filter((_, elementIndex) => {
              return index !== elementIndex;
            });
            props.onEventChange();
          }}
        />
      </Row>
    );
  };
  return (
    <div>
      {refreshEvent.refreshList.map(renderFollowUpEventComponent)}
      <div style={styles.buttonContainer}>
        <Button
          icon={<PlusOutlined />}
          type="link"
          style={styles.addFollowUpButton}
          onClick={() => {
            refreshEvent.refreshList = [...refreshEvent.refreshList, ''];
            props.onEventChange();
          }}
        >
          {content.label.add}
        </Button>
      </div>
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '15px',
  },
  cascader: {
    marginRight: '20px',
    width: '82%',
    borderRadius: '6px',
    background: ZThemedColors.PRIMARY,
    border: '0px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  addFollowUpButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
    color: ZThemedColors.ACCENT,
  },
};
