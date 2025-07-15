export const Tag: React.FC<{
  children: React.ReactNode;
  selected?: boolean;
}> = ({ children, selected = false }) => (
  <span
    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
      selected ? "text-gray-700" : "bg-gray-100 text-gray-700"
    }`}
    style={{
      fontFamily: "Nunito, sans-serif",
      backgroundColor: selected ? "#F2F2F2" : undefined,
    }}
  >
    {children}
  </span>
);
