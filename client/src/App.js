import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Menu from 'components/menu';
import AppLanding from './AppLanding';
import AlienationDance from './AlienationDance';
import TheGreatRefusal from './TheGreatRefusal';

function App() {
  return (
    <div className="App">
      <Menu />
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <AppLanding />
          </Route>
          <Route path='/the-great-refusal'>
            <TheGreatRefusal/>
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
