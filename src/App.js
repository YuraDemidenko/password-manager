import './App.css'
import React from 'react'
import { BrowserRouter as Router, Route, Switch, useHistory} from "react-router-dom"
import Login from './pages/login-page'
import Registration from './pages/register-page'
import DashBoard from './pages/dashboard'


function App() {

    const history = useHistory();
    
    return (
        <Router history={history}>
            <div className="app-container"> 

                <Switch>               

                    <Route path="/registration-page">   
                        <Registration/>        
                    </Route>
                       
                    <Route path="/dashboard">
                        <DashBoard/>   
                    </Route>

                    <Route path="/">
                        <Login/>    
                    </Route>   

                </Switch>             

            </div>
        </Router>

    );
}

export default App;
