import React,{useState} from 'react'
import { UserContext } from './context';
import './App.css'
import stop from './Stop-Wasting-Food.jpg'
import {Route,NavLink,HashRouter, Switch} from 'react-router-dom'
import User from './User'
import Groups from './Groups'
import FoodItems from './FoodItems'
import Login from './Login'
import Register from './Register'
import Home from './Home'

function App(){
  
    const [user, setUser] = useState(null);
    return(
      <UserContext.Provider value={{ user, setUser }}>
        <HashRouter>
          <div>
            <img id="stop" src={stop} alt="Stop wasting food" />
            <ul className="header">
              <li><NavLink to="/home">Home</NavLink></li>
              <li><NavLink to="/user">User</NavLink></li>
              <li><NavLink to="/groups">Groups</NavLink></li>
              <li><NavLink to="/foodItems">Food items</NavLink></li>
              <li id="login"><NavLink to="/login">Login</NavLink></li>
            </ul>
            <div className="content">
              <Switch>
                <Route path="/user" component={User}/>
                <Route path="/groups" component={Groups}/>
                <Route path="/foodItems" component={FoodItems}/>
                <Route path="/login" component={Login}/>
                <Route path="/register" component={Register}/>
                <Route path="/home" component={Home}/>
              </Switch>
            </div>
          </div>
        </HashRouter>
      </UserContext.Provider>
    )
}

export default App;
