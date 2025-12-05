import { useState } from "react";
import { Rnd } from "react-rnd";

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

const RndBasicTutorial: React.FC = () => {
  const [position, setPosition] = useState<Position>({ x: 100, y: 0 });
  const [size, setSize] = useState<Size>({ width: 300, height: 200 });

  return (
    <div className="p-4 border rounded-lg">
      <Rnd
        size={size}
        position={position}
        onDragStop={(_, d) => setPosition({ x: d.x, y: d.y })}
        onResizeStop={(_, __, ref, ___, newPos) =>
          setSize({ width: ref.offsetWidth, height: ref.offsetHeight }) || setPosition(newPos)
        }
        className="border rounded-md p-3 shadow-md bg-white"
      >
        <div>Resizable / Draggable Box</div>
        <div className="text-xs mt-2">
          Position: {position.x}, {position.y}
        </div>
        <div className="text-xs mt-2">
          Size: {size.width} × {size.height}
        </div>
      </Rnd>
    </div>
  );
};
export default RndBasicTutorial;
