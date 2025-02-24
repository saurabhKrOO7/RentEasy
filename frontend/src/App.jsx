import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./components/Footer.jsx";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
export default App;
