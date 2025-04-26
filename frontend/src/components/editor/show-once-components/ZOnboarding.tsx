import React, { useRef } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Player } from '@lottiefiles/react-lottie-player';
import { Carousel } from 'antd';
import { CarouselRef } from 'antd/lib/carousel';
import { Button, Col, Divider, Row } from '../../../zui';
import { NullableReactElement } from '../../../shared/type-definition/ZTypes';
import styles from './ZOnboarding.module.scss';
import FocusedMode from '../../../shared/assets/lottie/focused-mode.json';
import UIParts from '../../../shared/assets/lottie/ui-parts.json';
import DataModel from '../../../shared/assets/lottie/data-model.json';
import ProjectReview from '../../../shared/assets/lottie/project-preview.json';
import FocusedModeGuide from '../../../shared/assets/editor/onboarding/focused-mode-guide.svg';
import UIPartsGuide from '../../../shared/assets/editor/onboarding/ui-parts-guide.svg';
import DataModelGuide from '../../../shared/assets/editor/onboarding/data-model-guide.svg';
import ProjectReviewGuide from '../../../shared/assets/editor/onboarding/project-preview-guide.svg';
import i18n from './ZOnboarding.i18n.json';
import useLocale from '../../../hooks/useLocale';
import { showOnceComponent } from '../ZShowOnceComponet';
import { AccountTag } from '../../../mobx/stores/AccountTagStore';
import RightArrow from '../../../shared/assets/icons/next-right-arrow.svg';
import LetfArrow from '../../../shared/assets/icons/previous-left-arrow.svg';

interface Props {
  onComponentVisible?: boolean;
  onFinish?: () => void;
}

export function ZOnboardingIntro(props: Props): NullableReactElement {
  const { onComponentVisible, onFinish } = props;
  const onboardingLotties = [FocusedMode, UIParts, DataModel, ProjectReview];
  const { localizedContent: content } = useLocale(i18n);
  const carouselElement = useRef<CarouselRef | null>(null);

  const guideTitle = [FocusedModeGuide, UIPartsGuide, DataModelGuide, ProjectReviewGuide];

  const renderHeader = () => {
    return (
      <Row justify="space-between">
        <Col>
          <span className={styles.title}>{content.header.onboarding}</span>
        </Col>
        <Col>
          <Button className={styles.skip} onClick={() => onFinish && onFinish()}>
            {content.header.skip}
          </Button>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <Modal
        visible={onComponentVisible}
        destroyOnClose
        closable={false}
        className={styles.modal}
        width="68%"
        footer={null}
        centered
      >
        <div className={styles.header}>{renderHeader()}</div>
        <Divider className={styles.divider} />
        <div className={styles.lottieContainer}>
          <Button onClick={() => carouselElement.current?.prev()} className={styles.lottieButton}>
            <img alt="" src={LetfArrow} />
          </Button>
          <div className={styles.lottie}>
            <Carousel ref={carouselElement} lazyLoad="ondemand">
              {onboardingLotties.map((lottie, index) => {
                return (
                  <div key={index.toString()}>
                    <div className={styles.titleContainer}>
                      <img alt="" src={guideTitle[index]} className={styles.guideTitle} />
                    </div>
                    <Player autoplay loop src={JSON.stringify(lottie)} />
                    <div className={styles.expend} />
                  </div>
                );
              })}
            </Carousel>
          </div>
          <Button onClick={() => carouselElement.current?.next()} className={styles.lottieButton}>
            <img alt="" src={RightArrow} />
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export const ZShowOnceOnBoardingIntro = showOnceComponent(ZOnboardingIntro, AccountTag.SHOW_INTRO);
