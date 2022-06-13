import React from 'react';

function LeftSidebar({ handleAddNewDiary }) {
    return (
        <div className='left-sidebar'>
            <div>Left Sidebar</div>
            <div className='add-new-diary' onClick={handleAddNewDiary}>Add</div>
        </div>
    );
}

export default LeftSidebar;