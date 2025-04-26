/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement, useState } from 'react';
import { observer } from 'mobx-react';
import { SearchOutlined } from '@ant-design/icons';
import { ZThemedColors } from '../../../utils/ZConst';
import useStores from '../../../hooks/useStores';
import BaseComponentModel from '../../../models/base/BaseComponentModel';
import { UserFlow, useSelectionTrigger } from '../../../hooks/useUserFlowTrigger';
import { notification, ZInput } from '../../../zui';
import cssModule from './SearchComponentTab.module.scss';
import i18n from './SearchComponentTab.i18n.json';
import useLocale from '../../../hooks/useLocale';

export default observer(function SearchComponentTab(): ReactElement {
  const { coreStore } = useStores();
  const utf = useSelectionTrigger();
  const { localizedContent: content } = useLocale(i18n);
  const selectComponentByMRef = (mRef: string) => {
    const component = coreStore.getModel<BaseComponentModel>(mRef);
    if (component) {
      let parent = component;
      while (parent && !parent.hasFocusMode()) {
        parent = parent.parent();
      }
      utf(UserFlow.FOCUS_TARGET)(parent.mRef);
      utf(UserFlow.SELECT_TARGET)(component.mRef);
    } else {
      notification.warn({ message: `${mRef} not found` });
    }
  };

  const selectComponentByName = (name: string) => {
    const components = coreStore.getModelsByName(name);
    if (components.length > 0) {
      selectComponentByMRef(components[0].mRef);
    } else {
      notification.warn({ message: `${name} not found` });
    }
  };
  const [idSearchInput, setIdSearchInput] = useState('');
  const [nameSearchInput, setNameSearchInput] = useState('');

  return (
    <div style={styles.container}>
      <div style={styles.configContainer}>
        <div style={styles.titleCopyContainer}>
          <span style={styles.title}>{content.searchById}</span>
          <div style={styles.searchContainer}>
            <SearchOutlined onClick={() => selectComponentByMRef(idSearchInput)} />
          </div>
        </div>
        <ZInput
          className={cssModule.searchComponentInput}
          value={idSearchInput}
          onChange={(event) => setIdSearchInput(event.target.value)}
          lightBackground
        />
      </div>
      <div style={styles.configContainer}>
        <div style={styles.titleCopyContainer}>
          <span style={styles.title}>{content.searchByName}</span>
          <div style={styles.searchContainer}>
            <SearchOutlined onClick={() => selectComponentByName(nameSearchInput)} />
          </div>
        </div>
        <ZInput
          className={cssModule.searchComponentInput}
          value={nameSearchInput}
          onChange={(event) => setNameSearchInput(event.target.value)}
          lightBackground
        />
      </div>
    </div>
  );
});

const styles: Record<string, CSSProperties> = {
  container: {
    width: '100%',
  },
  configContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  titleCopyContainer: {
    width: '100%',
  },
  title: {
    color: ZThemedColors.ACCENT,
    float: 'left',
    fontSize: '14px',
  },
  searchContainer: {
    width: '15%',
    cursor: 'pointer',
    float: 'right',
    color: '#2298FF',
  },
};
