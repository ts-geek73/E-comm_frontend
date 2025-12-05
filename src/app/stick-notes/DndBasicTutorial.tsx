import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

interface CardItem {
  id: number;
  text: string;
}

const ItemTypes = { CARD: "card" } as const;

interface DragItem {
  id: number;
  index: number;
  type: string;
}

interface DraggableCardProps {
  id: number;
  text: string;
  index: number;
  moveCard: (from: number, to: number) => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ id, text, index, moveCard }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id, index, type: ItemTypes.CARD },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<DragItem>({
    accept: ItemTypes.CARD,
    hover: (item) => {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`p-3 rounded-lg shadow mb-2 bg-white transition ${
        isDragging ? "opacity-40" : "opacity-100"
      }`}
    >
      {index + 1} . {text}
    </div>
  );
};

export const DndBasicTutorial: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([
    { id: 1, text: "Learn React basics" },
    { id: 2, text: "Master React hooks" },
    { id: 3, text: "Build drag-drop UI" },
    { id: 4, text: "Deploy to production" },
    { id: 5, text: "Explore Next.js routing" },
    { id: 6, text: "Integrate API calls" },
    { id: 7, text: "Add animations with Framer Motion" },
    { id: 8, text: "Optimize bundle size" },
    { id: 9, text: "Write component tests" },
    { id: 10, text: "Refactor old components" },
    { id: 11, text: "Implement theme switcher" },
    { id: 12, text: "Polish UI interactions" },
  ]);

  const moveCard = (from: number, to: number) => {
    const updated = [...cards];
    const [removed] = updated.splice(from, 1);
    updated.splice(to, 0, removed);
    setCards(updated);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-100">
      {cards.map((c, idx) => (
        <DraggableCard key={c.id} id={c.id} text={c.text} index={idx} moveCard={moveCard} />
      ))}
    </div>
  );
};
export default DndBasicTutorial;
