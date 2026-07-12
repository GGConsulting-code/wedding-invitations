import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { AppRouter } from "./app/router.jsx";
import { store } from "./app/store.js";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AppRouter />
  </Provider>,
);
