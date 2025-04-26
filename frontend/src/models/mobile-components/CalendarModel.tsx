/* eslint-disable import/no-default-export */
import React from 'react';
import { observable } from 'mobx';
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';
import { ShortId } from '../../shared/type-definition/ZTypes';
import BaseComponentModel from '../base/BaseComponentModel';
import BaseMobileComponentModel from '../base/BaseMobileComponentModel';
import ZFrame from '../interfaces/Frame';
import ZCalendar, {
  CalendarAttributes,
  ZCalendarDefaultFrame,
  ZCalendarDefaultDataAttributes,
  ZCalendarDefaultReferenceAttributes,
} from '../../components/mobile-components/ZCalendar';
import { ComponentFrameConfiguration } from '../interfaces/ComponentModel';

export default class CalendarModel extends BaseMobileComponentModel {
  public readonly type: ComponentModelType = ComponentModelType.CALENDER;

  public readonly isInput: boolean = true;

  public defaultDataAttributes(): Record<string, any> {
    return ZCalendarDefaultDataAttributes;
  }

  @observable
  public dataAttributes = this.defaultDataAttributes() as CalendarAttributes;

  public getDefaultComponentFrame(): ZFrame {
    return ZCalendarDefaultFrame;
  }

  public getFrameConfiguration(): ComponentFrameConfiguration {
    return {
      positionEnabled: true,
      sizeEnabled: false,
    };
  }

  public createCopy(parentMRef?: ShortId): BaseComponentModel | null {
    const clonedModel = this.defaultCreateCopy(parentMRef) as CalendarModel;
    if (super.imperfectCopy(this.parentMRef, parentMRef)) {
      super.resetDataAttributesToDefaultIfNecessary(
        clonedModel,
        ZCalendarDefaultReferenceAttributes
      );
    }
    return clonedModel;
  }

  // renderers
  public renderForPreview(): React.ReactNode {
    return <ZCalendar mRef={this.previewMRef} />;
  }
}
