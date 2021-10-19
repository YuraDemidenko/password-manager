import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch} from 'react-redux'
import {registration, userState, login} from '../features/appSlice'
import {useHistory} from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";


export default function Registration() {

    const state = useSelector(userState);
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = getAuth();

   

    let [newUser, setNewUser] = useState({
        email: '',
        password: '',
    });
    

    const regUser = (e) => {
        dispatch(registration(newUser))
    }

    useEffect(() => {   
        onAuthStateChanged(auth, (user) => {
            if (user) {

                if(localStorage.getItem('user')){
                    dispatch(login(JSON.parse(localStorage.getItem('user'))))
                }
                
                history.push('/dashboard')
                
            } 
        });   
    });

    return (
        <div className="wrapper">

            <div className="box">

                <div className="title">
                    <h1>Registration</h1>
                </div>

                <form className="form-box">

                    <input type='email' onChange={event => setNewUser({...newUser, email:  event.target.value})}/>
                    <input type='password' onChange={event => setNewUser({...newUser, password:  event.target.value})}/>
                    
                    <button type="button" onClick={regUser}>Registration</button>

                    <button className='link' onClick={() => history.push('/')} >If you Have An Account, Just Sign In</button>

                </form>

            </div>

        </div>  
    )
}
