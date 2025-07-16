import React from "react";
import { BottomNavigation } from "../../features/BottomNavigation";
import { UserData } from "../../types";
import { SuccessfulBoxesState } from "../../pages/AppInterface";
import { CurrentToyBoxCard, NextToyBoxCard } from "../../widgets";

interface NextSetDeterminedViewProps {
  userData: UserData;
  boxes: SuccessfulBoxesState[];
  rating: number;
  setCurrentBox: (box: SuccessfulBoxesState["currentBox"]) => void;
  handleStarClick: (starIndex: number) => void;
  getCurrentDate: () => string;
  formatDeliveryDate: (dateString: string) => string;
  formatDeliveryTime: (timeString: string) => string;
}

export const NextSetDeterminedView: React.FC<NextSetDeterminedViewProps> = ({
  userData,
  boxes,
  rating,
  setCurrentBox,
  handleStarClick,
}) => {
  return (
    <div
      className="w-full min-h-screen pb-24"
      style={{ fontFamily: "Nunito, sans-serif", backgroundColor: "#F2F2F2" }}
    >
      <div
        className="p-4"
        style={{
          backgroundColor: "#FFE8C8",
          opacity: 1,
          borderRadius: "0 0 24px 24px",
          aspectRatio: "46%",
        }}
      >
        <h1 className="text-xl text-center font-semibold text-gray-800 mb-6">
          Привет, {userData.name}! 🦋
        </h1>

        {boxes.map((box) => (
          <CurrentToyBoxCard
            key={box.child.id}
            box={box}
            rating={rating}
            setCurrentBox={setCurrentBox}
            handleStarClick={handleStarClick}
            userId={userData.id}
          />
        ))}
      </div>

      {boxes.map((box) => (
        <NextToyBoxCard key={box.child.id} box={box} />
      ))}

      <BottomNavigation
        onHomeClick={() => {}}
        onChildrenClick={() => {}}
        onProfileClick={() => {}}
      />
    </div>
  );
};
