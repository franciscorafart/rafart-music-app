import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AppLanding from './AppLanding';
import AlienationDance from './AlienationDance';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route path='/'>
            <AppLanding />
            {/* <AlienationDance /> */}
          </Route>
          <Route path='/alienation-dance'>
            <AlienationDance />
          </Route>
        </Switch>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
