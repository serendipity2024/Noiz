/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable import/no-default-export */
import { AllStores } from '../mobx/StoreContexts';
import BaseComponentModel from '../models/base/BaseComponentModel';
import { DataBinding, DataBindingKind } from '../shared/type-definition/DataBinding';
import { EventType, ShowModalHandleBinding } from '../shared/type-definition/EventBinding';

export default class DataAttributesHelper {
  public static findDataBindingByType(
    targetType: string,
    targetKind: DataBindingKind
  ): DataBinding[] {
    const result: DataBinding[] = [];
    Object.values(AllStores.coreStore.mRefMap).forEach((component: BaseComponentModel) => {
      const foundDataBindings = DataAttributesHelper.findDataBindingByTypeInDataAttributes(
        component.dataAttributes,
        targetType,
        targetKind
      );
      if (!!foundDataBindings && foundDataBindings.length > 0)
        foundDataBindings.forEach((e) => result.push(e));
    });
    return result;
  }

  public static findDataBindingByTypeInDataAttributes(
    dataAttributes: Record<string, any>,
    targetType: string,
    targetKind: DataBindingKind
  ): DataBinding[] {
    const result: DataBinding[] = [];
    Object.values(dataAttributes).forEach((value): void => {
      if (!value) return;

      if (value instanceof Array) {
        value.forEach((e) => {
          this.findDataBindingByTypeInDataAttributes(e, targetType, targetKind).forEach((c) =>
            result.push(c)
          );
        });
      } else if (
        !!value.type &&
        !!value.valueBinding &&
        value.type === targetType &&
        value.valueBinding?.kind === targetKind
      ) {
        result.push(value);
      }
    });

    return result;
  }

  public static fetchShowModalEvents(obj: any): ShowModalHandleBinding[] {
    let events: ShowModalHandleBinding[] = [];
    if (obj instanceof Array) {
      obj.forEach((item) => {
        events = events.concat(DataAttributesHelper.fetchShowModalEvents(item));
      });
    } else if (obj instanceof Object) {
      if (obj.type === EventType.SHOW_MODAL && obj.modalViewMRef) {
        events.push(obj);
      } else {
        Object.values(obj).forEach((item) => {
          events = events.concat(DataAttributesHelper.fetchShowModalEvents(item));
        });
      }
    }
    return events;
  }
}
