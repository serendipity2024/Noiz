/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useLocale from '../../../../hooks/useLocale';
import useModel from '../../../../hooks/useModel';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { MRefProp } from '../../../mobile-components/PropTypes';
import DataBindingConfigRow from '../config-row/DataBindingConfigRow';
import i18n from './CommonConfigTab.i18n.json';
import TextModel from '../../../../models/mobile-components/TextModel';
import ConfigTab from './ConfigTab';
import { RichTextAttributes } from '../../../mobile-components/ZRichText';
import RichTextModel from '../../../../models/mobile-components/RichTextModel';
import { Empty } from '../../../../zui';

const RichTextDataConfigTab = observer((props: { model: TextModel }) => {
  const { localizedContent: content } = useLocale(i18n);
  const { model } = props;
  const dataAttributes = model.dataAttributes as RichTextAttributes;
  const { value } = dataAttributes;
  return (
    <>
      <DataBindingConfigRow
        componentModel={model}
        title={content.label.text}
        dataBinding={value}
        onChange={(dataBinding) => {
          model.onUpdateDataAttributes('value', dataBinding);
        }}
      />
    </>
  );
});

export default function RichTextConfigTab(props: MRefProp): NullableReactElement {
  const model = useModel<RichTextModel>(props.mRef);
  if (!model) return null;

  return (
    <ConfigTab
      model={model}
      ActionConfigTab={() => <Empty description={false} />}
      DataConfigTab={RichTextDataConfigTab}
      StyleConfigTab={() => <Empty description={false} />}
    />
  );
}
