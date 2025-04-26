/* eslint-disable import/no-default-export */
import React, { ReactElement } from 'react';
import useLocale from '../../../hooks/useLocale';
import BlankOption from '../../../shared/assets/editor/drawer-options/blank-option.svg';
import { ComponentModelType } from '../../../shared/type-definition/ComponentModelType';
import { ZThemedColors } from '../../../utils/ZConst';
import ZDraggableBox from '../../dnd/ZDraggableBox';
import ZDrawerDropdownMenu from './ZDrawerDropMenu';
import i18n from '../left-drawer/AddComponentTab.i18n.json';
import useStores from '../../../hooks/useStores';
import { ComponentTemplate } from '../../../mobx/stores/CoreStoreDataType';

interface Props {
  data: MenuCategory[];
}

export default function ZCategorizedMenu(props: Props): ReactElement {
  const { localizedContent } = useLocale(i18n);
  const { coreStore } = useStores();

  const { componentTemplates } = coreStore;

  const renderOptionComponent = (
    option: MenuOption,
    index: number,
    componentTemplate?: ComponentTemplate
  ) => {
    const spacingStyle =
      index % 2 === 0 ? { justifyContent: 'flex-start' } : { justifyContent: 'flex-end' };
    const zeroMarginForFirstTwo = index < 2 ? { marginTop: 0 } : null;
    const containerStyle = {
      ...styles.option,
      ...spacingStyle,
      ...zeroMarginForFirstTwo,
    };

    const localComponent = (
      <div style={{ ...styles.optionContent, ...(option.onClick ? styles.optionClickable : null) }}>
        <img alt="" src={option.image ?? BlankOption} style={styles.optionImg} />
        <span style={styles.optionName}>{option.name}</span>
      </div>
    );

    const templateBasedComponent = (
      <div style={{ ...styles.optionContent, ...(option.onClick ? styles.optionClickable : null) }}>
        <img alt="" src={BlankOption} style={styles.optionImg} />
        {option.image && (
          <div style={styles.networkImageContainer}>
            <img alt="" src={option.image} style={styles.networkImage} />
          </div>
        )}
        <span style={styles.optionName}>{option.name}</span>
      </div>
    );

    const componentToDisplay = componentTemplate ? templateBasedComponent : localComponent;

    if (!option.draggable)
      return (
        <div key={option.name} style={containerStyle} onClick={option.onClick}>
          {componentToDisplay}
        </div>
      );

    return (
      <ZDraggableBox
        key={`${option.name}---${index}`}
        componentType={option.type as ComponentModelType}
        componentName={option.name}
        componentTemplate={componentTemplate}
        dragSourceComponet={componentToDisplay}
        style={containerStyle}
        onClick={option.onClick}
      />
    );
  };

  const renderComponentTemplate = () => {
    return (
      <div>
        <div style={styles.optionContainer}>
          {componentTemplates.map((template, index) => {
            const option: MenuOption = {
              name: template.title ?? '',
              type: ComponentModelType.UNKNOWN,
              image: template.iconImageUrl,
              draggable: true,
            };
            return renderOptionComponent(option, index, template);
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {props.data.map((category: MenuCategory, index: number) => {
        let title = category.categoryName;
        if (category.options.length > 0) {
          title = `${title} (${category.options.length})`;
        }
        const extraStyle = index === 0 ? undefined : styles.withMarginTop;
        return (
          <ZDrawerDropdownMenu
            key={category.categoryName}
            style={extraStyle}
            title={title}
            initIsOpen={index === 0}
          >
            {category.categoryName === localizedContent.menuCategories.componentTemplate ? (
              renderComponentTemplate()
            ) : (
              <div style={styles.optionContainer}>
                {category.options.map((option, oIndex) => renderOptionComponent(option, oIndex))}
              </div>
            )}
          </ZDrawerDropdownMenu>
        );
      })}
    </>
  );
}

export interface MenuCategory {
  categoryName: string;
  options: MenuOption[];
}

export interface MenuOption {
  name: string;
  type: string;
  image: string | null;
  onClick?: () => void;
  draggable?: boolean;
}

const styles: Record<string, React.CSSProperties> = {
  withMarginTop: {
    marginTop: '12px',
  },
  optionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
  option: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginTop: '20px',
    width: '50%',
  },
  optionContent: {
    position: 'relative',
  },
  optionClickable: {
    cursor: 'pointer',
  },
  optionName: {
    position: 'absolute',
    bottom: '8px',
    left: 0,
    width: '100%',
    padding: '0 1px',
    textAlign: 'center',
    fontSize: '12px',
    color: ZThemedColors.ACCENT,
  },
  optionImg: {
    width: '100%',
  },
  networkImageContainer: {
    position: 'absolute',
    top: '20px',
    bottom: '40px',
    left: '15px',
    right: '15px',
  },
  networkImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '15px',
    overflow: 'hidden',
  },
};
