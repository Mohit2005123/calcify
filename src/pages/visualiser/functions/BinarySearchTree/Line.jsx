const Line = ({ start, end }) => (
    <line
      x1={start.x}
      y1={start.y}
      x2={end.x}
      y2={end.y}
      stroke="#4B5563"
      strokeWidth="2"
    />
  );
  export default Line;