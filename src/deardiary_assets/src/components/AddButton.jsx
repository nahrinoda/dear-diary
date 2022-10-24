import React from 'react';

function AddButton({ handleClick, buttonName }) {
    return (
        <div className='diaries-container'>
            <div className={`add-new-${buttonName}-button`} onClick={handleClick}>
                <div className='add-new-diary'>
                    <span className='material-icons md-18 add-margin'>add</span>
                    New {buttonName}
                </div>
            </div>
        </div>
    );
}

export default AddButton;