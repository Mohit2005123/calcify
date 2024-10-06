const Node = ({ id, value, position, isHighlighted }) => (
    <div
      className={`absolute w-12 h-12 rounded-full flex items-center justify-center
        ${isHighlighted ? 'bg-green-500 text-white' : 'bg-white'}
        border-2 border-blue-500 shadow-md transition-colors duration-300`}
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {value}
    </div>
  );

  export default Node;