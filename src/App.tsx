import { Suspense, lazy } from "react";
import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";

const Register = lazy(() => import("./components/Auth/Register"));

function App() {
  return (
    <div className="App">
      
        <Routes>
          <Route
            path="/register"
            element={
              <Suspense fallback={<></>}>
                <Register />
              </Suspense>
            }
          />
          <Route path="*" element={<Navigate to={"/register"} />} />
        </Routes>
      
    </div>
  );
}

export default App;
