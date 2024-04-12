import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import Menu from "components/menu";
import AppLanding from "./AppLanding";
import AlienationDance from "./AlienationDance";
import TheGreatRefusal from "./TheGreatRefusal";
import ResetPassword from "Auth/ResetPassword";
import FansPortal from "Fans";
import MainLayout from "MainLayout";

function App() {
  const screenSize =
    window.innerWidth >= 740
      ? "desktop"
      : window.innerWidth < 600
      ? "mobile"
      : "tablet";

  return (
    <div className="App">
      <RecoilRoot>
        <BrowserRouter>
          <Menu />
          <Routes>
            <Route
              path="/"
              element={
                <MainLayout>
                  <AppLanding screenSize={screenSize} />
                </MainLayout>
              }
            />
            <Route
              path="/the-great-refusal"
              element={<TheGreatRefusal screenSize={screenSize} />}
            />
            <Route
              path="/alienation-dance"
              element={
                <MainLayout>
                  <AlienationDance />
                </MainLayout>
              }
            />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/fans"
              element={
                <MainLayout>
                  <FansPortal screenSize={screenSize} />
                </MainLayout>
              }
            />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
