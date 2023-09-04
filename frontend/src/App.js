import Router from "./Router/Routers";
import "./Style/app.scss";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
function App() {
  return (
    <div className="bg-zinc-950">
      <BrowserRouter>
        <ToastContainer limit={1} autoClose={1000}  hideProgressBar={true} />
        <Router />
      </BrowserRouter>
    </div>
  );
}
export default App;