/* eslint-disable import/no-default-export */
import React, { CSSProperties, ReactElement } from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';

interface DragDropProps {
  axis: 'x' | 'y' | 'xy' | undefined;
  dataSource: any[];
  containerStyle?: CSSProperties;
  renderItem: (item: any, index: number) => ReactElement;
  onChange: (dataSource: any[]) => void;
}

export default function ReorderedListConfigRow(props: DragDropProps): ReactElement {
  const { axis, dataSource, onChange } = props;

  const Item = SortableElement((data: { item: any; sortIndex: number }) =>
    props.renderItem(data.item, data.sortIndex)
  );

  const List = SortableContainer((data: { items: any[] }) => {
    return (
      <div style={props.containerStyle}>
        {data.items.map((item, index) => (
          <Item key={JSON.stringify(item)} index={index} sortIndex={index} item={item} />
        ))}
      </div>
    );
  });

  return (
    <List
      items={dataSource}
      axis={axis}
      distance={1}
      onSortEnd={(sort) => onChange(arrayMove(dataSource, sort.oldIndex, sort.newIndex))}
    />
  );
}
