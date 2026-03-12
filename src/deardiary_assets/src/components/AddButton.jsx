import React from 'react';

function AddButton({ handleClick, buttonName }) {
    return (
        <div className='diaries-container'>
            <button className={`add-new-${buttonName}-button`} onClick={handleClick} aria-label={`New ${buttonName}`}>
                <div className='add-new-diary'>
                    <span className='material-icons md-18 add-margin' aria-hidden="true">add</span>
                    New {buttonName}
                </div>
            </button>
        </div>
    );
}

export default AddButton;