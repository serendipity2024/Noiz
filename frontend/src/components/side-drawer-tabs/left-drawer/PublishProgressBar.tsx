/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import { ZThemedColors } from '../../../utils/ZConst';
import Spin from '../../../shared/assets/editor/spin.svg';
import ZSpinningComponent from '../../base/ZSpinningComponent';
import './PublishProgressBar.scss';
import { Steps } from '../../../zui';

const { Step } = Steps;

export interface StepProp {
  title: string;
  description?: string;
}
export interface Props {
  steps: StepProp[];
  currentStep: number;
  direction?: 'horizontal' | 'vertical';
}

export default function PublishProgressBar(props: Props): NullableReactElement {
  const renderPendingDot = () => <div style={styles.stepPendingDot} />;
  const renderSpin = () => (
    <ZSpinningComponent style={styles.spinSize} speed={1.2}>
      <img alt="" style={styles.spinSize} src={Spin} />
    </ZSpinningComponent>
  );
  const renderSuccessDot = () => <div style={styles.stepSuccessDot} />;

  const renderProgressDot = (_: ReactElement, { status }: { status: string }) => {
    switch (status) {
      case 'process':
        return renderSpin();
      case 'finish':
        return renderSuccessDot();
      case 'wait':
      default:
        return renderPendingDot();
    }
  };

  const status = () => {
    if (props.currentStep === props.steps.length - 1) {
      return 'finish';
    }
    if (props.currentStep >= 0 && props.currentStep < props.steps.length) {
      return undefined;
    }
    return 'wait';
  };

  return (
    <Steps
      className="publishSteps"
      progressDot={renderProgressDot}
      current={props.currentStep}
      direction={props.direction ?? 'vertical'}
    >
      {props.steps.map((step, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Step key={index} title={step.title} description={step.description} status={status()} />
      ))}
    </Steps>
  );
}

const styles: Record<string, CSSProperties> = {
  stepPendingDot: {
    width: '16px',
    height: '16px',
    borderRadius: '8px',
    borderStyle: 'solid',
    borderWidth: '3px',
    borderColor: '#303233',
  },
  stepSuccessDot: {
    width: '16px',
    height: '16px',
    borderRadius: '8px',
    backgroundColor: ZThemedColors.ACCENT,
  },
  spinSize: {
    width: '16px',
    height: '16px',
  },
};
