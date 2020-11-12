import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Main from './Components/Main/Main';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
import Desk from './Components/Desk/Desk';
import Guest from './Components/Guest/Guest';
function App() {
  return <Router id="entire">
    <Switch>
      <Route path="/" exact component={Main} />
      <Route path="/register" component={Register} />
      <Route path="/login" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/desk" exact component={Desk} />
      <Route path="/desk/:id" component={Guest} />
    </Switch>
  </Router>;
}

export default App;