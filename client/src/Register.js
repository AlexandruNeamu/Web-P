import React, {useState} from 'react'
import { useHistory } from 'react-router-dom';

function Register(props){

//user
    const [nume, setNume] = useState('');
    const [username, setUsername] = useState('');
    const [parola, setParola] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    let history = useHistory()

    const handleChangeName = (e) => {
        setNume(e.target.value);
    }

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    }

    const handleChangeParola = (e) => {
        setParola(e.target.value);
    }
    const handleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    
    function validate() {
        // Username
        if (username.replace(/\s/g, "").length < 2 ||
            username.replace(/\s/g, "").length > 15) {
            alert('Numele de utilizator trebuie sa aiba cel putin 5 caractere' +
                ' si maxim 15 caractere')
            return false;
        }

        // Password
        if (parola.replace(/\s/g, "").length <= 2 ||
            parola.replace(/\s/g, "").length >= 16) {
            alert('Parola trebuie sa aiaba cel putin 8 caractere' +
                ' si maxim 15 caractere')
            return false;
        }

        // Confirm password
        if (parola !== confirmPassword) {
            alert('Parolele nu coincid')
            return false;
        }

        // Nume
        if (nume.replace(/\s/g, "").length < 3 ||
            nume.replace(/\s/g, "").length > 15) {
            alert('Numele trebuie sa aiba cel putin 3 caractere' +
                ' si maxim 15 caractere')
            return false;
        }

        return true
    }

    async function register() {
        if (validate()) {
           alert('Adaugat cu succes!') 

            if (await validareDB()) {
                // Call Sign up
                const contNou = {
                    username: username,
                    parola: parola,
                    nume: nume
                }

                fetch('http://localhost:8080/user', {
                    method: 'POST',
                    body: JSON.stringify(contNou),
                    headers: {
                        'content-type': 'application/json',
                        'accept': 'application/json'
                    }
                })

                goLogiIn()
            }
        }
    }

    async function validareDB() {
        let response = await fetch('http://localhost:8080/user', {
            method: 'GET',
        })

        let vect = await response.json()

        console.log(vect, 'functie async')

        for (let i = 0; i < vect.length; i++) {
            console.log(vect[i].username)
            if (username === vect[i].username) {
                alert('Username-ul exista deja!')
                return false;
            }
        }
        return true;
    }


    function goLogiIn() {
        history.push("/login");
    }

    
    return(
        <div>
            <form>
            <div className="form-group text-left">
                <label htmlFor="text">Name</label>
                <input type="text"
                    placeholder="Name"
                    onChange={handleChangeName}
                />
                </div>
                <label htmlFor="text">Uername</label>
                <input type="text"
                    placeholder="Username"
                    onChange={handleChangeUsername}
                />
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="password" 
                        placeholder="Password"
                        onChange={handleChangeParola}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="exampleInputPassword1">Confirm Password</label>
                    <input type="password" 
                        className="form-control" 
                        id="confirmPassword" 
                        placeholder="Confirm Password"
                        onChange={handleChangeConfirmPassword}
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={register}
                >
                    Register
                </button>
            </form>
        </div>
    )
}

export default Register