import React ,{useState,useContext}from 'react'
import { UserContext } from './context';
import {useHistory, NavLink} from 'react-router-dom'
import './Login.css'
import lock from './lock.jpg'

function Login(){
  const { user, setUser } = useContext(UserContext);
  const [username, setUserName] = useState('');
  const [parola, setparola] = useState('');
  
  let history = useHistory();
  const handleChangeUsername = (e) => {
    setUserName(e.target.value);
  }
  const handleChangeparola = (e) => {
    setparola(e.target.value);
  }

  function validate() {
    if (username.replace(/\s/g, "").length < 2 || username.replace(/\s/g, "").length > 15) {
      alert("Username-ul este invalid!");
      return false;
    }
    if (parola.replace(/\s/g, "").length < 2 || parola.replace(/\s/g, "").length > 16) {
      alert("parola-ul este invalid!");
      return false;
    }
    return true;

  }

  async function Login() {
    if (validate()) {
      if (await validareDB()) {
        goUseri()
      }
    }
  }

  async function validareDB() {
    let response = await fetch('http://localhost:8080/user', {
      method: 'GET',
    })

    let vect = await response.json()

    console.log(vect)

    for (let i = 0; i < vect.length; i++) {
      if (username === vect[i].username &&
        parola === vect[i].parola) {
        setUser(vect[i].id);
        return true;
      }
    }

    alert('Username sau parola gresite!')
    return false;
  }

  function goUseri() {
    history.push("/user");
  }

  

  return(
    <div>
      <label htmlFor="username">Username: </label>
        <input type="text" id="username" onChange={handleChangeUsername} />
        <label htmlFor="password">Password: </label>
        <input type="password" id="password" onChange={handleChangeparola} />

        <input type="button" value="Log in" id="btnLogIn" onClick={Login} />
        <li><NavLink to="/register">No account? Create one</NavLink></li>
        <img id="lock" src={lock}></img>
    </div>
  )

}

export default Login