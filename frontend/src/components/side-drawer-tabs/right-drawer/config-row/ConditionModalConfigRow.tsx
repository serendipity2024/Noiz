/* eslint-disable import/no-default-export */
/* eslint-disable no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-prototype-builtins */
import { ArrowRightOutlined, MoreOutlined } from '@ant-design/icons';
import _ from 'lodash';
import React, { ReactElement, useState } from 'react';
import useLocale from '../../../../hooks/useLocale';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import Condition, { AllCondition } from '../../../../shared/type-definition/conditions/Condition';
import { AndExp, NotExp, OrExp } from '../../../../shared/type-definition/BoolExp';
import ConstantCondition, {
  ConstantConditionType,
} from '../../../../shared/type-definition/conditions/ConstantCondition';
import { ZThemedColors } from '../../../../utils/ZConst';
import { ConditionInputConfigRow } from './ConditionInputConfigRow';
import i18n from './ConditionModalConfigRow.i18n.json';
import { Modal, Collapse, Dropdown, ZMenu } from '../../../../zui';
import cssModule from './ConditionModalConfigRow.module.scss';

const ADD_ITEM = 'addItem';
const DELETE_SELF = 'deleteSelf';

const OR_CONDITION = 'orCondition';
const AND_CONDITION = 'andCondition';
const NOT_CONDITION = 'notCondition';
const CONDITION = 'condition';

export interface Prop {
  componentModel: BaseComponentModel;
  condition: AllCondition;
  onChange: (condition: AllCondition) => void;
}

export default function ConditionModalConfigRow(props: Prop): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel } = props;
  const [modelVisible, setModelVisible] = useState<boolean>(false);

  const condition = _.cloneDeep(props.condition);

  return (
    <>
      <div
        style={styles.itemContainer}
        onClick={() => {
          setModelVisible(true);
        }}
      >
        <div style={styles.itemLeft}>
          <div style={styles.itemTitle}>{content.label.condition}</div>
        </div>
        <ArrowRightOutlined />
      </div>
      <Modal
        title={content.label.setting}
        centered
        destroyOnClose
        visible={modelVisible}
        footer={null}
        onCancel={() => setModelVisible(false)}
      >
        <div style={styles.modalContainer}>
          <ConditionComponent
            id="Condition"
            defaultActive
            deletable={false}
            componentModel={componentModel}
            condition={condition}
            onChange={props.onChange}
          />
        </div>
      </Modal>
    </>
  );
}

export interface ConditionComponentProp {
  id: string;
  defaultActive: boolean;
  deletable: boolean;
  componentModel: BaseComponentModel;
  condition: AllCondition;
  onChange: (condition: AllCondition) => void;
  onDelete?: () => void;
}

function ConditionComponent(props: ConditionComponentProp): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { id, defaultActive, deletable, componentModel, condition, onChange } = props;
  const menuItems = [
    {
      key: OR_CONDITION,
      headerComponent: (
        <div onClick={() => onChange({ _or: [currentCondition] })}>{content.label.orCondition}</div>
      ),
    },
    {
      key: AND_CONDITION,
      headerComponent: (
        <div onClick={() => onChange({ _and: [currentCondition] })}>
          {content.label.andCondition}
        </div>
      ),
    },
    {
      key: NOT_CONDITION,
      headerComponent: (
        <div onClick={() => onChange({ _not: currentCondition })}>{content.label.notCondition}</div>
      ),
    },
  ];
  if (deletable)
    menuItems.push({
      key: DELETE_SELF,
      headerComponent: (
        <div
          onClick={() => {
            if (props.onDelete) {
              props.onDelete();
            }
          }}
        >
          {content.label.deleteSelf}
        </div>
      ),
    });

  const renderMenuComponent = () => {
    return (
      <div onClick={(e) => e.stopPropagation()}>
        <Dropdown overlay={<ZMenu items={menuItems} />} trigger={['click']} placement="bottomRight">
          <MoreOutlined style={styles.moreIcon} />
        </Dropdown>
      </div>
    );
  };

  const renderConditionsComponent = (params: {
    id: string;
    name:
      | typeof ADD_ITEM
      | typeof DELETE_SELF
      | typeof OR_CONDITION
      | typeof AND_CONDITION
      | typeof OR_CONDITION
      | typeof CONDITION;
    conditions: AllCondition[];
    onAdd: () => void;
    onDelete: (index: number) => void;
    onChange: (newCondition: AllCondition, index: number) => void;
    onConvertToCondition: (condition: AllCondition) => void;
  }) => {
    const { id, name, conditions, onAdd, onDelete, onChange, onConvertToCondition } = params;
    const menuItems = [
      {
        key: ADD_ITEM,
        headerComponent: <div onClick={() => onAdd()}>{content.label.addItem}</div>,
      },
    ];
    if (deletable)
      menuItems.push({
        key: DELETE_SELF,
        headerComponent: (
          <div
            onClick={() => {
              if (props.onDelete) {
                props.onDelete();
              }
            }}
          >
            {content.label.deleteSelf}
          </div>
        ),
      });
    if (conditions.length > 0)
      menuItems.push({
        key: CONDITION,
        headerComponent: (
          <div onClick={() => onConvertToCondition(conditions[0])}>{content.label.condition}</div>
        ),
      });

    return (
      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        key={`${id}_${name}`}
        className={cssModule.collapse}
        defaultOpenIndex={defaultActive ? 0 : -1}
        items={[
          {
            title: content.label[name] ?? name,
            icon: (
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown
                  overlay={<ZMenu items={menuItems} />}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <MoreOutlined style={styles.moreIcon} />
                </Dropdown>
              </div>
            ),
            content: (
              <>
                {conditions?.map((con, cIndex) => (
                  <div key={`${cIndex}`}>
                    <ConditionComponent
                      id={`${cIndex}`}
                      defaultActive={false}
                      deletable
                      componentModel={componentModel}
                      condition={con}
                      onDelete={() => onDelete(cIndex)}
                      onChange={(newCondition) => onChange(newCondition, cIndex)}
                    />
                  </div>
                ))}
              </>
            ),
          },
        ]}
      />
    );
  };

  const renderNotConditionComponent = (params: {
    id: string;
    notCondition: NotExp<Condition>;
    onChange: (notCondition: NotExp<Condition>) => void;
    onConvertToCondition: (condition: AllCondition) => void;
  }) => {
    const { id, notCondition, onChange, onConvertToCondition } = params;
    const menuItems = [
      {
        key: CONDITION,
        headerComponent: (
          <div onClick={() => onConvertToCondition(notCondition._not)}>
            {content.label.condition}
          </div>
        ),
      },
    ];
    if (deletable)
      menuItems.push({
        key: DELETE_SELF,
        headerComponent: (
          <div
            onClick={() => {
              if (props.onDelete) {
                props.onDelete();
              }
            }}
          >
            {content.label.deleteSelf}
          </div>
        ),
      });

    return (
      <Collapse
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        key={`${id}_${NOT_CONDITION}`}
        className={cssModule.collapse}
        defaultOpenIndex={defaultActive ? 0 : -1}
        items={[
          {
            title: content.label.notCondition,
            icon: (
              <div onClick={(e) => e.stopPropagation()}>
                <Dropdown
                  overlay={<ZMenu items={menuItems} />}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <MoreOutlined style={styles.moreIcon} />
                </Dropdown>
              </div>
            ),
            content: (
              <ConditionComponent
                id={NOT_CONDITION}
                defaultActive={false}
                deletable={false}
                componentModel={componentModel}
                condition={notCondition._not}
                onChange={(newCondition) => onChange({ _not: newCondition })}
              />
            ),
          },
        ]}
      />
    );
  };

  if (condition.hasOwnProperty('_and')) {
    const andCondition = condition as AndExp<Condition>;
    const and = andCondition._and ?? [];
    return renderConditionsComponent({
      id,
      name: AND_CONDITION,
      conditions: and,
      onAdd: () => {
        onChange({
          _and: [...and, ConstantCondition.from(ConstantConditionType.ALWAYS)],
        });
      },
      onDelete: (currentIndex) => {
        onChange({
          _and: and.filter((_, index) => index !== currentIndex),
        });
      },
      onChange: (newCondition, currentIndex) => {
        onChange({
          _and: and.map((oldCondition, index) =>
            index === currentIndex ? newCondition : oldCondition
          ),
        });
      },
      onConvertToCondition: (condition) => {
        onChange(condition);
      },
    });
  }
  if (condition.hasOwnProperty('_or')) {
    const orCondition = condition as OrExp<Condition>;
    const or = orCondition._or ?? [];
    return renderConditionsComponent({
      id,
      name: OR_CONDITION,
      conditions: or,
      onAdd: () => {
        onChange({
          _or: [...or, ConstantCondition.from(ConstantConditionType.ALWAYS)],
        });
      },
      onDelete: (currentIndex) => {
        onChange({
          _or: or.filter((_, index) => index !== currentIndex),
        });
      },
      onChange: (newCondition, currentIndex) => {
        onChange({
          _or: or.map((oldCondition, index) =>
            index === currentIndex ? newCondition : oldCondition
          ),
        });
      },
      onConvertToCondition: (condition) => {
        onChange(condition);
      },
    });
  }
  if (condition.hasOwnProperty('_not')) {
    const notCondition = condition as NotExp<Condition>;
    return renderNotConditionComponent({
      id,
      notCondition,
      onChange: (newCondition) => {
        onChange(newCondition);
      },
      onConvertToCondition: (newCondition) => {
        onChange(newCondition);
      },
    });
  }
  const currentCondition: Condition = condition as Condition;
  return (
    <Collapse
      key={`${id}_${CONDITION}`}
      className={cssModule.collapse}
      defaultOpenIndex={defaultActive ? 0 : -1}
      bordered
      setContentFontColorToOrangeBecauseHistoryIsCruel
      items={[
        {
          title: content.label.condition,
          icon: (
            <>{currentCondition.type !== ConstantConditionType.DEFAULT && renderMenuComponent()}</>
          ),
          content: (
            <ConditionInputConfigRow
              model={componentModel}
              condition={currentCondition}
              onSave={onChange}
            />
          ),
        },
      ]}
    />
  );
}

const styles: Record<string, React.CSSProperties> = {
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: ZThemedColors.SECONDARY,
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
  modalContainer: {
    maxHeight: '600px',
    overflow: 'auto',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  moreIcon: {
    fontSize: '20px',
    color: 'rgb(158, 158, 158)',
    padding: '5px',
  },
};
