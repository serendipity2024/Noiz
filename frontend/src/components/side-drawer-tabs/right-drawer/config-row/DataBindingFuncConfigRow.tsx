/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
import { DeleteOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import * as _ from 'lodash/fp';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import uniqid from 'uniqid';
import {
  DataBinding,
  DataCondition,
  DataConditionType,
} from '../../../../shared/type-definition/DataBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import SharedStyles from './SharedStyles';
import i18n from './DataBindingFuncConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import { Cascader, Divider, Dropdown, Input, Modal, Row } from '../../../../zui';

export interface DataBindingFunction {
  name: string;
  function: () => void;
}

interface Props {
  title: string;
  dataBinding: DataBinding;
  arrayElementMappingEnabled?: boolean;
  onDelete?: () => void;
  onSave: (dataBinding: DataBinding) => void;
  onSwicthArrayElementMapping?: () => void;
  contextMenuFunctions?: DataBindingFunction[];
}

export default observer(function DataBindingFuncConfigRow(props: Props): NullableReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { title, dataBinding } = props;

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [conditionsToVerify, setConditionsToVerify] = useState<DataCondition[]>(
    _.cloneDeep(dataBinding.conditionsToVerify ?? [])
  );

  function onSave() {
    dataBinding.conditionsToVerify =
      conditionsToVerify.filter((e) => {
        if (e.conditionType === DataConditionType.REGEX) {
          return e.regExp && e.errorMessage;
        }
        return e.errorMessage;
      }) ?? [];
    props.onSave(dataBinding);
    setModalVisible(false);
  }

  function addNewError(conditionType: DataConditionType) {
    setConditionsToVerify([
      ...conditionsToVerify,
      {
        conditionId: uniqid.process(),
        conditionType,
      },
    ]);
  }

  function onDeleteError(conditionId: string) {
    const newErrors = conditionsToVerify.filter((e) => e.conditionId !== conditionId);
    setConditionsToVerify(newErrors);
  }

  function onValueChange(value: string, conditionId: string) {
    const newErrors = conditionsToVerify.map((e) => {
      if (e.conditionId === conditionId) {
        e.errorMessage = value;
      }
      return e;
    });
    setConditionsToVerify(newErrors);
  }

  function onRegExpChange(value: string, conditionId: string) {
    const newErrors = conditionsToVerify.map((e) => {
      if (e.conditionId === conditionId) {
        e.regExp = value;
      }
      return e;
    });
    setConditionsToVerify(newErrors);
  }

  function renderConfigModalComponent() {
    return (
      <Modal
        title={title}
        centered
        destroyOnClose
        visible={modalVisible}
        onCancel={() => {
          setConditionsToVerify(dataBinding.conditionsToVerify ?? []);
          setModalVisible(false);
        }}
        onOk={() => onSave()}
        okText={content.modal.ok}
        cancelText={content.modal.cancel}
      >
        <Row align="middle" justify="space-between" style={styles.rowContainer}>
          <div style={styles.promptContanier}>{content.modal.inputCondition}</div>
          <Cascader
            options={Object.values(DataConditionType).map((e) => ({
              value: e,
              label: content.modal.condition[e] ?? e,
              isLeaf: true,
            }))}
            onChange={(value) => addNewError(value[0] as DataConditionType)}
          >
            <div style={styles.buttonContainer}>
              <PlusOutlined />
            </div>
          </Cascader>
        </Row>
        {conditionsToVerify.length > 0 ? (
          conditionsToVerify.map((condition) => (
            <div key={condition.conditionId} style={styles.errorContainer}>
              <Row align="middle" justify="space-between" style={styles.rowContainer}>
                <ZConfigRowTitle
                  text={content.modal.condition[condition.conditionType] ?? condition.conditionType}
                />
                <div
                  style={styles.buttonContainer}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteError(condition.conditionId);
                  }}
                >
                  <DeleteOutlined />
                </div>
              </Row>
              {condition.conditionType === DataConditionType.REGEX ? (
                <Input
                  size="large"
                  style={styles.regExp}
                  placeholder={content.modal.placeholder}
                  addonBefore={content.modal.conditionRegex}
                  value={condition.regExp}
                  onChange={(e) => onRegExpChange(e.target.value, condition.conditionId)}
                />
              ) : null}
              <Input
                size="large"
                placeholder={content.modal.placeholder}
                addonBefore={content.modal.errorMessage}
                value={condition.errorMessage}
                onChange={(e) => onValueChange(e.target.value, condition.conditionId)}
              />
            </div>
          ))
        ) : (
          <div style={styles.emptyContent}>
            <span style={SharedStyles.configRowTitleText}>{content.modal.noPrompt}</span>
          </div>
        )}
      </Modal>
    );
  }

  return (
    <>
      <Dropdown
        overlay={
          <div style={styles.funcContanier}>
            <div style={styles.funcButton} onClick={() => setModalVisible(true)}>
              {content.operation.addVerification}
            </div>
            {props.onDelete && (
              <>
                <Divider style={styles.divider} />
                <div
                  style={styles.funcButton}
                  onClick={() => {
                    if (props.onDelete) {
                      props.onDelete();
                    }
                  }}
                >
                  {content.operation.delete}
                </div>
              </>
            )}
            {props.arrayElementMappingEnabled && (
              <>
                <Divider style={styles.divider} />
                <div
                  style={styles.funcButton}
                  onClick={() => {
                    if (props.onSwicthArrayElementMapping) {
                      props.onSwicthArrayElementMapping();
                    }
                  }}
                >
                  {content.operation.switch}
                </div>
              </>
            )}
            {(props.contextMenuFunctions ?? []).map((element) => (
              <div key={element.name}>
                <Divider style={styles.divider} />
                <div style={styles.funcButton} onClick={element.function}>
                  {element.name}
                </div>
              </div>
            ))}
          </div>
        }
        trigger={['click']}
        placement="bottomRight"
      >
        <MoreOutlined style={styles.moreIcon} />
      </Dropdown>
      {renderConfigModalComponent()}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  moreIcon: {
    fontSize: '20px',
    color: 'rgb(158, 158, 158)',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  promptContanier: {
    fontSize: '17px',
  },
  rowContainer: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  emptyContent: {
    borderWidth: '1px',
    borderColor: ZThemedColors.PRIMARY_TEXT,
    borderRadius: '5px',
    borderStyle: 'dashed',
    width: '100%',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  errorContainer: {
    marginBottom: '10px',
  },
  regExp: {
    marginBottom: '10px',
  },
  funcContanier: {
    backgroundColor: 'white',
    paddingLeft: '10px',
    paddingRight: '10px',
  },
  funcButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  divider: {
    margin: 0,
  },
};
