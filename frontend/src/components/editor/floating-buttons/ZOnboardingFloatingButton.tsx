import React, { CSSProperties, ReactElement, useState } from 'react';
import useLocale from '../../../hooks/useLocale';
import OnboardingHighlight from '../../../shared/assets/icons/floating-buttons/onboarding-highlight.svg';
import OnboardingIcon from '../../../shared/assets/icons/floating-buttons/onboarding.svg';
import { ZOnboardingIntro } from '../show-once-components/ZOnboarding';
import ZHoverableIcon from '../ZHoverableIcon';
import i18n from './FloatingButtonToolTipsi18n.json';

export function ZOnboardingFloatingButton(): ReactElement {
  const { localizedContent: content } = useLocale(i18n);
  const [onboardingVisible, setOnboardingVisible] = useState<boolean>(false);

  return (
    <>
      <ZHoverableIcon
        isSelected={onboardingVisible}
        src={OnboardingIcon}
        hoveredSrc={OnboardingHighlight}
        containerStyle={styles.container}
        onClick={() => setOnboardingVisible(!onboardingVisible)}
        toolTip={content.onboarding}
        toolTipPlacement="left"
      />
      <ZOnboardingIntro
        onComponentVisible={onboardingVisible}
        onFinish={() => setOnboardingVisible(!onboardingVisible)}
      />
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    height: '40px',
    width: '40px',
  },
};
