/* eslint-disable import/prefer-default-export */
/* eslint-disable react/jsx-props-no-spreading */
import arrayMove from 'array-move';
import { observer } from 'mobx-react';
import React, { ReactElement } from 'react';
import { DragDropContext, Draggable, DraggableProvided, Droppable } from 'react-beautiful-dnd';
import { EventBinding } from '../../../../shared/type-definition/EventBinding';

interface EventsDragDropProps {
  events: EventBinding[];
  onChange: (events: EventBinding[]) => void;
  renderRow: (event: EventBinding, index: number, provided: DraggableProvided) => ReactElement;
}

export const EventsDragDropConfigRow = (props: EventsDragDropProps): ReactElement => {
  const { events, onChange } = props;

  return (
    <DragDropConfigRow
      onDragEnd={(result) => {
        if (!result.destination) return;
        onChange(arrayMove(events, result.source.index, result.destination.index));
      }}
      renderContent={events.map((event, index) => {
        const key = event.type + index;
        return (
          <Draggable key={key} draggableId={key} index={index}>
            {(pro: DraggableProvided) => props.renderRow(event, index, pro)}
          </Draggable>
        );
      })}
    />
  );
};

interface DragDropProps {
  onDragEnd: (result: any) => void;
  renderContent: ReactElement[];
}

const DragDropConfigRow = observer((props: DragDropProps): ReactElement => {
  const { onDragEnd, renderContent } = props;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {renderContent}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});
