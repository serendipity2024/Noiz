import React, { ReactElement } from 'react';

export function ZRadioGroup<T extends { id: string }>(props: {
  selectedValue: T | undefined;
  dataSource: T[];
  itemRender: (ds: T, index: number, selected: boolean) => ReactElement;
  onSelected: (ds: T) => void;
}): ReactElement {
  return (
    <>
      {props.dataSource.map((ds, index) => (
        <div
          key={ds.id}
          onClick={(event) => {
            event.stopPropagation();
            props.onSelected(ds);
          }}
        >
          {props.itemRender(ds, index, ds.id === props.selectedValue?.id)}
        </div>
      ))}
    </>
  );
}
