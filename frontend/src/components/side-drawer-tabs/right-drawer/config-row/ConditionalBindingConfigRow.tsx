/* eslint-disable import/no-default-export */
/* eslint-disable no-param-reassign */
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import uniqid from 'uniqid';
import { observer } from 'mobx-react';
import _ from 'lodash';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { ZColors, ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import SharedStyles from './SharedStyles';
import ConstantCondition, {
  ConstantConditionType,
} from '../../../../shared/type-definition/conditions/ConstantCondition';
import ConditionModalConfigRow from './ConditionModalConfigRow';
import ConfigInput from '../shared/ConfigInput';
import i18n from './ConditionalBindingConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import {
  ConditionalBinding,
  ConditionalData,
  DataBinding,
} from '../../../../shared/type-definition/DataBinding';
import DataBindingConfigRow from './DataBindingConfigRow';
import { Collapse, Row } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  conditionalBinding: ConditionalBinding;
  onConditionalBindingChange: (conditionalBinding: ConditionalBinding) => void;
}

export default observer(function ConditionalBindingConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, onConditionalBindingChange } = props;
  const conditionalBinding = _.cloneDeep(props.conditionalBinding);

  function addConditionalData() {
    const id = `${uniqid.process()}`;
    conditionalBinding.conditionalData.push({
      id,
      condition: ConstantCondition.from(ConstantConditionType.ALWAYS),
      value: DataBinding.withSingleValue(conditionalBinding.resultType),
    });
    onConditionalBindingChange(conditionalBinding);
  }

  function deleteConditionalData(condition: ConditionalData) {
    conditionalBinding.conditionalData = conditionalBinding.conditionalData.filter(
      (c) => c.id !== condition.id
    );
    onConditionalBindingChange(conditionalBinding);
  }

  return (
    <>
      <Row align="middle" justify="space-between" style={styles.container}>
        <div style={styles.conditionalTitle}>{content.label.conditionalData}</div>
        <div style={styles.buttonContainer} onClick={() => addConditionalData()}>
          <PlusOutlined />
        </div>
      </Row>
      {conditionalBinding.conditionalData.length > 0 ? (
        <Collapse
          bordered
          hideArrows
          setContentFontColorToOrangeBecauseHistoryIsCruel
          items={conditionalBinding.conditionalData.map((conditionalData) => ({
            title: conditionalData.name ?? conditionalData.id,
            icon: (
              <DeleteFilled
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConditionalData(conditionalData);
                }}
              />
            ),
            content: (
              <>
                <ZConfigRowTitle text={content.label.name} />
                <ConfigInput
                  value={conditionalData.name ?? conditionalData.id}
                  onSaveValue={(value) => {
                    conditionalData.name = value;
                    onConditionalBindingChange(conditionalBinding);
                  }}
                />
                <ConditionModalConfigRow
                  componentModel={props.componentModel}
                  condition={conditionalData.condition}
                  onChange={(newCondition) => {
                    conditionalData.condition = newCondition;
                    onConditionalBindingChange(conditionalBinding);
                  }}
                />
                <DataBindingConfigRow
                  title={content.label.data}
                  componentModel={componentModel}
                  dataBinding={conditionalData.value}
                  onChange={(value) => {
                    conditionalData.value = value;
                    onConditionalBindingChange(conditionalBinding);
                  }}
                />
              </>
            ),
          }))}
        />
      ) : (
        <div style={styles.content}>
          <span style={SharedStyles.configRowTitleText}>{content.label.noData}</span>
        </div>
      )}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  conditionalTitle: {
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  content: {
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
};
