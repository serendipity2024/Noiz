/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import { observer } from 'mobx-react';
import { DeleteFilled } from '@ant-design/icons/lib/icons';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import { Field } from '../../../../shared/type-definition/DataModelRegistry';
import { CascaderSelectModel } from '../../../../models/antd/CascaderSelectModel';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import {
  TableFilterExp,
  ColumnValueExp,
  ColumnFilterExp,
  GenericOperator,
  Operator,
  alwaysTrueFilter,
} from '../../../../shared/type-definition/TableFilterExp';
import { AndExp, NotExp, OrExp } from '../../../../shared/type-definition/BoolExp';
import { DataBinding, PathComponent } from '../../../../shared/type-definition/DataBinding';
import { BaseType } from '../../../../shared/type-definition/DataModel';
import {
  fetchFieldItemType,
  GraphQLRequestBinding,
} from '../../../../shared/type-definition/EventBinding';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';
import DataBindingConfigRow from './DataBindingConfigRow';
import SharedStyles from './SharedStyles';
import CustomCascaderConfigRow, { convertFieldToOption } from './CustomCascaderConfigRow';
import i18n from './RequestFilterConfigRow.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import HackCenter from '../../../../utils/HackCenter';
import { ZTypeSystem } from '../../../../utils/ZTypeSystem';
import ColumnOperatorSelectConfigRow from './ColumnOperatorSelectConfigRow';
import DataBindingHelper from '../../../../utils/DataBindingHelper';
import { Collapse, Row, Select } from '../../../../zui';

const ALWAYS_TRUE = 'always-true';
const AND_EXP = 'and-exp';

interface Props {
  request: GraphQLRequestBinding;
  componentModel: BaseComponentModel;
  onRequestChange: (request: GraphQLRequestBinding) => void;
  filterRemoteId?: string;
}

export default observer(function RequestFilterConfigRow(props: Props): NullableReactElement {
  const { componentModel, request, onRequestChange, filterRemoteId } = props;
  const { localizedContent: content } = useLocale(i18n);
  const { dataModelRegistry } = useDataModelMetadata();

  if (request.operation === 'insert') {
    return null;
  }

  const rootFieldType: string = fetchFieldItemType(request);
  const requestField: Field | undefined = dataModelRegistry
    .getQueries()
    .find((e: Field) => e.type === rootFieldType);
  const cascaderOptions: CascaderSelectModel[] =
    requestField?.where?.map((e) => convertFieldToOption(e, dataModelRegistry, false)) ?? [];
  const isAndExp = !!(request.where as AndExp<ColumnFilterExp>)?._and;

  return (
    <>
      <div style={styles.filterType}>{content.label.filterType}</div>
      <Select
        size="large"
        bordered={false}
        style={styles.select}
        value={isAndExp ? AND_EXP : ALWAYS_TRUE}
        onChange={(value) => {
          if (value === ALWAYS_TRUE) {
            request.where = alwaysTrueFilter;
            request.isWhereError = false;
          } else {
            request.where = {
              _and: [],
            };
            request.isWhereError = true;
          }
          onRequestChange(request);
        }}
      >
        <Select.Option key={ALWAYS_TRUE} value={ALWAYS_TRUE}>
          {ALWAYS_TRUE}
        </Select.Option>
        <Select.Option key={AND_EXP} value={AND_EXP}>
          {AND_EXP}
        </Select.Option>
      </Select>
      {isAndExp ? (
        <BoolExpConfigRow
          filterRemoteId={filterRemoteId}
          request={request}
          componentModel={componentModel}
          onValueChange={(boolExpList) => {
            // hack media id
            request.where = {
              _and: boolExpList.map((boolExp) => HackCenter.hackMediaBoolExp(boolExp)),
            };
            request.isWhereError = boolExpList.length <= 0;
            onRequestChange(request);
          }}
          isNotExp={false}
          boolExpList={(request.where as AndExp<ColumnFilterExp>)?._and ?? []}
          cascaderOptions={cascaderOptions}
        />
      ) : (
        <Row align="middle" justify="center" style={styles.container}>
          <div>{content.message.alwaysTrue}</div>
        </Row>
      )}
    </>
  );
});

interface BoolExpProps {
  request: GraphQLRequestBinding;
  componentModel: BaseComponentModel;

  isNotExp: boolean;
  cascaderOptions: CascaderSelectModel[];
  boolExpList: TableFilterExp[];
  onValueChange: (boolExpList: TableFilterExp[]) => void;
  filterRemoteId?: string;
}

const BoolExpConfigRow = observer((props: BoolExpProps): NullableReactElement => {
  const { localizedContent: content } = useLocale(i18n);
  const { componentModel, request, boolExpList, cascaderOptions, onValueChange, filterRemoteId } =
    props;

  if (!request.rootFieldType) {
    return boolExpList.length > 0 ? <>{renderBoolExpComponent()}</> : null;
  }

  function onCascaderChange(selectedOptions: CascaderSelectModel[]) {
    if (selectedOptions.length <= 0) return;
    const lastNodeObject = selectedOptions[selectedOptions.length - 1];
    onValueChange([
      ...boolExpList,
      {
        op: GenericOperator.EQ,
        value: DataBinding.withSingleValue(lastNodeObject.type ?? BaseType.TEXT),
        pathComponents: selectedOptions.map((e) => ({
          type: e.type ?? '',
          name: e.value,
        })),
      },
    ]);
  }

  function renderBoolExpComponent() {
    return boolExpList.map((boolExp, index) => {
      if (boolExp.hasOwnProperty('_and')) {
        const andExp = boolExp as AndExp<ColumnFilterExp>;
        return renderCollapseComponent({
          index,
          title: content.label.and,
          onDelete: () => onValueChange(boolExpList.filter((_, eIndex) => index !== eIndex) ?? []),
          children: (
            <BoolExpConfigRow
              request={request}
              componentModel={componentModel}
              onValueChange={(list) => {
                onValueChange(
                  boolExpList.map((be, beIndex) =>
                    beIndex === index
                      ? {
                          _and: list,
                        }
                      : be
                  )
                );
              }}
              isNotExp={false}
              boolExpList={andExp?._and ?? []}
              cascaderOptions={cascaderOptions}
            />
          ),
        });
      }
      if (boolExp.hasOwnProperty('_or')) {
        const orExp = boolExp as OrExp<ColumnFilterExp>;
        return renderCollapseComponent({
          index,
          title: content.label.or,
          onDelete: () => onValueChange(boolExpList.filter((_, eIndex) => index !== eIndex) ?? []),
          children: (
            <BoolExpConfigRow
              request={request}
              componentModel={componentModel}
              onValueChange={(list) => {
                onValueChange(
                  boolExpList.map((be, beIndex) =>
                    beIndex === index
                      ? {
                          _or: list,
                        }
                      : be
                  )
                );
              }}
              isNotExp={false}
              boolExpList={orExp?._or ?? []}
              cascaderOptions={cascaderOptions}
            />
          ),
        });
      }
      if (boolExp.hasOwnProperty('_not')) {
        const notExp = boolExp as NotExp<ColumnFilterExp>;
        return renderCollapseComponent({
          index,
          title: content.label.not,
          onDelete: () => onValueChange(boolExpList.filter((_, eIndex) => index !== eIndex) ?? []),
          children: (
            <BoolExpConfigRow
              request={request}
              componentModel={componentModel}
              onValueChange={(list) => {
                if (list.length <= 0) {
                  onValueChange(boolExpList.filter((be, beIndex) => beIndex !== index));
                } else {
                  onValueChange(
                    boolExpList.map((be, beIndex) =>
                      beIndex === index
                        ? {
                            _not: list[0],
                          }
                        : be
                    )
                  );
                }
              }}
              isNotExp
              boolExpList={[notExp._not]}
              cascaderOptions={cascaderOptions}
            />
          ),
        });
      }
      const columnValueExp: ColumnValueExp = boolExp as ColumnValueExp;
      return renderColumnValueExpComponent(columnValueExp, index);
    });
  }

  function renderColumnValueExpComponent(columnValueExp: ColumnValueExp, index: number) {
    const title =
      columnValueExp.pathComponents?.map((e: PathComponent) => e.name).join('/') ?? undefined;

    const filterValuesByType = (valueType: string) => {
      // TODO(geoff): This casts a nullable type to non-null.
      const operator = columnValueExp.op as Operator;
      const filterRes = ZTypeSystem.filterParameterTypesForBinaryOp(
        [valueType],
        'BOOLEAN',
        operator,
        columnValueExp.value.type,
        null
      );
      if (!filterRes) return null;

      return filterRes.rightTypes.includes(valueType);
    };

    return (
      <div key={`${title}_${index}`} style={styles.itemSpace}>
        <DataBindingConfigRow
          title={title}
          componentModel={componentModel}
          dataBinding={columnValueExp.value}
          filterValuesByType={filterValuesByType}
          filterRemoteId={filterRemoteId}
          displayValueComponent={!DataBindingHelper.isNullOrNotNull(columnValueExp.op)}
          operatorSelectionComponent={
            <ColumnOperatorSelectConfigRow
              columnExp={columnValueExp}
              onColumnExpChange={(value) => {
                onValueChange(boolExpList.map((e, eIndex) => (eIndex === index ? value : e)) ?? []);
              }}
            />
          }
          onChange={(dataBinding) => {
            columnValueExp.value = dataBinding;
            onValueChange(boolExpList);
          }}
          onDelete={() => {
            onValueChange(boolExpList.filter((e, eIndex) => index !== eIndex) ?? []);
          }}
          contextMenuFunctions={[
            {
              name: content.label.or,
              function: () => {
                onValueChange(
                  boolExpList.map((e, eIndex) => (eIndex === index ? { _or: [e] } : e)) ?? []
                );
              },
            },
            {
              name: content.label.and,
              function: () => {
                onValueChange(
                  boolExpList.map((e, eIndex) => (eIndex === index ? { _and: [e] } : e)) ?? []
                );
              },
            },
            {
              name: content.label.not,
              function: () => {
                onValueChange(
                  boolExpList.map((e, eIndex) => (eIndex === index ? { _not: e } : e)) ?? []
                );
              },
            },
          ]}
        />
      </div>
    );
  }

  function renderCollapseComponent(params: {
    index: number;
    title: string;
    children: ReactElement;
    onDelete: () => void;
  }) {
    return (
      <Collapse
        key={`${params.title}_${params.index}`}
        bordered
        setContentFontColorToOrangeBecauseHistoryIsCruel
        items={[
          {
            title: params.title,
            icon: (
              <DeleteFilled
                onClick={(e): void => {
                  e.stopPropagation();
                  params.onDelete();
                }}
              />
            ),
            content: params.children,
          },
        ]}
      />
    );
  }

  return cascaderOptions.length > 0 ? (
    <>
      {!props.isNotExp && (
        <Row align="middle" justify="space-between" style={styles.container}>
          <div style={styles.filterTitle}>{content.label.filter}</div>
          <div onClick={(e) => e.stopPropagation()}>
            <CustomCascaderConfigRow
              cascaderOptions={cascaderOptions}
              arrayAggregate={false}
              onCascaderChange={(_unused, selectedOptions) => {
                if (selectedOptions !== null) {
                  onCascaderChange(selectedOptions as CascaderSelectModel[]);
                }
              }}
            />
          </div>
        </Row>
      )}
      {boolExpList.length > 0 ? (
        renderBoolExpComponent()
      ) : (
        <div style={styles.content}>
          <span style={SharedStyles.configRowTitleText}>{content.label.noFilter}</span>
        </div>
      )}
    </>
  ) : null;
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    marginTop: '10px',
    marginBottom: '10px',
  },
  itemSpace: {
    marginBottom: '15px',
  },
  addButton: {
    borderWidth: 0,
    width: '100%',
    height: '45px',
    textAlign: 'center',
    boxShadow: '0 0 0 0',
    WebkitBoxShadow: '0 0 0 0',
    backgroundColor: 'transparent',
    font: '13px',
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
  filterType: {
    margin: '10px 5px',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  filterTitle: {
    color: ZColors.WHITE,
    opacity: '0.5',
  },
  buttonContainer: {
    marginRight: '-5px',
    paddingLeft: '5px',
    paddingRight: '5px',
  },
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    textAlign: 'center',
  },
};
