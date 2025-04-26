/* eslint-disable import/no-default-export */
import { ResizableProps } from 're-resizable';
import { ComponentModelType } from '../shared/type-definition/ComponentModelType';
import useStores from './useStores';
import BaseComponentModel from '../models/base/BaseComponentModel';
import { TabViewAttributes } from '../components/mobile-components/ZTabView';
import FrameDiff from '../diffs/FrameDiff';
import { SelectViewAttributes } from '../components/mobile-components/ZSelectView';
import { ZSize } from '../models/interfaces/Frame';
import TabViewModel from '../models/mobile-components/TabViewModel';
import { DiffItem } from '../shared/type-definition/Diff';

export type ResizableConfiguration = Pick<
  ResizableProps,
  'enable' | 'scale' | 'maxWidth' | 'minWidth' | 'maxHeight' | 'minHeight' | 'lockAspectRatio'
> & { size?: ZSize; onResizeStop?: (onResizeEnd: { width: number; height: number }) => any };

const DefaultResizeDirection = {
  top: true,
  left: true,
  right: true,
  bottom: true,
  topRight: true,
  bottomRight: true,
  bottomLeft: true,
  topLeft: true,
};

const DefaultConfiguration: Pick<ResizableProps, 'enable'> = {
  enable: DefaultResizeDirection,
};

const useResizableConfiguration = (): ((model: BaseComponentModel) => ResizableConfiguration) => {
  const { coreStore, editorStore, diffStore } = useStores();
  const { scale } = editorStore;

  return (model: BaseComponentModel) => {
    const { type, parentMRef } = model;

    const parent = coreStore.getModel(parentMRef);
    const parentType = parent?.type;

    const parentDataAttributes = parent?.dataAttributes;

    // tab model
    const normalTabModel = coreStore.getModel(
      (parentDataAttributes as TabViewAttributes | undefined)?.normalTabMRef ?? ''
    );
    const selectedTabModel = coreStore.getModel(
      (parentDataAttributes as TabViewAttributes | undefined)?.selectedTabMRef ?? ''
    );

    // select model
    const normalModel = coreStore.getModel(
      (parentDataAttributes as SelectViewAttributes | undefined)?.normalMRef ?? ''
    );
    const selectedModel = coreStore.getModel(
      (parentDataAttributes as SelectViewAttributes | undefined)?.selectedMRef ?? ''
    );

    switch (type) {
      case ComponentModelType.BLANK_CONTAINER:
        switch (parentType) {
          case ComponentModelType.CUSTOM_LIST:
            return {
              enable: { bottom: true },
              scale: scale / 2,
            };
          case ComponentModelType.HORIZONTAL_LIST:
            return {
              enable: { right: true },
              scale: scale / 2,
            };
          case ComponentModelType.TAB_VIEW:
            if (model.mRef === normalTabModel?.mRef || model.mRef === selectedTabModel?.mRef) {
              return {
                onResizeStop: ({ width, height }) => {
                  if (!normalTabModel || !selectedTabModel)
                    throw new Error(`custom tab error, ${JSON.stringify(model)}`);

                  const itemFrame = {
                    size: {
                      height,
                      width,
                    },
                  };
                  diffStore.applyDiff([
                    ...FrameDiff.buildUpdateComponentFrameDiffs(normalTabModel, itemFrame),
                    ...FrameDiff.buildUpdateComponentFrameDiffs(selectedTabModel, itemFrame),
                  ]);
                },
                enable: { bottom: true },
                scale: scale / 2,
              };
            }
            return {
              enable: {},
            };
          case ComponentModelType.SELECT_VIEW:
            return {
              onResizeStop: ({ width, height }) => {
                if (!normalModel || !selectedModel)
                  throw new Error(`select view error, ${JSON.stringify(model)}`);

                const itemFrame = {
                  size: {
                    height,
                    width,
                  },
                };
                diffStore.applyDiff([
                  ...FrameDiff.buildUpdateComponentFrameDiffs(normalModel, itemFrame),
                  ...FrameDiff.buildUpdateComponentFrameDiffs(selectedModel, itemFrame),
                ]);
              },
              scale: scale / 2,
              enable: { right: true, bottom: true, bottomRight: true },
            };
          default:
            return DefaultConfiguration;
        }
      case ComponentModelType.ADVERT_BANNER:
        return {
          enable: DefaultResizeDirection,
          lockAspectRatio: true,
        };
      case ComponentModelType.CALENDER:
        return { enable: {} };
      case ComponentModelType.SIMPLE_LIST:
        return {
          enable: {
            bottom: true,
          },
        };
      case ComponentModelType.CONDITIONAL_CONTAINER_CHILD:
        return {
          enable: {},
        };
      case ComponentModelType.TAB_VIEW:
        return {
          enable: DefaultResizeDirection,
          onResizeStop: ({ width, height }) => {
            const itemFrame = {
              size: {
                height:
                  height -
                  (normalTabModel
                    ? normalTabModel.getComponentFrame().size.height
                    : (model.dataAttributes as TabViewAttributes).tabHeight),
                width,
              },
            };
            const diffItems: DiffItem[] = FrameDiff.buildUpdateComponentFrameDiffs(
              model,
              itemFrame
            );
            (model as TabViewModel)
              .children()
              .filter(
                (child) =>
                  child.mRef !== (model.dataAttributes as TabViewAttributes).normalTabMRef &&
                  child.mRef !== (model.dataAttributes as TabViewAttributes).selectedTabMRef
              )
              .forEach((m) => {
                FrameDiff.buildUpdateComponentFrameDiffs(m, itemFrame).forEach((di) =>
                  diffItems.push(di)
                );
              });
            diffStore.applyDiff(diffItems);
          },
        };
      default:
        return DefaultConfiguration;
    }
  };
};

export default useResizableConfiguration;
