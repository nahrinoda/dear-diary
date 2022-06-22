import React, { useEffect, useState } from 'react';
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from '../../../declarations/nft';
import { Principal } from '@dfinity/principal';

function Card({ id }) {
    const [label, setLabel] = useState();
    const [owner, setOwner] = useState();
    const [content, setContent] = useState();

    const currentId = Principal.fromText(id);

    const localHost = "http://localhost:8080/";
    const agent = new HttpAgent({ host: localHost });
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
    };

    useEffect(() => {
        loadNFT();
    }, []);

    return (
        <div className="card-container">
            <div className="card-content">
                {content}
            </div>
            <div className="card-title"><b>Title: </b>{label}</div>
            <div className="card-owner"><b>Owner: </b>{owner}</div>
        </div>
    );
}

export default Card;