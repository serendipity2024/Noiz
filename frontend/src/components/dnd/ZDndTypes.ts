/* eslint-disable import/no-default-export */
import { ComponentModelType } from '../../shared/type-definition/ComponentModelType';

enum ZDndType {
  CONTENT = 'content',
  LIST_CONTAINER = 'list-container',
  CUSTOM_COMPONENT = 'custom-component',
}

export default ZDndType;

export const getDndTypeByComponentModelType = (type: ComponentModelType): ZDndType => {
  switch (type) {
    case ComponentModelType.CUSTOM_LIST:
    case ComponentModelType.HORIZONTAL_LIST:
    case ComponentModelType.DATA_PICKER:
    case ComponentModelType.SELECT_VIEW:
      return ZDndType.LIST_CONTAINER;
    default:
      return ZDndType.CONTENT;
  }
};
