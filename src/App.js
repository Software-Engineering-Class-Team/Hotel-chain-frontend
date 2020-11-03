import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Main from './Components/Main/Main';
import Register from './Components/Register/Register';
import Login from './Components/Login/Login';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
function App() {
  return (
    <Router id="entire">
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/profile" component={Profile}/>
      </Switch>
    </Router>
  );
}

export default App;