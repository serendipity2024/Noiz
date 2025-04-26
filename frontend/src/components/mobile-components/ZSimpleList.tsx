/* eslint-disable import/no-default-export */
import { observer } from 'mobx-react';
import React from 'react';
import useModel from '../../hooks/useModel';
import { NullableReactElement } from '../../shared/type-definition/ZTypes';
import { MRefProp } from './PropTypes';

interface SimpleListItem {
  title: string;
  subTitle: string;
}

export default observer(function ZSimpleList(props: MRefProp): NullableReactElement {
  const model = useModel(props.mRef);
  if (!model) return null;

  const dataList: SimpleListItem[] = [
    { title: 'Title', subTitle: 'SubTitle' },
    { title: 'Title', subTitle: 'SubTitle' },
    { title: 'Title', subTitle: 'SubTitle' },
    { title: 'Title', subTitle: 'SubTitle' },
    { title: 'Title', subTitle: 'SubTitle' },
    { title: 'Title', subTitle: 'SubTitle' },
  ];

  const renderListItem = (item: SimpleListItem, index: number) => (
    <div key={item.title + index} style={styles.itemContainer}>
      <label style={styles.title}>{item.title}</label>
      <label style={styles.subTitle}>{item.subTitle}</label>
    </div>
  );

  return (
    <div style={styles.maxContainer}>
      {dataList.map((item, index) => renderListItem(item, index))}
    </div>
  );
});

const styles: Record<string, React.CSSProperties> = {
  container: {
    overflow: 'hidden',
    background: '#eeeeee',
  },
  maxContainer: {
    height: '255px',
  },
  itemContainer: {
    height: '80px',
    width: '365px',
    margin: '5px',
    borderRadius: '5px',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  title: {
    marginLeft: '10px',
    fontSize: '16px',
    color: '#333',
  },
  subTitle: {
    marginLeft: '10px',
    fontSize: '14px',
    color: '#333',
  },
};
