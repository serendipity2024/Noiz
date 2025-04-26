/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import useLocale from '../../../../hooks/useLocale';
import StoreHelpers from '../../../../mobx/StoreHelpers';
import BaseComponentModel from '../../../../models/base/BaseComponentModel';
import BaseContainerModel from '../../../../models/base/BaseContainerModel';
import {
  ScrollPageToHandleBinding,
  ScrollPageToMode,
} from '../../../../shared/type-definition/EventBinding';
import { VerticalDirection } from '../../../../shared/type-definition/Layout';
import { ZThemedColors } from '../../../../utils/ZConst';
import ZConfigRowTitle from '../shared/ZConfigRowTitle';
import i18n from './ScrollPageToActionRow.i18n.json';
import { Select } from '../../../../zui';

interface Props {
  componentModel: BaseComponentModel;
  event: ScrollPageToHandleBinding;
  onEventChange: () => void;
}

export default observer(function ScrollPageToActionRow(props: Props): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const scrollPageToHandleBinding = props.event;
  const { onEventChange } = props;

  const screen = StoreHelpers.fetchRootModel(props.componentModel) as BaseContainerModel;
  if (!screen.isRootContainer) {
    throw new Error('fetch Screen Model error');
  }
  let listViewModels: BaseComponentModel[] = [];
  if (screen) {
    listViewModels = screen
      .children()
      .filter(
        (model) =>
          !model.isFloating &&
          model.verticalLayout?.location === VerticalDirection.TOP_DOWN &&
          !model.isSlot
      );
  }
  return (
    <>
      <ZConfigRowTitle text={content.label.mode} />
      <Select
        defaultValue={ScrollPageToMode.TOP}
        onChange={(value) => {
          scrollPageToHandleBinding.mode = value;
          onEventChange();
        }}
        dropdownMatchSelectWidth={false}
      >
        {Object.values(ScrollPageToMode).map((mode) => (
          <Select.Option value={mode} key={mode}>
            {content.mode[mode]}
          </Select.Option>
        ))}
      </Select>
      <>
        {scrollPageToHandleBinding.mode === ScrollPageToMode.COMPONENT ? (
          <>
            <ZConfigRowTitle text={content.label.target} />
            <Select
              bordered={false}
              placeholder={content.placeholder}
              size="large"
              style={styles.select}
              defaultValue={scrollPageToHandleBinding.target}
              onChange={(value: string) => {
                scrollPageToHandleBinding.target = value;
                props.onEventChange();
              }}
            >
              {listViewModels.map((element) => (
                <Select.Option key={element.mRef} value={element.mRef}>
                  {element.componentName}
                </Select.Option>
              ))}
            </Select>
          </>
        ) : (
          ''
        )}
      </>
    </>
  );
});
const styles: Record<string, React.CSSProperties> = {
  select: {
    width: '100%',
    fontSize: '10px',
    background: ZThemedColors.PRIMARY,
    borderRadius: '6px',
    textAlign: 'center',
  },
};
