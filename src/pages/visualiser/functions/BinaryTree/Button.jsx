const Button = ({ onClick, disabled, children, className }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-colors
        ${disabled 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
          : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'}
        ${className}`}
    >
      {children}
    </button>
  );
  export default Button;