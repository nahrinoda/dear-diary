import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import CreateDiary from './CreateDiary';
import Card from './Card';
import { deardiary } from '../../../declarations/deardiary';
import { useNavigate } from "react-router-dom";
import { Principal } from '@dfinity/principal';
import Header from './Header';


function Create() {
    let navigate = useNavigate();

    const [label, setLabel] = useState();
    const [content, setContent] = useState();
    const [diariesList, setDiariesList] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [nftPrincipal, setNftPrincipal] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [createButtonShowing, setCreateButtonShowing] = useState(true);
    const [diaries, setDiaries] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const diariesList = await deardiary.readDiaries();
        setDiaryId(diariesList.length)
        setDiariesList(diariesList);
    };

    const handleCloseDiary = (e) => {
        setCreateButtonShowing(true);
    };

    const handleDeleteDiary = (e) => {
        setCreateButtonShowing(true);
        deardiary.removeDiaries(selectedIndex);
        setDiariesList(previousDiariesList => {
            previousDiariesList.splice(selectedIndex, 1);
            return previousDiariesList.filter((diary, index) => {
                return previousDiariesList[index] !== selectedIndex
            });
        }
        );

        if (!diariesList.length) {
            setContent('');
            setLabel('');
        };

        const currentIndex = selectedIndex > 0 ? selectedIndex - 1 : 0;
        setSelectedIndex(currentIndex)
        setIsSaveBtnDisabled(true);
    };

    const handleCreateNewDiary = (newDiary) => {
        setCreateButtonShowing(false);

        // const today = new Date();
        // const date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();
        // const currentDiaryId = Number(diaryId + 1);
        // let newDiary = {
        //     id: currentDiaryId,
        //     label: 'Diary Label',
        //     content: 'New Diary...',
        //     createdAt: date
        // };

        // setDiaryId(currentDiaryId);

        // setDiariesList(previousDiariesList => {
        //     deardiary.createDiary(newDiary.id, newDiary.label, newDiary.content, newDiary.createdAt);
        //     return [newDiary, ...previousDiariesList];
        // });
    };

    const handleEdit = (e) => {
        console.log('open diary');
        setCreateButtonShowing(false);
    };

    const handleMintDiaryOnClick = async (e) => {
        setShowModal(true);
        setShowLoader(true);

        const name = diariesList[selectedIndex].label;
        const content = diariesList[selectedIndex].content
        const newNFTID = await deardiary.mint(name, content)

        setNftPrincipal(newNFTID);

        deardiary.removeDiaries(selectedIndex);
        setShowLoader(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openGalleryPage = () => {
        let path = '/collection';
        navigate(path);
    };

    const handleAddingDiary = (newDiary) => {
        setDiaries((prevDiaries) => {
            return [...prevDiaries, newDiary]
        });
    };

    return (
        <>
            <Header />
            {
                showModal && (
                    <div className='minting-modal' onClick={closeModal}>
                        {nftPrincipal !== "" && (
                            <>
                                <h2 className="minted-success">MINTED!</h2>
                                <Card id={nftPrincipal.toText()} handleCardOnClick={openGalleryPage} cardStyle={{ cursor: "pointer" }} />
                            </>
                        )}
                        {showLoader && (
                            <div className="lds-ellipsis">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        )}
                    </div>
                )
            }
            <div className="content">
                {/* <MyDiaries
                    handleCreateNewDiary={handleCreateNewDiary}
                    diariesList={diariesList}
                    selectDiary={selectDiary}
                    selectedIndex={selectedIndex}
                    mintIsHidden={isMintButtonHidden}
                    handleMintDiaryOnClick={handleMintDiaryOnClick}
                    nftPrincipal={nftPrincipal}
                    isShowing={createButtonShowing}
                    handleEditDIary={selectDiary}
                /> */}
                {
                    createButtonShowing ? (
                        <>
                            <div className='diaries-container'>
                                <div className='add-new-diary-button' onClick={handleCreateNewDiary}>
                                    <div className='add-new-diary'>
                                        <span className='material-icons md-18 add-margin'>add</span>
                                        New Diary
                                    </div>
                                </div>
                            </div>
                            {diaries.map((diary, index) => (
                                <Card key={index} 
                                    staticTitle={diary.title} 
                                    staticContent={diary.content} 
                                    handleMint={handleMintDiaryOnClick} 
                                    handleDelete={handleDeleteDiary} 
                                    handleEdit={handleEdit} 
                                    isCardMinted={false}
                                />
                                )
                            )}
                        </>
                    ) : (
                        <CreateDiary
                            onAdd={handleAddingDiary}
                            handleCloseDiary={handleCloseDiary}
                        />
                    )
                }
            </div>
        </>
    );
}

export default Create;