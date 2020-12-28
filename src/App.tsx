import React from 'react';
import './App.css';
import { MainMenu } from './components/MainMenu';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { GameRoom } from './components/GameRoom/GameRoom';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      {/* so our app will reroute to places */}
      <Router>
        <Switch>

          <Route path="/games/:gameId">
            <GameRoom />
          </Route>

          {/* just the regular path, go to main menu */}
          <Route path="/">
            <MainMenu />
          </Route>

        </Switch>
      </Router>
    </div>
  );
}

export default App;
