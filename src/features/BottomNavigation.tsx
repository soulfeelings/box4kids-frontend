import { Home, MoreHorizontal } from "lucide-react";
import { useStore } from "../store";
import { ROUTES } from "../constants/routes";
import { useNavigate } from "react-router-dom";

export const BottomNavigation = ({
  currentScreen,
  onHomeClick,
  onChildrenClick,
  onProfileClick,
}: {
  currentScreen: "home" | "children" | "profile";
  onHomeClick: () => void;
  onChildrenClick: () => void;
  onProfileClick: () => void;
}) => {
  const { currentAppScreen, setCurrentAppScreen } = useStore();
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate(ROUTES.APP.ROOT);
    setCurrentAppScreen("home");
    onHomeClick();
  };

  const handleChildrenClick = () => {
    setCurrentAppScreen("children");
    navigate(ROUTES.APP.CHILDREN);
    onChildrenClick();
  };

  const handleProfileClick = () => {
    setCurrentAppScreen("profile");
    navigate(ROUTES.APP.ROOT);
    onProfileClick();
  };

  return (
    <div
      className="fixed bottom-4 left-4 right-4 bg-gray-800 shadow-lg"
      style={{ borderRadius: "48px" }}
    >
      <div className="flex justify-center items-center space-x-8 px-4 py-3">
        <button
          onClick={handleHomeClick}
          className={`p-3 rounded-2xl ${
            currentAppScreen === "home" ? "bg-purple-500" : ""
          }`}
        >
          <Home size={24} className="text-white" />
        </button>
        <button
          onClick={handleChildrenClick}
          className={`p-3 rounded-2xl ${
            currentAppScreen === "children" ? "bg-purple-500" : ""
          }`}
        >
          <img src="/illustrations/Icon.png" alt="Icon" className="w-6 h-6" />
        </button>
        <button
          onClick={handleProfileClick}
          className={`p-3 rounded-2xl ${
            currentAppScreen === "profile" ? "bg-purple-500" : ""
          }`}
        >
          <MoreHorizontal size={24} className="text-white" />
        </button>
      </div>
    </div>
  );
};
