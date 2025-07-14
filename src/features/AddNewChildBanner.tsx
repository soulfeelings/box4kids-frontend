export const AddNewChildBanner = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      className="rounded-2xl p-4 text-center"
      style={{ backgroundColor: "#747EEC" }}
      onClick={onClick}
    >
      <p className="text-white font-medium mb-2">Добавьте еще одного ребенка</p>
      <p className="text-white text-sm mb-3">
        и получите скидку 20% на следующий набор
      </p>
      <button className="bg-white/30 text-white w-full px-6 py-1 rounded-2xl font-medium text-sm">
        Добавить ребенка
      </button>
    </div>
  );
};
