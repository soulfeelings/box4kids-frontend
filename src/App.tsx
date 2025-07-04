import React, { useState } from "react";
import { LoginPage } from "./pages/LoginPage";
import { KidsAppInterface } from "./pages/KidsAppInterface";

// Interface for user data
interface UserData {
  name: string;
  phone: string;
  children: Array<{
    id: string;
    name: string;
    birthDate: string;
    gender: "male" | "female";
    limitations: "none" | "has_limitations";
    comment: string;
    interests: string[];
    skills: string[];
    subscription: "base" | "premium" | "";
  }>;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
}

// Test data for demonstration
const testUserData: UserData = {
  name: "Елена",
  phone: "+7 (999) 123-45-67",
  children: [
    {
      id: "1",
      name: "Алина",
      birthDate: "15/03/2016",
      gender: "female",
      limitations: "none",
      comment: "",
      interests: ["Конструкторы", "Творчество"],
      skills: ["Логика", "Воображение", "Творчество"],
      subscription: "base"
    }
  ],
  deliveryAddress: "г. Москва, ул. Тверская, д. 1, кв. 10",
  deliveryDate: "24 апреля, Чт",
  deliveryTime: "14:00 – 18:00"
};

function App() {
  const [currentPage, setCurrentPage] = useState<"login" | "kids">("login");
  const [userData, setUserData] = useState<UserData | null>(null);

  const handleNavigateToKidsPage = (data: UserData) => {
    setUserData(data);
    setCurrentPage("kids");
  };

  const handleTestDemo = () => {
    setUserData(testUserData);
    setCurrentPage("kids");
  };

  if (currentPage === "kids" && userData) {
    return <KidsAppInterface userData={userData} />;
  }

  return (
    <div>
      <LoginPage onNavigateToKidsPage={handleNavigateToKidsPage} />
    </div>
  );
}

export default App;
