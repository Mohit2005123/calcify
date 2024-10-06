// Node component for the tree
const Node = ({ id, value, position, onDragStart, onDragOver, onDrop, isHighlighted }) => (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, position)}
      className={`absolute w-12 h-12 rounded-full flex items-center justify-center cursor-move
        ${isHighlighted ? 'bg-green-500 text-white' : 'bg-white border-2 border-gray-300'}
        transition-colors duration-300 shadow-md`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {value}
    </div>
  );
  export default Node;