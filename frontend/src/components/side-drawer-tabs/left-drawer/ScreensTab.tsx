/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import ComponentDiff from '../../../diffs/ComponentDiff';
import useLocale from '../../../hooks/useLocale';
import useScreenModels from '../../../hooks/useScreenModels';
import useStores from '../../../hooks/useStores';
import BaseComponentModel from '../../../models/base/BaseComponentModel';
import { ComponentsDragDropConfigRow } from '../right-drawer/config-row/ComponentsDragDropConfigRow';
import i18n from './ScreensTab.i18n.json';
import LeftDrawerTitle from './shared/LeftDrawerTitle';

export default function ScreensConfigRow(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const { diffStore } = useStores();
  const children = useScreenModels();

  return (
    <>
      <LeftDrawerTitle containerStyle={styles.title}>{content.title}</LeftDrawerTitle>
      <ComponentsDragDropConfigRow
        components={children}
        onChange={(components: BaseComponentModel[]) => {
          diffStore.applyDiff([
            ComponentDiff.buildUpdatePageMRefsDiff(components.map((model) => model.mRef)),
          ]);
        }}
      />
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    margin: '14px 0 24px 0',
  },
};
