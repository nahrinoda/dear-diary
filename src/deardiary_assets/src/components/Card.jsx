import React, { useEffect, useState } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../../../declarations/nft';
import { deardiary } from '../../../declarations/deardiary';
import { Principal } from '@dfinity/principal';

function Card({ id, handleCardOnClick, cardStyle }) {
    const [label, setLabel] = useState();
    const [owner, setOwner] = useState();
    const [content, setContent] = useState();
    const [button, setButton] = useState();
    const [priceInput, setPriceInput] = useState();
    const [blur, setBlur] = useState();

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

        const nftIsListed = await deardiary.isListed(id);

        if (nftIsListed) {
            setOwner("DearDiary");
            setBlur({ filter: "blur(2px)" });
            setButton(<div className="listed-banner">LISTED</div>);
        } else {
            setButton(<button onClick={handleOnClick} className="sell-confirm-button">Sell</button>);
        };
    };

    useEffect(() => {
        loadNFT();
    }, []);

    let price;

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
        setButton(<button onClick={handleSellNFT} className="sell-confirm-button">Confirm</button>)
    };

    const handleSellNFT = async (e) => {
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
            <div>
                
                <div className="card-content" style={blur}>
                    {content}
                </div>
                <div className="card-title"><b>Title: </b>{label}</div>
                <div className="card-owner"><b>Owner: </b>{owner}</div>
            </div>
            <div className="card-buttons-container">
                {priceInput}
                {button}
            </div>
        </div>
    );
}

export default Card;