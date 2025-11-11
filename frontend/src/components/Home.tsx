import React, { useEffect, useState, useRef } from "react";
import Card from "../common/Card";
import "./Home.css";
import { useNavigate } from "react-router-dom";



interface Product {
    product_id: string;
    product_name: string;
    product_price: number;
    description?: string;
    image?: string;
    calories?: string;
}

const MAX_ITEMS = 3;

const Home: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Record<string, number>>({});
    const [currentTray, setCurrentTray] = useState<number>(1);
    const trayRefs = useRef<HTMLDivElement[]>([]);
    const navigate = useNavigate();


    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data: Product[]) => setProducts(data))
            .catch((err) => console.error("Error fetching:", err));
    }, []);

    const trays = [];
    for (let i = 0; i < 7; i++) {
        trays.push(products.slice(i * 7, i * 7 + 7));
    }

    const handleQuantityChange = (productId: string, quantity: number) => {
        setCart((prev) => {
            const updated = { ...prev, [productId]: quantity };
            Object.keys(updated).forEach((id) => {
                if (updated[id] === 0) delete updated[id];
            });
            return updated;
        });
    };

    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

    // ✅ IntersectionObserver for scroll-based highlight
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) {
                    const id = visible.target.getAttribute("id");
                    if (id) {
                        const trayNum = parseInt(id.replace("tray-", ""));
                        setCurrentTray(trayNum);
                    }
                }
            },
            { threshold: 0.3 }
        );

        trayRefs.current.forEach((tray) => tray && observer.observe(tray));
        return () => observer.disconnect();
    }, [products]);

    const handleTrayClick = (trayNum: number) => {
        // ✅ Update active tray immediately + smooth scroll
        setCurrentTray(trayNum);
        document.getElementById(`tray-${trayNum}`)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="vendingPage">
            {/* 🔹 Top Navbar */}
            <div className="navbar">
                <div className="logo">🍽️ Wendor+</div>
                <div className="categories">
                    {["All", "Snacks", "Salad", "Bowls", "Wraps"].map((cat) => (
                        <button key={cat} className="cat-btn">
                            {cat}
                        </button>
                    ))}
                </div>
                <button className="pickup-btn">Pick Up Code</button>
            </div>

            {/* 🔹 Main Layout */}
            <div className="mainLayout">
                {/* Sidebar */}
                <div className="sidebar">
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                        <div
                            key={num}
                            onClick={() => handleTrayClick(num)}
                            className={`tray-num ${num === currentTray ? "active" : ""}`}
                        >
                            {num}
                        </div>
                    ))}
                </div>

                {/* Trays Section */}
                <div className="traySection">
                    {trays.map((tray, trayIndex) => (
                        <div
                            key={trayIndex}
                            id={`tray-${trayIndex + 1}`}
                            ref={(el) => {
                                if (el) trayRefs.current[trayIndex] = el;
                            }}
                            className="trayBlock"
                        >
                            <h2 className="trayTitle">Tray {trayIndex + 1}</h2>
                            <div className="trayGrid">
                                {tray.map((p, index) => (
                                    <Card
                                        key={p.product_id}
                                        product={p}
                                        trayNumber={index + 1}
                                        onQuantityChange={handleQuantityChange}
                                        totalItems={totalItems}
                                        maxItems={MAX_ITEMS}
                                    />
                                ))}
                            </div>
                            <div className="trayDivider"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔹 Footer */}
            <div className="footerBar">
        <span style={{ color: "black" }}>
          {totalItems}/{MAX_ITEMS} item(s) selected
        </span>
                <button
                    className="proceed-btn"
                    disabled={totalItems === 0}
                    onClick={() => navigate("/checkout", { state: { cart, products } })}
                    style={{
                        opacity: totalItems === 0 ? 0.6 : 1,
                        cursor: totalItems === 0 ? "not-allowed" : "pointer",
                    }}
                >
                    Proceed
                </button>

            </div>
        </div>
    );
};

export default Home;
