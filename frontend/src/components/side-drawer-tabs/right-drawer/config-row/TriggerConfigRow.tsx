/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import uniqid from 'uniqid';
import useDataModelMetadata from '../../../../hooks/useDataModelMetadata';
import useLocale from '../../../../hooks/useLocale';
import { GraphQLModel } from '../../../../shared/type-definition/DataModelRegistry';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import { ActionConfigMode } from '../../../../models/interfaces/EventModel';
import {
  EventType,
  GraphQLRequestBinding,
  TRIGGER_BINDING,
} from '../../../../shared/type-definition/EventBinding';
import { ZColors } from '../../../../utils/ZConst';
import ClickActionConfigRow from './ClickActionConfigRow';
import i18n from './TriggerConfigRow.i18n.json';

interface Props {
  componentModel: BaseComponentModel;
  requestHandleBinding: GraphQLRequestBinding;
  triggerOnChange: () => void;
}

export default observer(function TriggerConfigRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { dataModelRegistry } = useDataModelMetadata();

  const { componentModel, requestHandleBinding } = props;
  const triggers = requestHandleBinding.triggers ?? [];

  const rootFieldColumns: string[] =
    (
      dataModelRegistry.getGraphQLModel(requestHandleBinding.rootFieldType) as GraphQLModel
    )?.fields.map((e) => e.name) ?? [];

  return (
    <>
      <div style={styles.title}>{content.label.trigger}</div>
      <ClickActionConfigRow
        componentModel={componentModel}
        configMode={ActionConfigMode.TRIGGER}
        enabledActions={[
          {
            type: EventType.MUTATION,
            enabled: true,
          },
          {
            type: EventType.WECHAT_NOTIFICATION,
            enabled: true,
          },
          {
            type: EventType.SMS_NOTIFICATION,
            enabled: true,
          },
          {
            type: EventType.SET_PAGE_DATA,
            enabled: true,
          },
        ]}
        eventList={triggers.map((e) => (e.type === TRIGGER_BINDING ? e.value : e))}
        eventListOnChange={(eventList) => {
          requestHandleBinding.triggers = eventList.map((event) =>
            event.type === EventType.WECHAT_NOTIFICATION ||
            event.type === EventType.SMS_NOTIFICATION
              ? event
              : {
                  type: TRIGGER_BINDING,
                  id: uniqid.process(),
                  table: requestHandleBinding.rootFieldType,
                  operation: requestHandleBinding.operation,
                  columns: rootFieldColumns,
                  value: event as GraphQLRequestBinding,
                }
          );
          props.triggerOnChange();
        }}
      />
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  title: {
    marginTop: '10px',
    marginBottom: '10px',
    color: ZColors.WHITE,
    opacity: '0.5',
  },
};
