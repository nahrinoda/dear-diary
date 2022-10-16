import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import debounce from 'lodash/debounce';
import MyDiaries from './MyDiaries';
import Card from './Card';
import { deardiary } from '../../../declarations/deardiary';
import { useNavigate } from "react-router-dom";
import { Principal } from '@dfinity/principal';
import Header from './Header';


function Create() {
    let navigate = useNavigate();

    const [label, setLabel] = useState();
    const [content, setContent] = useState();
    const [diaryId, setDiaryId] = useState(0);
    const [diariesList, setDiariesList] = useState([]);
    const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(true);
    const [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState(true);
    const [isDeleteBtnDisabled, setIsDeleteBtnDisabled] = useState(true);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isMintButtonHidden, setIsMintButtonHidden] = useState(true);
    const [nftPrincipal, setNftPrincipal] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [diary, setDiary] = useState();
    const [createButtonShowing, setCreateButtonShowing] = useState(true);
    const [isNewDiary, setIsNewDiary] = useState(true);

    const inputLabel = useRef(null);
    const inputContent = useRef(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const diariesList = await deardiary.readDiaries();
        console.log('diariesList: ', diariesList)
        setDiaryId(diariesList.length)
        setDiariesList(diariesList);
    };

    const handleLabelChange = useCallback((e) => {
        const currentLabel = e.currentTarget.value;
        setIsSaveBtnDisabled(false);
        setLabel(currentLabel);
    }, [label]);

    const debouncedLabelChangeHandler = useMemo(
        () => debounce((event) => handleLabelChange(event), 500),
        [handleLabelChange]
    );

    const handleContentChange = useCallback((e) => {
        const currentContent = e.currentTarget.value;
        setIsSaveBtnDisabled(false);
        setContent(currentContent);
    }, [content]);

    const debouncedContentChangeHandler = useMemo(
        () => debounce((event) => handleContentChange(event), 500),
        [handleContentChange]
    );

    const handleSaveDiary = (e) => {

        if (!diariesList.length) {
            handleCreateNewDiary(e);
        } else {
            setDiariesList(previousDiariesList => {
                const currentDiaryId = Number(previousDiariesList[selectedIndex].id);
                const today = new Date();
                const date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();

                let newDiary = {
                    id: currentDiaryId,
                    label: !label ? 'Diary Label' : label,
                    content: !content ? 'New Diary...' : content,
                    createdAt: date
                };
                setDiaryId(currentDiaryId);
                setSelectedIndex(selectedIndex);
                deardiary.removeDiaries(selectedIndex);
                deardiary.createDiary(newDiary.id, newDiary.label, newDiary.content, newDiary.createdAt);
                previousDiariesList.splice(selectedIndex, 1);
                return [newDiary, ...previousDiariesList];
            });
        };

        setIsSaveBtnDisabled(true);
        setIsMintButtonHidden(false);
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

    const handleCreateNewDiary = (e) => {
        setCreateButtonShowing(false);
        setIsSaveBtnDisabled(true);
        const today = new Date();
        const date = (today.toLocaleString('en-us', { month: 'long' })) + ', ' + today.getFullYear();
        const currentDiaryId = Number(diaryId + 1);
        let newDiary = {
            id: currentDiaryId,
            label: 'Diary Label',
            content: 'New Diary...',
            createdAt: date
        };

        setDiaryId(currentDiaryId);

        setDiariesList(previousDiariesList => {
            deardiary.createDiary(newDiary.id, newDiary.label, newDiary.content, newDiary.createdAt);
            return [newDiary, ...previousDiariesList];
        });
    };

    const selectDiary = (e) => {
        const targetId = Number(e.currentTarget.id);
        const selectedIndex = diariesList.findIndex((diary) => Number(diary.id) === targetId);

        setSelectedIndex(selectedIndex);
        setLabel(diariesList[selectedIndex].label);
        setContent(diariesList[selectedIndex].content);
        setDiaryId(targetId);
        setIsMintButtonHidden(false);
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
        createButtonShowing(true);
        setShowModal(false);
    };

    const openGalleryPage = () => {
        let path = '/collection';
        navigate(path);
    };

    const saveButtonStyle = isSaveBtnDisabled ? 'button-inactive' : 'button';

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
                            <div className='diaries-collection'>
                                {diariesList.map((diary, index) => <Card key={index} id={nftPrincipal !== "" && nftPrincipal.toText()} role="diaries"/>)}
                            </div>
                        </>
                    ) : (
                        <div className="diary">
                            <div className='diary-controls'>
                                <div className='diary-label-container'>
                                    <input
                                        ref={inputLabel}
                                        className='label'
                                        name='label'
                                        placeholder='Diary Label'
                                        value={label}
                                        onChange={debouncedLabelChangeHandler}
                                    />
                                    {/* <span className='material-icons md-18 arrow-down-icon' onClick={handleTitleOptions} hidden={true}>keyboard_arrow_down</span> */}
                                </div>
                                <div className='buttons-container'>
                                    <button
                                        id="save-button"
                                        className={`save-${saveButtonStyle}`}
                                        onClick={handleSaveDiary}
                                        disabled={isSaveBtnDisabled}
                                    >
                                        <span className='material-icons md-18'>save</span>
                                    </button>
                                    <button
                                        id="delete-button"
                                        className={'delete-button'}
                                        onClick={handleCloseDiary}
                                    >
                                        <span className='material-icons md-18'>close</span>
                                    </button>
                                </div>
                            </div>
                            <textarea
                                ref={inputContent}
                                className='diary-content'
                                name='content'
                                placeholder='Start writting your thoughts here...'
                                value={content}
                                onChange={debouncedContentChangeHandler}
                            />
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default Create;