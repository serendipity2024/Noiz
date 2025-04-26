/* eslint-disable import/no-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import { CascaderOptionType, CascaderValueType } from 'antd/lib/cascader';
import { map, partition } from 'lodash';
import React, { CSSProperties, ReactElement, useEffect, useState } from 'react';
import { NullableReactElement } from '../../../../shared/type-definition/ZTypes';
import { Button, Dropdown, Menu, ZInput, ZMenu } from '../../../../zui';
import { MenuClickEventInfo } from '../../../../zui/Menu';
import menuCssModule from '../../../../zui/Menu.module.scss';

interface Props {
  options: CascaderOptionType[];
  loadData?: (option: CascaderOptionType) => CascaderOptionType[];
  onChange?: (value: CascaderValueType, selectedOptions?: CascaderOptionType[]) => void;
  customDropdown?: (menu: ReactElement) => ReactElement;
}

interface SubMenuProps {
  prefix: string;
  option: CascaderOptionType;
  loadData?: (option: CascaderOptionType) => CascaderOptionType[];
}

const HEAD = 'head';
const SEPARATOR = '｜**｜';

function CustomSubMenu(props: SubMenuProps) {
  const { option, loadData, ...rest } = props;
  const [options, setOptions] = useState<CascaderOptionType[]>([]);
  const [filter, setFilter] = useState('');

  const [leaves, nodes] = partition(
    options.filter((value) => value && value.label && (value.label as string).indexOf(filter) > -1),
    'isLeaf'
  );

  useEffect(() => {
    if (option.children) {
      setOptions(option.children);
    } else if (loadData) {
      setOptions(loadData(option));
    }
  }, [option, loadData]);

  return (
    <Menu.SubMenu popupClassName={menuCssModule.subMenu} title={props.option.label} {...rest}>
      <Menu.Item disabled>
        <ZInput
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
          }}
          autoFocus
        />
      </Menu.Item>
      {leaves.map((subOption) => (
        <Menu.Item
          key={`${props.prefix}${SEPARATOR}${JSON.stringify(subOption)}`}
          disabled={subOption.disabled}
        >
          {subOption.label}
        </Menu.Item>
      ))}
      {nodes.map((subOption) => (
        <CustomSubMenu
          key={`${props.prefix}${SEPARATOR}${JSON.stringify(subOption)}`}
          prefix={[props.prefix, JSON.stringify(subOption.value)].join('')}
          option={subOption}
          loadData={props.loadData}
        />
      ))}
    </Menu.SubMenu>
  );
}

export default function CustomCascader(props: Props): NullableReactElement {
  const { options, loadData } = props;
  const [leaves, nodes] = partition(options, 'isLeaf');

  const menu = (
    <ZMenu
      onClick={(param: MenuClickEventInfo) => {
        if (props.onChange) {
          const selectedOptions = (param.keyPath as string[])
            .map((key) => {
              const list = key.split(SEPARATOR);
              if (list.length !== 2) throw new Error(`CustomCascader menu data error, ${key}`);
              return JSON.parse(list[1]);
            })
            .reverse();
          const value = map(selectedOptions, 'value');
          props.onChange(value, selectedOptions);
        }
      }}
      items={[
        ...leaves.map((option) => ({
          key: `${HEAD}${SEPARATOR}${JSON.stringify(option)}`,
          disabled: option.disabled,
          title: option.label as string,
        })),
      ]}
      enableFilter
    >
      {nodes.map((option) => (
        <CustomSubMenu
          key={`${HEAD}${SEPARATOR}${JSON.stringify(option)}`}
          prefix={JSON.stringify(option.value)}
          option={option}
          loadData={loadData}
        />
      ))}
    </ZMenu>
  );
  return props.customDropdown ? (
    props.customDropdown(menu)
  ) : (
    <Dropdown overlay={menu} overlayStyle={styles}>
      <Button>Test</Button>
    </Dropdown>
  );
}

const styles: Record<string, CSSProperties> = {
  input: {
    width: 'fit-content',
  },
};
