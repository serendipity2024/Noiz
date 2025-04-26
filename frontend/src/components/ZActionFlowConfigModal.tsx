import { observer } from 'mobx-react';
import { ArrowLeftOutlined, DeleteFilled, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import uniqid from 'uniqid';
import React, { useState, useEffect } from 'react';
import { omit } from 'lodash';
import 'codemirror/mode/javascript/javascript';
import actionFlowCreateIcon from '../shared/assets/icons/action-flow-create.svg';
import { ActionFlow, RunCustomCode } from '../shared/type-definition/ActionFlow';
import useStores from '../hooks/useStores';
import { BaseType, ColumnTypes } from '../shared/type-definition/DataModel';
import { Variable } from '../shared/type-definition/DataBinding';
import useLocale from '../hooks/useLocale';
import PlusIcon from '../shared/assets/icons/plus.svg';
import i18n from './ZActionFlowConfigModal.i18n.json';
import { Field } from '../shared/type-definition/DataModelRegistry';
import styles from './ZActionFlowConfigModal.module.scss';
import useUserFlowTrigger, { UserFlow } from '../hooks/useUserFlowTrigger';
import { useMutations } from '../hooks/useMutations';
import {
  Button,
  Col,
  Collapse,
  List,
  Modal,
  Row,
  Select,
  Space,
  Tabs,
  Typography,
  ZInput,
} from '../zui';
import { LeftDrawerKey } from '../models/interfaces/EditorInfo';
import { CodeMirror } from '../utils/CodeMirrorWrapper';

const { TabPane } = Tabs;
const { Paragraph } = Typography;

enum TabKey {
  input = 'Input',
  output = 'Output',
}

interface ActionFlowItem {
  onClick: () => void;
  onChange: (text: string) => void;
  onDelete: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => void;
  active: boolean;
  data: ActionFlow;
}

const ActionFlowItem = (props: ActionFlowItem) => {
  const [editing, setEditing] = useState(false);
  return (
    <List.Item
      data-active={props.active}
      onClick={props.onClick}
      key={props.data.uniqueId}
      extra={
        <Space>
          <EditOutlined onClick={() => setEditing(true)} />
          <DeleteOutlined onClick={props.onDelete} />
        </Space>
      }
    >
      <Paragraph
        editable={{
          icon: <></>,
          editing,
          autoSize: false,
          onChange: (text) => {
            setEditing(false);
            props.onChange(text);
          },
        }}
      >
        {props.data.displayName}
      </Paragraph>
    </List.Item>
  );
};

export const ZActionFlowConfigModal = observer(() => {
  const { coreStore, editorStore } = useStores();
  const { actionFlowMutations } = useMutations();
  const [curActionFlowIndex, setCurActionFlowIndex] = useState<number>(0);
  const [listKey, setListKey] = useState<number>(0);
  const { localizedContent } = useLocale(i18n);
  const uft = useUserFlowTrigger();
  const actionFlow: ActionFlow | undefined = coreStore.actionFlows.length
    ? coreStore.actionFlows[curActionFlowIndex]
    : undefined;
  const [codeContent, setCodeContent] = useState('');

  useEffect(() => {
    setCodeContent(actionFlow ? (actionFlow.allNodes[0] as RunCustomCode).code : '');
  }, [actionFlow]);

  const [currentTab, setCurrentTab] = useState<string>(TabKey.input);

  const options: Field[] = ColumnTypes.map((element) => ({
    name: element as string,
    type: element as string,
    nullable: false,
  }));

  const addActionFlow = () => {
    actionFlowMutations.addActionFlow();
  };

  const renderTabPane = (key: TabKey, argName: 'inputArgs' | 'outputValues') => {
    return (
      <TabPane tab={localizedContent.tabs[key]} key={key} className={styles.inputPanel}>
        {actionFlow ? (
          <>
            {renderArgComponent(actionFlow, actionFlow.allNodes[0] as RunCustomCode, argName)}
            <div
              className={styles.addVariable}
              onClick={() => {
                if (!actionFlow) return;
                actionFlowMutations.updateVariableType(
                  actionFlow.uniqueId,
                  {
                    ...actionFlow[argName],
                    [`args${uniqid.process()}`]: {
                      type: BaseType.TEXT,
                      nullable: false,
                    },
                  },
                  argName
                );
              }}
            >
              <img alt="" src={PlusIcon} />
              <span>{localizedContent.tabs.add[key]}</span>
            </div>
          </>
        ) : (
          <p className={styles.argEmptyText}>{localizedContent.argEmpty}</p>
        )}
      </TabPane>
    );
  };

  const renderArgComponent = (
    block: ActionFlow,
    node: RunCustomCode,
    key: 'inputArgs' | 'outputValues'
  ) => {
    const { [key]: args } = node;
    const argsList = Object.entries(args);
    return argsList.length ? (
      <Collapse
        setContentFontColorToOrangeBecauseHistoryIsCruel
        items={argsList.map(([argName, argValue]: [string, Variable]) => ({
          title: argName,
          icon: (
            <DeleteFilled
              onClick={(e) => {
                e.stopPropagation();
                actionFlowMutations.updateVariableType(block.uniqueId, omit(args, argName), key);
              }}
            />
          ),
          content: (
            <div>
              <div className={styles.formItemSpace}>
                <span>{localizedContent.fieldName}</span>
                <div>
                  <ZInput
                    key={argName}
                    defaultValue={argName}
                    bordered
                    lightBackground
                    onBlur={(e) => {
                      const inputArgs = {
                        ...omit(args, argName),
                        [e.target.value]: args[argName],
                      };
                      actionFlowMutations.updateVariableType(block.uniqueId, inputArgs, key);
                    }}
                  />
                </div>
              </div>
              <div className={styles.formItemSpace}>
                <span>{localizedContent.type}</span>
                <Select
                  value={argValue.type}
                  dropdownMatchSelectWidth={false}
                  onSelect={(value) => {
                    const field = options.find((element) => element.type === value);
                    if (!field) return;
                    actionFlowMutations.updateVariableType(
                      block.uniqueId,
                      {
                        ...args,
                        [argName]: {
                          ...args[argName],
                          type: field.type,
                        },
                      },
                      key
                    );
                  }}
                >
                  {options.map((element) => (
                    <Select.Option key={element.type} value={element.type}>
                      {element.type}
                    </Select.Option>
                  ))}
                </Select>
              </div>
            </div>
          ),
        }))}
        bordered
      />
    ) : null;
  };

  return (
    <Modal
      visible={editorStore.selectedLeftDrawerKey === LeftDrawerKey.ACTION_FLOW}
      className={styles.modal}
      closable={false}
      footer={false}
    >
      <Row className={styles.topBar} justify="space-between">
        <Col
          onClick={() => {
            editorStore.selectedLeftDrawerKey = null;
          }}
        >
          <ArrowLeftOutlined className={styles.backIcon} />
        </Col>
        <Col>{localizedContent.actionFlow}</Col>
        <Col>
          <Button
            className={styles.primaryBtn}
            onClick={() => {
              uft(UserFlow.SAVE_PROJECT)();
              editorStore.selectedLeftDrawerKey = null;
            }}
          >
            {localizedContent.save}
          </Button>
        </Col>
      </Row>
      <div className={styles.container}>
        <div className={styles.containerLeft}>
          <div className={styles.listTitle}>
            <span>{localizedContent.actionFlow}</span>
            {coreStore.actionFlows.length ? (
              <div onClick={addActionFlow}>
                <img className={styles.addIcon} src={actionFlowCreateIcon} alt="" />
              </div>
            ) : null}
          </div>
          {coreStore.actionFlows.length ? (
            <List
              key={listKey}
              dataSource={[...coreStore.actionFlows]}
              className={styles.list}
              renderItem={(item, index) => (
                <ActionFlowItem
                  data={item}
                  active={curActionFlowIndex === index}
                  onDelete={(e) => {
                    e.stopPropagation();
                    actionFlowMutations.deleteActionFlow(item.uniqueId);
                    setCurActionFlowIndex(0);
                  }}
                  onClick={() => setCurActionFlowIndex(index)}
                  onChange={(text) => {
                    actionFlowMutations.updateActionFlow({
                      ...item,
                      displayName: text,
                    });
                    setListKey(listKey + 1);
                  }}
                />
              )}
            />
          ) : (
            <div className={styles.listEmpty}>
              <p className={styles.emptyText}>{localizedContent.listEmpty}</p>
              <Button type="ghost" className={styles.ghostBtn} onClick={addActionFlow}>
                {localizedContent.create}
              </Button>
            </div>
          )}
        </div>

        <div className={styles.containerRight}>
          <Tabs
            className={styles.tabParams}
            activeKey={currentTab}
            onChange={(actKey) => setCurrentTab(actKey)}
          >
            {renderTabPane(TabKey.input, 'inputArgs')}
            {renderTabPane(TabKey.output, 'outputValues')}
          </Tabs>
          <Tabs className={styles.tabCode}>
            <TabPane tab={localizedContent.tabs.Logic} style={{ padding: '24px' }}>
              <CodeMirror
                className={styles.logicTextArea}
                value={codeContent}
                onChange={setCodeContent}
                onBlur={() => {
                  if (!actionFlow) return;
                  actionFlowMutations.updateLogicCode(actionFlow.uniqueId, codeContent);
                }}
              />
            </TabPane>
          </Tabs>
        </div>
      </div>
    </Modal>
  );
});
