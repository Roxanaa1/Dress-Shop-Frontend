import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Cart.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [discountCode, setDiscountCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [deliveryDetails, setDeliveryDetails] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        county: '',
        city: '',
        address: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('ramburs');
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);

        if (!loggedIn) {
            alert("Trebuie sa fii logat pentru a accesa cosul de cumparaturi.");
            navigate('/login');
        } else {
            const cartId = localStorage.getItem('cartId');
            if (cartId) {
                fetch(`http://localhost:8080/cart/getCartById/${cartId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        if (data.cartEntries) {
                            const mappedItems = data.cartEntries.map(entry => ({
                                id: entry.id,
                                image: entry.product.productImages[0],
                                name: entry.product.name,
                                color: entry.product.productAttributeAttributeValues.find(attr => attr.productAttribute.name === 'color')?.attributeValue.value || 'Culoare indisponibilă',
                                size: entry.product.productAttributeAttributeValues.find(attr => attr.productAttribute.name === 'size')?.attributeValue.value || 'Mărime indisponibilă',
                                price: entry.pricePerPiece,
                                quantity: entry.quantity,
                                totalPricePerEntry: entry.totalPricePerEntry
                            }));
                            setCartItems(mappedItems);
                        } else {
                            setCartItems([]);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching cart:', error);
                    });
            }
        }
    }, [navigate]);

    const handleRemoveItem = (id) => {
        fetch(`http://localhost:8080/cart/removeItem/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    const updatedItems = cartItems.filter(item => item.id !== id);
                    setCartItems(updatedItems);
                } else {
                    console.error('Failed to remove item from cart');
                }
            })
            .catch(error => {
                console.error('Error removing item:', error);
            });
    };

    const handleQuantityChange = (id, quantity) => {
        if (quantity < 1) {
            return;
        }

        fetch(`http://localhost:8080/cart/updateQuantity/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity })
        })
            .then(response => {
                if (response.ok) {
                    const updatedItems = cartItems.map(item =>
                        item.id === id ? { ...item, quantity } : item
                    );
                    setCartItems(updatedItems);
                } else {
                    console.error('Failed to update item quantity');
                }
            })
            .catch(error => {
                console.error('Error updating item quantity:', error);
            });
    };

    const handleApplyDiscount = () => {
        if (discountCode === 'DISCOUNT10') {
            setDiscount(0.1);
        } else {
            setDiscount(0);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryDetails(prevDetails => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingCost = 15;
    const total = subtotal - (subtotal * discount) + shippingCost;

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="cart-page">
            <h1>SHOPPING CART</h1>
            <div className="top-info">
                <div className="info-item">• Special shipping price: 15 lei</div>
                <div className="info-item">• 14-day return period</div>
                <div className="info-item">• FAST delivery 24-48H</div>
            </div>
            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        cartItems.map(item => (
                            <div className="cart-item" key={item.id}>
                                <img src={item.image} alt={item.name}/>
                                <div className="item-details">
                                    <h2>{item.name}</h2>
                                    <p>Color: {item.color}</p>
                                    <p>Size: {item.size}</p>
                                    <p>Price: {item.price} Lei</p>
                                    <div className="quantity-container">
                                        <input
                                            type="number"
                                            value={item.quantity}
                                            min="1"
                                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        />
                                    </div>
                                    <button onClick={() => handleRemoveItem(item.id)} className="remove-button">Șterge
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>


            <div className="delivery-payment-container">
                <div className="delivery-details">
                    <h3>Delivery details</h3>
                    <div className="form-group">
                        <label>First name:</label>
                        <input
                            type="text"
                            name="firstName"
                            value={deliveryDetails.firstName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Last name:</label>
                        <input
                            type="text"
                            name="lastName"
                            value={deliveryDetails.lastName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone number:</label>
                        <input
                            type="text"
                            name="phone"
                            value={deliveryDetails.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>County:</label>
                        <input
                            type="text"
                            name="county"
                            value={deliveryDetails.county}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>City:</label>
                        <input
                            type="text"
                            name="city"
                            value={deliveryDetails.city}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="address"
                            value={deliveryDetails.address}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="payment-summary-container">
                    <div className="payment-method">
                        <h3>Payment method</h3>
                        <label>
                            <input
                                type="radio"
                                value="ramburs"
                                checked={paymentMethod === 'ramburs'}
                                onChange={handlePaymentChange}
                            />
                            Plata la livrare (Ramburs)
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="online"
                                checked={paymentMethod === 'online'}
                                onChange={handlePaymentChange}
                            />
                            Plata online
                        </label>
                    </div>
                    <div className="cart-summary">
                        <div className="discount">
                            <input
                                type="text"
                                placeholder="Ai un cod de reducere?"
                                value={discountCode}
                                onChange={(e) => setDiscountCode(e.target.value)}
                            />
                            <button onClick={handleApplyDiscount}>Aplică Reducerea</button>
                        </div>
                        <div className="summary-details">
                            <p>Valoare comandă: {subtotal.toFixed(2)} Lei</p>
                            <p>Livrare: {shippingCost === 0 ? 'GRATUIT' : `${shippingCost} Lei`}</p>
                            {discount > 0 && <p>Discount: {discount * 100}%</p>}
                            <p><strong>Total: {total.toFixed(2)} Lei</strong></p>
                        </div>
                        <button onClick={handleCheckout} className="checkout-button">Trimite Comanda</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
