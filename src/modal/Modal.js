import React from 'react'
import './Modal.css'


export default function Modal(props) {

   
    let className = 'modal-container';

    if (props.openModal) className += ' active';

    return (
        <div className={className}>

            <div className="overlay" onClick={props.onChange}/>

            <div className="modal">
                {props.addModal}
                {props.addForm}
                {props.changeFeild}
            </div>

        </div>
    )
  
}
