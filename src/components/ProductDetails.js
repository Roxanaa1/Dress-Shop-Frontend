import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ProductDetails.css';
import Navbar from './Navbar';

const ProductDetails = () =>
{
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        // Fetch detalii produs
        fetch(`http://localhost:8080/products/getProductById/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setProduct(data);
                setSelectedImage(data.productImages[0]);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }, [id]);

    if (!product) return <div>Product not found</div>;

    const colorAttribute = product.productAttributeAttributeValues.find(attr => attr.productAttribute.name === 'color');
    const sizeAttribute = product.productAttributeAttributeValues.find(attr => attr.productAttribute.name === 'size');

    console.log(colorAttribute);
    console.log(sizeAttribute); 

    const handleAddToCart = () => {
        const cartId = localStorage.getItem('cartId');
        console.log("Cart ID:", cartId);


        if (!cartId)
        {
            alert("Trebuie sa fii logat pentru a adauga produse in cos.");
            return;
        }

        if (!product || !product.id)
        {
            alert("Eroare");
            return;
        }


        const productDTO =
            {
            id: product.id,
            name: product.name,
            price: product.price,
            availableQuantity: product.availableQuantity,
        };

        const cartEntryDTO =
            {
            product: productDTO,
            quantity: 1,
            pricePerPiece: product.price,
            totalPricePerEntry: product.price * 1,
        };

        console.log(cartEntryDTO);

        fetch(`http://localhost:8080/cart/addToCart/${cartId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cartEntryDTO),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then(data => {
                console.log('Product added to cart:', data);
                alert('Produsul a fost adaugat in cosul de cumparaturi!');
            })
            .catch(error => {
                console.error('Eroare:', error);
                alert('Eroare');
            });
    };


    return (
        <div className="ProductDetails">
            <Navbar />
            <div className="details-container">
                <div className="image-gallery">
                    {selectedImage && <img src={selectedImage} alt={product.name} className="main-image" />}
                    <div className="thumbnail-gallery">
                        {product.productImages && product.productImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Thumbnail ${index}`}
                                className={`thumbnail ${selectedImage === image ? 'selected' : ''}`}
                                onClick={() => setSelectedImage(image)}
                            />
                        ))}
                    </div>
                </div>
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="price">{product.price} RON</p>
                    <p className="description">{product.description}</p>
                    <p className={`stock-status ${product.availableQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.availableQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                    <div className="options">
                        {colorAttribute && (
                            <div className="colors">
                                <span>Color:</span>
                                <span className="color-sample" style={{ backgroundColor: colorAttribute.attributeValue.value }}></span>
                            </div>
                        )}
                        {sizeAttribute && (
                            <div className="sizes">
                                <span>Size:</span>
                                <button className="size-button">{sizeAttribute.attributeValue.value}</button>
                            </div>
                        )}
                    </div>
                    <button className="add-to-cart" onClick={handleAddToCart} disabled={product.availableQuantity === 0}>
                        Add to cart
                    </button>
                    <button className="wishlist">Save to Wishlist</button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
