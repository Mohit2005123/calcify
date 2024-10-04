const COLORS = [
    '#2563eb', // blue
    '#dc2626', // red
    '#16a34a', // green
    '#9333ea', // purple
    '#ea580c', // orange
    '#0891b2', // cyan
    '#4f46e5', // indigo
    '#db2777', // pink
  ];
  const PRESETS = {
    circle: {
      name: 'Circle',
      expression: 'sqrt(4 - x^2)',
      complementary: '-sqrt(4 - x^2)',
      description: 'x² + y² = 4'
    },
    ellipse: {
      name: 'Ellipse',
      expression: 'sqrt(4 - x^2/4)',
      complementary: '-sqrt(4 - x^2/4)',
      description: 'x²/4 + y² = 4'
    },
    parabola: {
      name: 'Parabola',
      expression: 'x^2',
      description: 'y = x²'
    },
    hyperbola: {
      name: 'Hyperbola',
      expression: 'sqrt(x^2/4 - 1)',
      complementary: '-sqrt(x^2/4 - 1)',
      description: 'x²/4 - y² = 1'
    },
    line: {
      name: 'Line',
      expression: '2*x + 1',
      description: 'y = 2x + 1'
    },
    sine: {
      name: 'Sine Wave',
      expression: 'sin(x)',
      description: 'y = sin(x)'
    }
  };
  export {PRESETS, COLORS};