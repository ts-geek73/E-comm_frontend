import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
  moveTask: (taskId: number, from: string, to: string) => void;
}
interface ColumnType {
  id: string;
  title: string;
}

interface TaskType {
  id: number;
  title: string;
  description: string;
  columnId: string;
}

interface TaskCardProps {
  task: TaskType;
  columnId: string;
  moveTask: (taskId: number, from: string, to: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag<
    { id: number; columnId: string },
    void,
    { isDragging: boolean }
  >({
    type: "TASK",
    item: { id: task.id, columnId: task.columnId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white rounded-lg shadow mb-3 transition ${isDragging ? "opacity-40" : ""}`}
    >
      <strong>{task.title}</strong>
      <p className="text-sm text-gray-600">{task.description}</p>
    </div>
  );
};
const Column: React.FC<ColumnProps> = ({ column, tasks, moveTask }) => {
  const [{ isOver }, drop] = useDrop<{ id: number; columnId: string }, void, { isOver: boolean }>({
    accept: "TASK",
    drop: (item) => {
      if (item.columnId !== column.id) {
        moveTask(item.id, item.columnId, column.id);
      }
    },
    collect: (m) => ({ isOver: m.isOver() }),
  });

  return (
    <div
      ref={drop}
      className={`p-4 bg-gray-200 rounded-lg transition ${isOver ? "bg-green-200" : ""}`}
    >
      <h3 className="font-bold mb-3">{column.title}</h3>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} columnId={column.id} moveTask={moveTask} />
      ))}
    </div>
  );
};

export const DndAdvancedTutorial: React.FC = () => {
  const [columns] = useState<ColumnType[]>([
    { id: "todo", title: "To Do" },
    { id: "progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]);

  const [tasks, setTasks] = useState<TaskType[]>([
    // TODO
    {
      id: 1,
      title: "Setup repo",
      description: "Initialize Git & project structure",
      columnId: "todo",
    },
    { id: 2, title: "Configure ESLint", description: "Add lint rules", columnId: "todo" },
    {
      id: 3,
      title: "Install UI library",
      description: "Set up Tailwind or Shadcn",
      columnId: "todo",
    },
    {
      id: 4,
      title: "Write API mocks",
      description: "Mock endpoints for local dev",
      columnId: "todo",
    },

    // IN PROGRESS
    { id: 5, title: "Build dashboard", description: "Layout grid & widgets", columnId: "progress" },
    {
      id: 6,
      title: "Add drag-drop logic",
      description: "Enable sorting & movement",
      columnId: "progress",
    },
    { id: 7, title: "Implement auth", description: "Google & email login", columnId: "progress" },
    {
      id: 8,
      title: "Role-based permissions",
      description: "Integrate RBAC system",
      columnId: "progress",
    },

    // DONE
    { id: 9, title: "Create wireframes", description: "Basic visual layout", columnId: "done" },
    { id: 10, title: "Set up CI pipeline", description: "GitHub Actions config", columnId: "done" },
    { id: 11, title: "Deploy staging", description: "Prepare test environment", columnId: "done" },
    {
      id: 12,
      title: "Write documentation",
      description: "Setup README & basic docs",
      columnId: "done",
    },
  ]);

  const moveTask = (taskId: number, from: string, to: string) =>
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, columnId: to } : t)));

  return (
    <div className="grid grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-100">
      {columns.map((col) => (
        <Column
          key={col.id}
          column={col}
          tasks={tasks.filter((t) => t.columnId === col.id)}
          moveTask={moveTask}
        />
      ))}
    </div>
  );
};
export default DndAdvancedTutorial;
