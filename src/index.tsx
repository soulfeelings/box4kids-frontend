import ReactDOM from "react-dom/client";
import "./wdyr"; // why-did-you-render
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
