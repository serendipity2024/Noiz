import 'antd/dist/antd.css';
import { observer } from 'mobx-react';
import React, { ReactElement, useState } from 'react';
import useLocale from '../../../hooks/useLocale';
import useNotificationDisplay from '../../../hooks/useNotificationDisplay';
import useStores from '../../../hooks/useStores';
import { useMutations } from '../../../hooks/useMutations';
import ArrowIcon from '../../../shared/assets/icons/arrow-right.svg';
import DeleteIcon from '../../../shared/assets/icons/delete.svg';
import EditIcon from '../../../shared/assets/icons/edit.svg';
import PlusIcon from '../../../shared/assets/icons/plus.svg';
import {
  ColorBinding,
  DataBinding,
  DataBindingKind,
} from '../../../shared/type-definition/DataBinding';
import { BaseType } from '../../../shared/type-definition/DataModel';
import { HexColor } from '../../../shared/type-definition/ZTypes';
import DataAttributesHelper from '../../../utils/DataAttributesHelper';
import StringUtils from '../../../utils/StringUtils';
import { ZColors, ZThemedBorderRadius, ZThemedColors } from '../../../utils/ZConst';
import ColorPicker from '../right-drawer/shared/ColorPicker';
import ConfigInput from '../right-drawer/shared/ConfigInput';
import LeftDrawerTitle from './shared/LeftDrawerTitle';
import i18n from './ThemeTab.i18n.json';

const DefaultThemeColorList: string[] = ['background', 'primary', 'accent'];

export const ThemeTab = observer((): ReactElement => {
  const displayNotification = useNotificationDisplay();
  const { localizedContent: content } = useLocale(i18n);
  const [editState, setEditState] = useState<string | null>(null);
  const { coreStore } = useStores();
  const { themeColorMutations } = useMutations();

  const { colorThemeLabelMap, colorTheme } = coreStore;
  const { themeColorList, themeColorIndexMap, defaultThemeColorSet } = getThemeColor(colorTheme);

  const onThemeColorChange = (target: string, color: HexColor) => {
    themeColorMutations.setThemeColor(target, color);
  };
  const onThemeColorAdd = () =>
    onThemeColorChange(`${new Date().getTime()}`, StringUtils.generateRandomHexColor());
  const onThemeColorDelete = (key: string) => {
    const colors = DataAttributesHelper.findDataBindingByType(
      BaseType.TEXT,
      DataBindingKind.THEME
    ).filter((e: DataBinding) => (e.valueBinding as ColorBinding).value === key);
    if (colors.length > 0) {
      displayNotification('THEME_COLOR_IN_USE');
    } else {
      themeColorMutations.deleteThemeColor(key);
    }
  };
  const onThemeColorEdit = (key: string) => setEditState(key);
  const onThemeColorNameChange = (key: string, value: string) => {
    themeColorMutations.setThemeColorLabel(key, value);
    setEditState(null);
  };

  const renderColorRow = (key: string) => {
    const color = (colorTheme as any)[key];
    const index = themeColorIndexMap[key];
    const labelName = colorThemeLabelMap[key] ?? 'custom';
    const label = `${StringUtils.convertStringToCamelCase(labelName)} / #${index}`;

    const allowEdit = !defaultThemeColorSet.has(key);
    const iconStyle = {
      ...styles.rowTitleIcon,
      ...(allowEdit ? null : styles.rowTitleIconDisabled),
    };
    const renderTitleRow = () =>
      key === editState ? (
        <div style={styles.rowTitleContainer}>
          <ConfigInput
            style={styles.rowTitleInput}
            value={labelName}
            placeholder="Custom"
            onSaveValue={(value: string) => onThemeColorNameChange(key, value)}
          />
          <div onClick={() => onThemeColorEdit(key)}>
            <img alt="" style={iconStyle} src={EditIcon} />
          </div>
        </div>
      ) : (
        <div style={styles.rowTitleContainer}>
          <span style={styles.rowTitle}>{label}</span>
          <div onClick={() => (allowEdit ? onThemeColorDelete(key) : null)}>
            <img alt="" style={iconStyle} src={DeleteIcon} />
          </div>
          <div onClick={() => (allowEdit ? onThemeColorEdit(key) : null)}>
            <img alt="" style={iconStyle} src={EditIcon} />
          </div>
        </div>
      );

    return (
      <div style={styles.rowContainer}>
        {renderTitleRow()}
        <div style={styles.pickerContainer}>
          <div style={{ ...styles.colorIndicator, backgroundColor: color }} />
          <ColorPicker
            style={styles.pickerSelect}
            textStyle={styles.pickerText}
            color={color}
            backgroundColor={ZThemedColors.SECONDARY}
            arrowIcon={<img alt="" style={styles.arrowIcon} src={ArrowIcon} />}
            disableAlpha
            onChange={(c: HexColor) => onThemeColorChange(key, c)}
            disableThemeColors
          />
        </div>
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleContainer}>
        <LeftDrawerTitle textStyle={styles.titleText}>{content.title}</LeftDrawerTitle>
        <div onClick={onThemeColorAdd}>
          <img alt="" style={styles.plusIcon} src={PlusIcon} />
        </div>
      </div>
      {themeColorList.map((colorName: string) => (
        <div key={colorName}>{renderColorRow(colorName)}</div>
      ))}
    </div>
  );
});

export const getThemeColor = (
  theme: Record<string, HexColor>
): {
  themeColorList: string[];
  themeColorIndexMap: Record<string, number>;
  defaultThemeColorSet: Set<string>;
} => {
  const defaultThemeColorSet = new Set(DefaultThemeColorList);
  const customThemeColors = Object.keys(theme)
    .filter((k) => !defaultThemeColorSet.has(k))
    .sort();
  const themeColorList = DefaultThemeColorList.concat(customThemeColors);
  const themeColorIndexMap: Record<string, number> = {};
  themeColorList.forEach((k: string, index: number) => {
    themeColorIndexMap[k] = index;
  });

  return { themeColorList, themeColorIndexMap, defaultThemeColorSet };
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    width: '100%',
    padding: '14px 6px 8px 6px',
  },
  titleContainer: {
    display: 'flex',
    marginBottom: '4px',
    alignItems: 'center',
    width: '100%',
  },
  titleText: {
    flex: 1,
  },
  plusIcon: {
    width: '12px',
    height: '12px',
    cursor: 'pointer',
  },
  rowContainer: {
    marginTop: '10px',
  },
  rowTitleContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '30px',
    width: '100%',
  },
  rowTitle: {
    flex: 1,
    fontSize: '10px',
    fontWeight: 700,
    lineHeight: '14px',
    color: ZColors.WHITE,
    opacity: 0.5,
  },
  rowTitleInput: {
    flex: 1,
    fontSize: '10px',
    fontWeight: 700,
    lineHeight: '14px',
    color: ZColors.WHITE,
    backgroundColor: ZThemedColors.SECONDARY,
    borderRadius: ZThemedBorderRadius.DEFAULT,
    border: 'none',
  },
  rowTitleIcon: {
    marginLeft: '10px',
    width: '12px',
    height: '12px',
    cursor: 'pointer',
  },
  rowTitleIconDisabled: {
    opacity: 0.5,
    cursor: 'default',
  },
  pickerContainer: {
    display: 'flex',
    marginTop: '10px',
    width: '100%',
  },
  colorIndicator: {
    marginRight: '20px',
    height: '32px',
    width: '32px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  pickerSelect: {
    flex: 1,
    verticalAlign: 'middle',
    color: '#fff',
    height: '32px',
    borderRadius: ZThemedBorderRadius.DEFAULT,
  },
  pickerText: {
    color: ZColors.WHITE,
    fontWeight: 700,
    fontSize: '10px',
  },
  arrowIcon: {
    width: '12px',
    height: '12px',
    transform: 'rotate(90deg)',
  },
};
