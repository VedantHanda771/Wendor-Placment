import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";

interface Product {
    product_id: string;
    product_name: string;
    product_price: number;
    image?: string;
}

const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, products } = location.state || { cart: {}, products: [] };

    const [loading, setLoading] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [vendReady, setVendReady] = useState(false);
    const [isVending, setIsVending] = useState(false);

    // Simulate fake payment process
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
            setPaymentSuccess(true);

            // Show Vend button after a delay
            setTimeout(() => setVendReady(true), 1500);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    const totalPrice = Object.entries(cart || {}).reduce((sum, [id, qty]) => {
        const p = (products as Product[]).find((x) => x.product_id === id);
        return p ? sum + p.product_price * (qty as number) : sum;
    }, 0);

    const handleVend = () => {
        setIsVending(true);
        setVendReady(false);
        // Fake vending delay
        setTimeout(() => {
            setIsVending(false);
            alert("✅ Items vended successfully!");
            navigate("/", { replace: true });
        }, 2500);
    };

    return (
        <div className="checkout-container">
            {/* Fake loader */}
            {loading && (
                <div className="loader-section">
                    <div className="loader" />
                    <h2>Processing Payment...</h2>
                </div>
            )}

            {/* Payment success screen */}
            {!loading && paymentSuccess && (
                <div className="success-screen">
                    <h2 className="success-title">✅ Payment Successful</h2>
                    <p className="sub-text">Your order is being prepared for vending.</p>

                    <div className="product-list">
                        {Object.entries(cart).map(([id, qty]) => {
                            const product = (products as Product[]).find(
                                (p) => p.product_id === id
                            );
                            if (!product) return null;
                            return (
                                <div key={id} className="product-row">
                                    <div className="product-info">
                                        <strong>{product.product_name}</strong>
                                        <span> × {qty}</span>
                                    </div>
                                    <div className="price">
                                        ₹{product.product_price * (qty as number)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <h3 className="total">Total: ₹{totalPrice}</h3>

                    {/* Vend button */}
                    {vendReady && (
                        <button className="vend-btn" onClick={handleVend}>
                            🚀 vend Now
                        </button>
                    )}

                    {/* Vending animation */}
                    {isVending && (
                        <div className="vending-section">
                            <div className="vending-loader" />
                            <p>vending your items...</p>
                        </div>
                    )}

                    <button
                        className="back-btn"
                        onClick={() => navigate("/", { replace: true })}
                    >
                        ⬅️ Back to Home
                    </button>
                </div>
            )}
        </div>
    );
};

export default Checkout;
