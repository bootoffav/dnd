import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState } from "react";

const tasksStore = [
  "Write docs",
  "Talk to stakeholder",
  "Check bug list",
  "Upgrade dependencies",
  "Send a CV to the employee",
  "Publish solution to GITHUB",
  "Learn RUST!",
  "visit nostarch",
  "wash car",
  "take a shower",
  "play with kids",
  "do some exercises",
];

const getTasks = (titles) =>
  titles.map((title, key) => ({
    id: `${key}-${Math.random()}`,
    title,
  }));

const changePositon = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getTaskStyle = (isDragging, draggableStyle) => ({
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  background: isDragging ? "red" : "grey",

  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "lightred" : "brown",
  padding: grid,
  width: 250,
});

const changeColumn = ({
  source,
  destination,
  droppedSource,
  droppedDestination,
}) => {
  const sCopy = [...source];
  const dCopy = [...destination];
  const [removed] = sCopy.splice(droppedSource.index, 1);

  dCopy.splice(droppedDestination.index, 0, removed);

  return {
    [droppedSource.droppableId]: sCopy,
    [droppedDestination.droppableId]: dCopy,
  };
};

function App() {
  const [tasks, setTasks] = useState([
    getTasks(tasksStore.slice(0, 4)),
    getTasks(tasksStore.slice(4, 8)),
    getTasks(tasksStore.slice(8, 13)),
  ]);

  function onDragEnd(result) {
    const { source, destination } = result;

    // handle case when drop point is inaccurate
    if (!destination) return;

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const reorderedTasks = changePositon(
        tasks[sInd],
        source.index,
        destination.index
      );
      const newTasks = [...tasks];
      newTasks[sInd] = reorderedTasks;
      setTasks(newTasks);
    } else {
      const result = changeColumn({
        source: tasks[sInd],
        destination: tasks[dInd],
        droppedSource: source,
        droppedDestination: destination,
      });
      const newTasks = [...tasks];
      newTasks[sInd] = result[sInd];
      newTasks[dInd] = result[dInd];

      setTasks(newTasks.filter((group) => group.length));
    }
  }

  return (
    <div className="d-flex justify-content-center mt-2">
      <DragDropContext onDragEnd={onDragEnd}>
        {tasks.map((column, i) => (
          <Droppable key={i} droppableId={`${i}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
                {...provided.droppableProps}
              >
                {column.map(({ id, title }, idx) => (
                  <Draggable key={id} draggableId={id} index={idx}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getTaskStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {title}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
}

export default App;
