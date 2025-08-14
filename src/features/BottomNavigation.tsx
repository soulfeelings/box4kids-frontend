import { Home, MoreHorizontal } from "lucide-react";
import { useStore } from "../store";
import { ROUTES } from "../constants/routes";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const BottomNavigation = ({
  onHomeClick,
  onChildrenClick,
  onProfileClick,
}: {
  onHomeClick?: () => void;
  onChildrenClick?: () => void;
  onProfileClick?: () => void;
}) => {
  const location = useLocation();

  const currentAppScreen = useStore((state) => state.currentAppScreen);
  const setCurrentAppScreen = useStore((state) => state.setCurrentAppScreen);

  useEffect(() => {
    if (location.pathname === ROUTES.APP.ROOT) {
      setCurrentAppScreen("home");
    } else if (location.pathname === ROUTES.APP.CHILDREN) {
      setCurrentAppScreen("children");
    } else if (location.pathname === ROUTES.APP.PROFILE) {
      setCurrentAppScreen("profile");
    }
  }, [location.pathname, setCurrentAppScreen]);

  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate(ROUTES.APP.ROOT);
    onHomeClick?.();
  };

  const handleChildrenClick = () => {
    navigate(ROUTES.APP.CHILDREN);
    onChildrenClick?.();
  };

  const handleProfileClick = () => {
    navigate(ROUTES.APP.PROFILE);
    onProfileClick?.();
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
          <img src="/illustrations/Icon.svg" alt="Icon" className="w-6 h-6" />
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
