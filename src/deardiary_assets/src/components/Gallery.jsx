import React, { useEffect, useState } from 'react';
import Card from './Card';
import Footer from './Footer';
import Header from './Header';
import { createActor, canisterId } from '../../../declarations/deardiary';
import { useAuth } from '../AuthContext';

function Gallery({ title, role }) {
    const { agent, principal } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNFTs();
    }, []);

    const fetchNFTs = async () => {
        try {
            const deardiary = createActor(canisterId, { agent });
            let ids = [];

            if (role === 'collection') {
                ids = await deardiary.getOwnedNFTs(principal);
            } else if (role === 'discover') {
                ids = await deardiary.getListedNFTs();
            }

            setItems(ids.map((id) => <Card key={id.toText()} id={id} role={role} />));
        } catch (err) {
            console.error('Failed to fetch NFTs:', err);
            setError('Could not load NFTs. Please refresh the page.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="gallery-page-container">
                <h2 className="my-nft-title">{title}{!loading && !error && items.length > 0 ? ` (${items.length})` : ''}</h2>
                {loading ? (
                    <div className="lds-ellipsis" style={{ margin: '60px auto' }}>
                        <div></div><div></div><div></div><div></div>
                    </div>
                ) : error ? (
                    <div style={{ textAlign: 'center', marginTop: '60px' }}>
                        <p style={{ color: '#DE5B5B', marginBottom: 12 }}>{error}</p>
                        <button
                            className="sell-confirm-button"
                            onClick={() => { setError(null); setLoading(true); fetchNFTs(); }}
                        >Try again</button>
                    </div>
                ) : items.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#8C8C8C', marginTop: '60px' }}>
                        {role === 'collection' ? 'No NFTs in your collection yet.' : 'No NFTs listed for sale yet.'}
                    </p>
                ) : (
                    <div className="my-nft-collection">{items}</div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Gallery;
