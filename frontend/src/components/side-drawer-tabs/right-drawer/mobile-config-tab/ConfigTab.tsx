/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import i18n from './ConfigTab.i18n.json';
import useLocale from '../../../../hooks/useLocale';
import './ConfigTab.scss';
import useStores from '../../../../hooks/useStores';
import { Tabs } from '../../../../zui';

const { TabPane } = Tabs;

interface Props<T extends BaseComponentModel> {
  model: T;
  DataConfigTab: ({ model }: { model: T }) => JSX.Element;
  StyleConfigTab: ({ model }: { model: T }) => JSX.Element;
  ActionConfigTab: ({ model }: { model: T }) => JSX.Element;
}

// TODO: scss style
export default observer(function ConfigTab<T extends BaseComponentModel>(props: Props<T>) {
  const { DataConfigTab, StyleConfigTab, ActionConfigTab, model } = props;
  const { editorStore } = useStores();
  const { localizedContent: content } = useLocale(i18n);
  return (
    <Tabs
      className="config-tab"
      activeKey={editorStore.configTab}
      onChange={(key) => {
        editorStore.configTab = key as 'style' | 'data' | 'action';
      }}
    >
      <TabPane tab={content.label.style} key="style">
        <StyleConfigTab model={model} />
      </TabPane>
      <TabPane tab={content.label.data} key="data">
        <DataConfigTab model={model} />
      </TabPane>
      <TabPane tab={content.label.action} key="action">
        <ActionConfigTab model={model} />
      </TabPane>
    </Tabs>
  );
});
