import "./Card.css";
import React, { useState } from "react";

interface Product {
    product_id: string;
    product_name: string;
    product_price: number;
    description?: string;
    image?: string;
    brand_name?: string;
}

interface CardProps {
    product: Product;
    trayNumber: number;
    onQuantityChange?: (productId: string, quantity: number) => void;
    totalItems?: number;
    maxItems?: number;
}

const Card: React.FC<CardProps> = ({
                                       product,
                                       trayNumber,
                                       onQuantityChange,
                                       totalItems = 0,
                                       maxItems = 3,
                                   }) => {
    const [quantity, setQuantity] = useState<number>(0);
    const [showInfo, setShowInfo] = useState(false);

    const increaseQty = () => {
        if (totalItems >= maxItems) return; // 🧩 Stop increasing beyond max
        const newQty = quantity + 1;
        setQuantity(newQty);
        onQuantityChange?.(product.product_id, newQty);
    };

    const decreaseQty = () => {
        const newQty = Math.max(0, quantity - 1);
        setQuantity(newQty);
        onQuantityChange?.(product.product_id, newQty);
    };

    const handleBuyClick = () => {
        if (totalItems >= maxItems) return;
        setQuantity(1);
        onQuantityChange?.(product.product_id, 1);
    };

    return (
        <div className="card">
            <div className="tray-badge">{trayNumber}</div>
            <img
                src={product.image || "/product.webp"}
                alt={product.product_name}
                className="product-img"
            />

            <div className="content">
                <h3 style={{color : "black"}}>{product.product_name}</h3>
                <p style={{color : "black"}}>{product.brand_name || "N/A"}</p>

                {quantity === 0 ? (
                    <button
                        className="buy-btn"
                        onClick={handleBuyClick}
                        disabled={totalItems >= maxItems}
                        style={{
                            opacity: totalItems >= maxItems ? 0.6 : 1,
                            cursor: totalItems >= maxItems ? "not-allowed" : "pointer",
                        }}
                    >
                        Buy ₹{product.product_price}
                    </button>
                ) : (
                    <div className="quantity">
                        <button className="qty-btn" onClick={decreaseQty}>
                            −
                        </button>
                        <span className="qty-display">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={increaseQty}
                            disabled={totalItems >= maxItems}
                            style={{
                                opacity: totalItems >= maxItems ? 0.6 : 1,
                                cursor: totalItems >= maxItems ? "not-allowed" : "pointer",
                            }}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>


            {showInfo && (
                <div className="popup">
                    <h4>{product.product_name}</h4>
                    <p>{product.description || "No description available"}</p>
                    <button onClick={() => setShowInfo(false)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Card;
