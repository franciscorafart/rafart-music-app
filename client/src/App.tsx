import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import Menu from "components/menu";
import AppLanding from "./AppLanding";
import AlienationDance from "./AlienationDance";
import TheGreatRefusal from "./TheGreatRefusal";
import Login from "Auth/Login";

function App() {
  const screenSize =
    window.innerWidth >= 740
      ? "desktop"
      : window.innerWidth < 600
      ? "mobile"
      : "tablet";
  console.log("screenSize", screenSize);
  return (
    <div className="App">
      <RecoilRoot>
        <Menu />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLanding screenSize={screenSize} />} />
            <Route
              path="/the-great-refusal"
              element={<TheGreatRefusal screenSize={screenSize} />}
            />
            <Route path="/alienation-dance" element={<AlienationDance />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </div>
  );
}

export default App;
