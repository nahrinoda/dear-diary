import React, { useEffect, useState } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../../../declarations/nft';
import { deardiary } from '../../../declarations/deardiary';
import { Principal } from '@dfinity/principal';
import CURRENT_USER_ID from '../index';

function Card({
    id,
    handleCardOnClick,
    cardStyle,
    role,
    staticContent,
    staticTitle,
    onEdit,
    onMint,
    onDelete,
    isCardMinted = true,
    currentImage
}) {
    const [label, setLabel] = useState();
    const [owner, setOwner] = useState();
    const [content, setContent] = useState();
    const [button, setButton] = useState();
    const [priceInput, setPriceInput] = useState();
    const [priceListing, setPriceListing] = useState();
    const [blur, setBlur] = useState();
    // const [image, setImage] = useState();

    const currentId = id;

    const localHost = "http://localhost:8080/";
    const agent = new HttpAgent({ host: localHost });
    // TODO: remove following line when deploy
    agent.fetchRootKey();
    let NFTActor;

    const loadNFT = async () => {
        NFTActor = await Actor.createActor(idlFactory, {
            agent,
            canisterId: currentId,
        });

        const label = await NFTActor.getLabel();
        setLabel(label);

        const owner = await NFTActor.getOwner();
        const ownerToText = owner.toText();
        setOwner(ownerToText);

        const content = await NFTActor.getContent();
        setContent(content);

        // const coverImage = await NFTActor.getCoverImage();
        // const imageContent = new Uint8Array(coverImage);
        // const image = URL.createObjectURL(new Blob([imageContent.buffer], { type: 'image/png' }));
        // setImage(image);

        if (role === "collection") {
            const nftIsListed = await deardiary.isListed(id);

            if (nftIsListed) {
                setOwner("DearDiary");
                setBlur({ filter: "blur(2px)" });
                setButton(<div className="listed-banner">LISTED</div>);
            } else {
                setButton(<button onClick={handleOnClick} className="sell-confirm-button">Sell</button>);
            };

        } else if (role === "discover") {
            const originalOwner = await deardiary.getOriginalOwner(id);
            if (originalOwner.toText() !== CURRENT_USER_ID.toText()) {
                setButton(<button onClick={handleBuy} className="sell-confirm-button">Buy</button>);
            } else {
                setButton(<div className="listed-banner">You own this NFT</div>);
            }

            const price = await deardiary.getListedNFTPrice(id);

            setPriceListing(
                <div className="card-listing">
                    <b className="add-margin">Price: </b>
                    {price.toString()}
                    <span className="material-icons md-18">currency_bitcoin</span>
                </div>
            );
        } else if (role === "diaries") {
            const nftIsListed = await deardiary.isListed(id);

            if (nftIsListed) {
                setOwner("DearDiary");
                setBlur({ filter: "blur(2px)" });
                setButton(<div className="listed-banner">LISTED</div>);
            } else {
                setButton(<button onClick={handleOnClick} className="sell-confirm-button">Sell</button>);
            };

        }
    };

    useEffect(() => {
        loadNFT();
    }, []);

    let price;

    const handleDelete = (e) => {
        onDelete(id);
    };

    const handleEdit = (e) => {
        onEdit(id);
    };

    const handleMint = (e) => {
        onMint(id);
    };

    const handlePriceChange = (e) => {
        price = e.target.value;
    };

    const handleOnClick = (e) => {
        setPriceInput(
            <div className="nft-price-container">
                <span className="material-icons md-18 add-margin">
                    currency_bitcoin
                </span>
                <input
                    className="nft-price"
                    name="nft-price"
                    type="number"
                    placeholder="Enter price here"
                    value={price}
                    onChange={handlePriceChange}
                />
            </div>
        );
        setButton(<button onClick={handleSell} className="sell-confirm-button">Confirm</button>)
    };

    const handleBuy = async (e) => {
        console.log('Buy NFT')
    };

    const handleSell = async (e) => {
        setBlur({ filter: "blur(2px)" });
        setButton(
            <button className="sell-confirm-button">
                <div className="lds-ellipsis">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </button>
        );
        const listingResult = await deardiary.listItem(id, Number(price));
        if (listingResult == "Success") {
            const dearDiaryId = await deardiary.getDearDiaryCanisterID();
            const transferResult = await NFTActor.transferOwnership(dearDiaryId);
            if (transferResult == "Success") {
                setButton(<div className="listed-banner">LISTED</div>);
                setPriceInput();
                setOwner("DearDiary");
            };
        };
    };

    return (
        <div className="card-container" onClick={handleCardOnClick} style={cardStyle}>
            {
                isCardMinted ? (
                    <>
                        <div>
                            <div className="card-content" style={blur}>
                                <img
                                    className='cover-image'
                                    src="https://images.unsplash.com/photo-1488654715439-fbf461f0eb8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c3F1YXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                                />
                            </div>
                            <div className="card-title"><b>Title: </b>{label}</div>
                            <div className="card-owner"><b>Owner: </b>{owner}</div>
                            {priceListing}
                        </div>
                        <div className="card-buttons-container">
                            {priceInput}
                            {button}
                        </div>
                    </>
                ) : (
                    <div className='static-card-content'>
                        <div className="card-content">
                            <img
                                className='cover-image'
                                src="https://images.unsplash.com/photo-1488654715439-fbf461f0eb8d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8c3F1YXJlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                            />
                        </div>
                        <div className="card-title"><b>Title: </b>{staticTitle}</div>
                        <button onClick={handleMint}>Mint</button>
                        {/* <button onClick={handleEdit}>Edit</button> */}
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                )
            }
        </div>
    );
}

export default Card;