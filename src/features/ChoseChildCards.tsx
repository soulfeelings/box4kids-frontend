import { UserData } from "../types";
import { dateManager } from "../utils/date/DateManager";

export const ChoseChildCards = ({
  user,
  handleChildSelect,
  selectedChildId,
  handleAddNewChild,
  isCreatingNew,
}: {
  user: UserData;
  handleChildSelect: (childId: number) => void;
  selectedChildId: number | null;
  handleAddNewChild: () => void;
  isCreatingNew: boolean;
}) => {
  return (
    <>
      {user?.children && user.children.length > 0 && (
        <div className="space-y-3 mb-6">
          {user.children.map((child) => (
            <button
              key={child.id}
              onClick={() => handleChildSelect(child.id)}
              className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                selectedChildId === child.id
                  ? "border-[#7782F5] bg-[#7782F5]/5"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span
                      className="text-sm font-medium text-indigo-600"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {child.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p
                      className="font-medium text-gray-900"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {child.name}
                    </p>
                    <p
                      className="text-sm text-gray-500"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      {dateManager.getAgeWithDeclension(child.date_of_birth)} •{" "}
                      {child.gender === "male" ? "Мальчик" : "Девочка"}
                    </p>
                  </div>
                </div>
                {selectedChildId === child.id && (
                  <div className="w-5 h-5 rounded-full bg-[#7782F5] flex items-center justify-center">
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="white"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}

          {/* Add New Child Button */}
          <button
            onClick={handleAddNewChild}
            className={`w-full p-4 rounded-2xl border-2 border-dashed transition-all text-left ${
              isCreatingNew
                ? "border-[#7782F5] bg-[#7782F5]/5"
                : "border-gray-300 bg-gray-50 hover:border-gray-400"
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              <p
                className="font-medium text-gray-700"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Добавить ребенка
              </p>
            </div>
          </button>
        </div>
      )}
    </>
  );
};
