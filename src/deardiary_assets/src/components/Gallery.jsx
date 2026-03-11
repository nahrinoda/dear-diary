import React, { useEffect, useState } from 'react';
import Card from './Card';
import Footer from './Footer';
import Header from './Header';
import { createActor, canisterId } from '../../../declarations/deardiary';
import { useAuth } from '../AuthContext';

// Convert e8s Nat to ICP display string (1 ICP = 100_000_000 e8s)
function formatICP(e8s) {
    if (!e8s && e8s !== 0) return '0.00';
    const n = typeof e8s === 'bigint' ? Number(e8s) : e8s;
    return (n / 100_000_000).toFixed(2);
}

function EarningsPanel({ principal, agent }) {
    const [earnings, setEarnings] = useState(null);

    useEffect(() => {
        if (!principal || !agent) return;
        const deardiary = createActor(canisterId, { agent });
        deardiary.getEarnings(principal)
            .then(e => setEarnings(typeof e === 'bigint' ? Number(e) : e))
            .catch(() => setEarnings(0));
    }, []);

    return (
        <div className="earnings-panel">
            <div className="earnings-panel-title">
                Your Earnings
                <span className="earnings-demo-badge">Demo mode</span>
            </div>
            <div className="earnings-total">
                {earnings === null ? '…' : `${formatICP(earnings)} ICP`}
            </div>
            <div className="earnings-note">
                Includes 10% royalties from resales + proceeds from your sales.
                No real ICP moves until mainnet deployment.
            </div>
        </div>
    );
}

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

                {/* Earnings panel — shown only on My NFTs page */}
                {role === 'collection' && <EarningsPanel principal={principal} agent={agent} />}

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
