import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { Rnd } from "react-rnd";
interface RndBox {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

const RndAdvancedTutorial = () => {
  const [boxes, setBoxes] = useState<RndBox[]>([
    {
      id: 1,
      x: 50,
      y: 50,
      width: 200,
      height: 150,
      color: "from-blue-500 to-cyan-500",
      label: "Box 1",
    },
    {
      id: 2,
      x: 300,
      y: 100,
      width: 180,
      height: 120,
      color: "from-green-500 to-emerald-500",
      label: "Box 2",
    },
    {
      id: 3,
      x: 150,
      y: 250,
      width: 220,
      height: 140,
      color: "from-orange-500 to-red-500",
      label: "Box 3",
    },
  ]);

  // Check if two boxes overlap
  const checkOverlap = (box1: RndBox, box2: RndBox) => {
    // return !box1.id && !box2.id;
    return !(
      box1.x + box1.width <= box2.x ||
      box2.x + box2.width <= box1.x ||
      box1.y + box1.height <= box2.y ||
      box2.y + box2.height <= box1.y
    );
  };

  const updateBox = (id: number, updates: Partial<RndBox>) => {
    const updatedBox = boxes.find((box) => box.id === id);
    if (!updatedBox) return;

    const newBox = { ...updatedBox, ...updates };

    const hasOverlap = boxes.some((box) => {
      if (box.id === id) return false;
      return checkOverlap(newBox, box);
    });

    if (!hasOverlap) {
      setBoxes(boxes.map((box) => (box.id === id ? newBox : box)));
    }
  };

  const deleteBox = (id: number) => {
    setBoxes(boxes.filter((box) => box.id !== id));
  };

  const addBox = () => {
    const colors = [
      "from-purple-500 to-pink-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-blue-500",
      "from-teal-500 to-green-500",
    ];

    const newBox = {
      id: Date.now(),
      x: Math.random() * 200 + 50,
      y: Math.random() * 150 + 50,
      width: 200,
      height: 150,
      color: colors[(boxes.length + 1) % colors.length],
      label: `Box ${boxes.length + 1}`,
    };
    setBoxes([...boxes, newBox]);
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col">
      <button
        onClick={addBox}
        className="bg-blue-500 text-white w-40 px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        + Add New Box
      </button>

      <div className=" h-[75vh] bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-lg">
        {boxes.map((box) => (
          <Rnd
            key={box.id}
            size={{ width: box.width, height: box.height }}
            position={{ x: box.x, y: box.y }}
            onDragStop={(e, d) => {
              updateBox(box.id, { x: d.x, y: d.y });
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
              updateBox(box.id, {
                width: ref.offsetWidth,
                height: ref.offsetHeight,
                x: position.x,
                y: position.y,
              });
            }}
            minWidth={100}
            minHeight={100}
            bounds="parent"
            className={`bg-gradient-to-br ${box.color} rounded-lg shadow-lg`}
          >
            <div className="p-4 text-white h-full flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-lg">{box.label}</h3>
                <p className="text-sm opacity-90">
                  Sizes: {box.width}x{box.height}
                </p>
                <p className="text-sm opacity-90">
                  Postion: ({parseInt(box.x)},{parseInt(box.y)})
                </p>
              </div>
              <button
                onClick={() => deleteBox(box.id)}
                className="absolute right-3 transition-colors"
              >
                <MdDelete className="h-5 w-5" />
              </button>
            </div>
          </Rnd>
        ))}
      </div>
    </div>
  );
};
export default RndAdvancedTutorial;
