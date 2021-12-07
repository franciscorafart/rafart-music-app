import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Menu from 'components/menu';
import AppLanding from './AppLanding';
import AlienationDance from './AlienationDance';
import TheGreatRefusal from './TheGreatRefusal';

function App() {
  const screenSize = window.innerWidth >= 740 ? 'desktop' : window.innerWidth < 600 ? 'mobile' : 'tablet';
  console.log('screenSize', screenSize)
  return (
    <div className="App">
      <Menu />
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <AppLanding screenSize={screenSize} />
          </Route>
          <Route path='/the-great-refusal'>
            <TheGreatRefusal screenSize={screenSize} />
          </Route>
          <Route path='/alienation-dance'>
            <AlienationDance screenSize={screenSize} />
          </Route>
        </Switch>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
