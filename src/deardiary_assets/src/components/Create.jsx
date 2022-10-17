import React, { useEffect, useState } from 'react';
import CreateDiary from './CreateDiary';
import Card from './Card';
import { deardiary } from '../../../declarations/deardiary';
import { useNavigate } from "react-router-dom";
import { Principal } from '@dfinity/principal';
import Header from './Header';


function Create() {
    let navigate = useNavigate();

    const [diariesList, setDiariesList] = useState([]);
    const [nftPrincipal, setNftPrincipal] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [createButtonShowing, setCreateButtonShowing] = useState(true);
    const [editTitle, setEditTitle] = useState();
    const [editContent, setEditContent] = useState();
    const [isDiaryEddited, setIsDiaryEddited] = useState(false);
    const [diaries, setDiaries] = useState([]);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const diariesArray = await deardiary.readDiaries();
        setDiaries(diariesArray);
    };

    const handleAddingDiary = (newDiary) => {
        const currentTitle = newDiary.title;
        const currentContent = newDiary.content;
        setDiaries((prevDiaries) => {
            deardiary.createDiary(currentTitle, currentContent);
            return [newDiary, ...prevDiaries];
        });
    };

    const handleDeleteDiary = (id) => {
        deardiary.removeDiaries(id);
        setDiaries((prevDiary) => {
            return prevDiary.filter((diary, index) => {
                return index !== id;
            })
        });
    };

    const handleCloseDiary = (e) => {
        setCreateButtonShowing(true);
    };

    const handleCreateNewDiary = () => {
        setCreateButtonShowing(false);
    };

    const handleEditDiary = (id) => {
        setCreateButtonShowing(false);
        const currentDiary = diaries[id];
        setEditTitle(currentDiary.title);
        setEditContent(currentDiary.content);
        setIsDiaryEddited(true);
    };

    const handleMintDiaryOnClick = async (id) => {
        console.log(id)
        setShowLoader(true);
        handleDeleteDiary(id);
        const title = diaries[id].title;
        const content = diaries[id].content;
        const newNFTID = await deardiary.mint(title, content)

        setNftPrincipal(newNFTID);
        setShowLoader(false);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openGalleryPage = () => {
        let path = '/collection';
        navigate(path);
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
                            <div className='diaries-gallery'>
                                {diaries.map((diary, index) => (
                                    <Card
                                        key={index}
                                        id={index}
                                        staticTitle={diary.title}
                                        staticContent={diary.content}
                                        onMint={handleMintDiaryOnClick}
                                        onDelete={handleDeleteDiary}
                                        // onEdit={handleEditDiary}
                                        isCardMinted={false}
                                    />
                                )
                                )}
                            </div>
                        </>
                    ) : (
                        <CreateDiary
                            onAdd={handleAddingDiary}
                            handleCloseDiary={handleCloseDiary}
                            editTitle={editTitle}
                            editContent={editContent}
                            isDiaryEddited={isDiaryEddited}
                        />
                    )
                }
            </div>
        </>
    );
}

export default Create;