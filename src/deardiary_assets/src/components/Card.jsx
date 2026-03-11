import React, { useEffect, useState, useRef } from 'react';
import { Actor } from "@icp-sdk/core/agent";
import { idlFactory } from '../../../declarations/nft';
import { createActor, canisterId as deardiaryCanisterId } from '../../../declarations/deardiary';
import { useAuth } from '../AuthContext';

// Neutral gradient used while the real cover image loads or as fallback
const PLACEHOLDER_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23d9d6d2'/%3E%3Cstop offset='100%25' style='stop-color:%238c8c8c'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='500' height='300' fill='url(%23g)'/%3E%3C/svg%3E";

function truncatePrincipal(p) {
    if (!p || p.length <= 12) return p;
    return `${p.slice(0, 6)}…${p.slice(-4)}`;
}

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
    const { agent, principal } = useAuth();

    // P1 fix: use ref so NFTActor persists across re-renders without being reset
    const NFTActorRef = useRef(null);

    const [label, setLabel] = useState(null);
    const [owner, setOwner] = useState(null);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const [button, setButton] = useState(null);
    const [priceListing, setPriceListing] = useState(null);

    // P1 fix: price in state so it survives re-renders caused by setButton
    const [sellPrice, setSellPrice] = useState('');
    const [showPriceInput, setShowPriceInput] = useState(false);

    const [blur, setBlur] = useState(null);

    const loadNFT = async () => {
        try {
            NFTActorRef.current = Actor.createActor(idlFactory, {
                agent,
                canisterId: id,
            });
            const deardiary = createActor(deardiaryCanisterId, { agent });

            const [fetchedLabel, imageBytes, fetchedOwner] = await Promise.all([
                NFTActorRef.current.getLabel(),
                NFTActorRef.current.getCoverImage(),
                NFTActorRef.current.getOwner(),
            ]);

            setLabel(fetchedLabel);
            setOwner(fetchedOwner.toText());

            if (imageBytes && imageBytes.length > 0) {
                const blob = new Blob([new Uint8Array(imageBytes)]);
                setImage(URL.createObjectURL(blob));
            }

            if (role === "collection" || role === "diaries") {
                const nftIsListed = await deardiary.isListed(id);
                if (nftIsListed) {
                    setOwner("DearDiary");
                    setBlur({ filter: "blur(2px)" });
                    setButton('listed');
                } else {
                    setButton('sell');
                }

            } else if (role === "discover") {
                const [originalOwner, price] = await Promise.all([
                    deardiary.getOriginalOwner(id),
                    deardiary.getListedNFTPrice(id),
                ]);

                if (originalOwner.toText() !== principal.toText()) {
                    setButton('buy');
                } else {
                    setButton('mine');
                }

                setPriceListing(
                    <div className="card-listing">
                        <b className="add-margin">Price: </b>
                        {price.toString()}
                        <span className="material-icons md-18">currency_bitcoin</span>
                    </div>
                );
            }
        } catch (err) {
            console.error('loadNFT failed:', err);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isCardMinted) loadNFT();
        else setLoading(false);
    }, []);

    const handleDelete = () => onDelete(id);
    const handleMint = () => onMint(id);

    const handleOnClick = () => {
        setShowPriceInput(true);
        setButton('confirm');
    };

    const handleBuy = async () => {
        setButton('loading');
        try {
            const deardiary = createActor(deardiaryCanisterId, { agent });
            const result = await deardiary.completePurchase(id);
            if (result === "Success") {
                setButton('mine');
                setPriceListing(null);
            } else {
                console.error("Purchase failed:", result);
                setButton('buy');
            }
        } catch (err) {
            console.error("Buy error:", err);
            setButton('buy');
        }
    };

    const handleSell = async () => {
        if (!NFTActorRef.current) return;
        setBlur({ filter: "blur(2px)" });
        setButton('loading');
        try {
            const deardiary = createActor(deardiaryCanisterId, { agent });
            const listingResult = await deardiary.listItem(id, Number(sellPrice));
            if (listingResult === "Success") {
                const dearDiaryId = await deardiary.getDearDiaryCanisterID();
                const transferResult = await NFTActorRef.current.transferOwnership(dearDiaryId);
                if (transferResult === "Success") {
                    setButton('listed');
                    setShowPriceInput(false);
                    setOwner("DearDiary");
                } else {
                    setBlur(null);
                    setButton('sell');
                }
            } else {
                setBlur(null);
                setButton('sell');
            }
        } catch (err) {
            console.error("Sell error:", err);
            setBlur(null);
            setButton('sell');
        }
    };

    const renderButton = () => {
        switch (button) {
            case 'sell':    return <button onClick={handleOnClick} className="sell-confirm-button">Sell</button>;
            case 'confirm': return <button onClick={handleSell} className="sell-confirm-button">Confirm</button>;
            case 'buy':     return <button onClick={handleBuy} className="sell-confirm-button">Buy</button>;
            case 'listed':  return <div className="listed-banner">LISTED</div>;
            case 'mine':    return <div className="listed-banner">You own this</div>;
            case 'loading': return (
                <button className="sell-confirm-button">
                    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                </button>
            );
            default: return null;
        }
    };

    // Skeleton shown while async data loads
    if (loading) {
        return (
            <div className="card-container card-skeleton" style={cardStyle}>
                <div className="skeleton-img" />
                <div className="skeleton-line wide" />
                <div className="skeleton-line narrow" />
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="card-container" style={cardStyle}>
                <div style={{ padding: 16, color: '#DE5B5B', fontSize: 13, textAlign: 'center' }}>
                    Failed to load NFT
                </div>
            </div>
        );
    }

    return (
        <div className="card-container" onClick={handleCardOnClick} style={cardStyle}>
            {isCardMinted ? (
                <>
                    <div>
                        <div className="card-content" style={blur}>
                            <img
                                className='cover-image'
                                src={image || PLACEHOLDER_IMG}
                            />
                        </div>
                        <div className="card-title"><b>Title: </b>{label}</div>
                        <div className="card-owner"><b>Owner: </b>{truncatePrincipal(owner)}</div>
                        {priceListing}
                    </div>
                    <div className="card-buttons-container">
                        {showPriceInput && (
                            <div className="nft-price-container">
                                <span className="material-icons md-18 add-margin">currency_bitcoin</span>
                                <input
                                    className="nft-price"
                                    name="nft-price"
                                    type="number"
                                    min="0"
                                    placeholder="Enter price"
                                    value={sellPrice}
                                    onChange={(e) => setSellPrice(e.target.value)}
                                />
                            </div>
                        )}
                        {renderButton()}
                    </div>
                </>
            ) : (
                <div className='static-card-content'>
                    <div className="card-content">
                        <img className='cover-image' src={PLACEHOLDER_IMG} />
                    </div>
                    <div className="card-title"><b>Title: </b>{staticTitle}</div>
                    <button onClick={handleMint}>Mint</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default Card;
