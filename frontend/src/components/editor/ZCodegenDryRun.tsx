import React, { ReactElement, useState } from 'react';
import { observer } from 'mobx-react';
import DryRunNormal from '../../shared/assets/editor/dry-run-normal.svg';
import DryRunHover from '../../shared/assets/editor/dry-run-hover.svg';
import ZHoverableIcon from './ZHoverableIcon';
import i18n from './ZCodegenDryRun.i18n.json';
import useLocale from '../../hooks/useLocale';
import useStores from '../../hooks/useStores';
import useProjectDetails from '../../hooks/useProjectDetails';
import { ZDryRun } from './ZDryRun';

export const ZCodegenDryRun = observer((): ReactElement => {
  const { localizedContent } = useLocale(i18n);
  const { dryRunStore } = useStores();
  const { projectExId } = useProjectDetails();
  const [validationResultsVisible, setValidationResultsVisible] = useState(false);

  return (
    <>
      <ZHoverableIcon
        key="device"
        isSelected={false}
        src={DryRunNormal}
        hoveredSrc={DryRunHover}
        selectedSrc={DryRunHover}
        containerStyle={styles.iconContainer}
        toolTip={localizedContent.tooltip}
        toolTipPlacement="bottom"
        iconStyle={styles.icon}
        onClick={() => {
          dryRunStore.executeDryRun(projectExId).then(() => {
            setValidationResultsVisible(!dryRunStore.isCleanCompile);
          });
          setValidationResultsVisible(true);
        }}
      />
      {validationResultsVisible && <ZDryRun onClose={() => setValidationResultsVisible(false)} />}
    </>
  );
});

const styles: Record<string, React.CSSProperties> = {
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 3,
  },
  icon: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
};
