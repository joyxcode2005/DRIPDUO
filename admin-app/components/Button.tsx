

interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Button({ children, onClick }: ButtonProps) {
  return (
    <div
      onClick={onClick}
      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-300 text-center cursor-pointer"
    >
      {children}
    </div>
  );
}