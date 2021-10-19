/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { userState, login, logout} from '../features/appSlice'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {useHistory} from "react-router-dom";


export default function Login(props) {
    

    const state = useSelector(userState);
    const dispatch = useDispatch();
    const auth = getAuth();

    const history = useHistory();

    let [user, setUser] = useState({
        email: '',
        password: '',
    });

    function signUser() {
        dispatch(login(user))
    }

    function signOut() {
        dispatch(logout())
    }


    useEffect(() => {   
        onAuthStateChanged(auth, (user) => {
            if (user) {

                if(localStorage.getItem('user')){
                    dispatch(login(JSON.parse(localStorage.getItem('user'))))
                }
                
                history.push('/dashboard')
                
            } else {
                
                history.push('/')
            }
        });   
    });
    


    
    return (
        <div className="wrapper" >
            <div className="box">

                <div className="title">
                    <h1>Sign in</h1>
                </div>

                <form className="form-box">

                    <input type="text" placeholder="Enter your login"
                        onChange={event => setUser({...user, email:  event.target.value})}
                    />
                    
                    <input type="password"  placeholder="Enter your password"
                        onChange={event => setUser({...user, password:  event.target.value})}
                    />

                    <button type="button" onClick={signUser}>Sign in</button>

                    <button className='link' onClick={() => history.push('/registration-page')}>Haven't an account, just register</button>
                    
                </form>

            </div>
        </div>
       
    )

}



