/* eslint-disable import/no-default-export */
import { ArrowRightOutlined } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import { UserFlow, useSelectionTrigger } from '../../../../hooks/useUserFlowTrigger';
import { RerunConditionHandleBinding } from '../../../../shared/type-definition/EventBinding';
import { ZThemedBorderRadius, ZThemedColors } from '../../../../utils/ZConst';

interface Props {
  event: RerunConditionHandleBinding;
}

export default function RerunConditionActionRow(props: Props): ReactElement | null {
  const utf = useSelectionTrigger();
  const targetMRef = props.event.value;

  return (
    <div style={styles.container} onClick={() => utf(UserFlow.SELECT_TARGET)(targetMRef)}>
      <span style={styles.title}>{targetMRef}</span>
      <ArrowRightOutlined />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '10px',
    width: '100%',
    height: '40px',
    backgroundColor: ZThemedColors.PRIMARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    cursor: 'pointer',
  },
  title: {
    display: 'flex',
    flex: 1,
  },
};
