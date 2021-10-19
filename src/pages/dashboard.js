
import Modal from '../modal/Modal'
import React, {Fragment, useState, useEffect} from 'react'
import { userState, logout, setNewRecord, deleteRecord, getRecords, changeRecord, hidePassword} from '../features/appSlice'
import { useSelector, useDispatch } from 'react-redux'
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {useHistory} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash,  faEye, faPen} from '@fortawesome/free-solid-svg-icons'


export default function DashBoard(props) {

    const state = useSelector(userState);
    const dispatch = useDispatch();
    const auth = getAuth();
    const history = useHistory();
    const trashBtn = <FontAwesomeIcon icon={faTrash} />
    const hideBtn = <FontAwesomeIcon icon={faEye} />
    const changeBtn = <FontAwesomeIcon icon={faPen} />

  
    let [active, setActive] = useState(false);

    let [isHidden, setIsHidden] = useState(false);

    let [button, setButton] = useState(false);

    let [itemIndex, setIndex] = useState('');

    let [record, setRecord] = useState({
        title: '',
        password: '',
        email: '',
        hidePass: false
    });

    const openModal = () => {
        setActive(active = !active)
    }

    const hidePass = (index, item) => {

        setIsHidden(isHidden = !isHidden)

        let hidePassItem = {
            title: item.title,
            email: item.email,
            password: item.password,
            hidePass: isHidden
        }

        let hideRecords = state.records.slice();

        hideRecords.splice(index, 1, hidePassItem);
        
        dispatch(hidePassword(hideRecords))
    }

    const signOut = () => {
        dispatch(logout())
        history.push('/')
    }

    const setRecordData = () => {
        dispatch(setNewRecord(record))
        openModal()
    }

    const openEditModal = (item, index) => {

        setButton(true);
        openModal();
        setIndex(index)
    }

    const setEditItem = () => {
        let editItem = state.records.slice();

        editItem.splice(itemIndex, 1, record);

        dispatch(changeRecord(editItem));
        
        openModal()
    }

    useEffect(() => {

        onAuthStateChanged(auth, (user) => {
            if (user) dispatch(getRecords(user.uid))   
        });
        
    }, [] );
    

    return (

        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1>Password List</h1>

                <nav>
                    <button className="add" onClick={() => {openModal(); setButton(false)}}>Add New Record</button>
                    <button className="logout" onClick={signOut}>Logout</button>
                </nav>
            </div>

            <div className="table-box">
                <table>
                    <thead className="table-header">
                        <tr>
                            <th>Services</th>
                            <th>Email</th>
                            <th>Password</th>     
                        </tr>
                    </thead>
                    
                    <tbody className="table-body">
                        {state.records.map((item, index) => (
                            <tr key={index}>
                                <td >{item.title}</td>
                                <td >{item.email}</td>

                                {item.hidePass ? (
                                    <td >{item.password}</td>
                                ) : (
                                    <td >{item.password.replace(item.password, '*').repeat(item.password.length)}</td>
                                )}

                                <td className='icon' onClick={() => dispatch(deleteRecord(item))}>{trashBtn}</td>
                                
                                <td className='icon' onClick={() => hidePass(index, item)}>{hideBtn}</td>

                                <td className='icon' onClick={() => openEditModal(item, index)}>{changeBtn}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <Fragment>

                <Modal openModal={active} onChange={openModal}

                    addForm={
                        <form>

                            <input type='text' placeholder='Enter Password Title' 
                            onChange={event => setRecord({...record, title:  event.target.value})}/>

                            <input type='text' placeholder='Enter Your Email' 
                            onChange={event => setRecord({...record, email:  event.target.value})}/>

                            <input type='text' placeholder='Enter Your Password' 
                            onChange={event => setRecord({...record, password:  event.target.value})}/>

                            {button ? (
                                <button type='button' onClick={setEditItem} >Edit record</button>
                                ) : (
                                <button type='button' onClick={setRecordData} >Set record</button>
                            )}

                        </form>
                    }
                    
                />
               
            </Fragment>

        </div>
        
    )

}





