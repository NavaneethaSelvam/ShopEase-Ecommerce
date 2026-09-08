
import React from 'react'
import { Link } from 'react-router-dom'
import './Product.css'

function Product({ product }) {

    const getImageUrl = (image) => {

        if (!image) {
            return "https://via.placeholder.com/300x220?text=No+Image"
        }

        if (
            image.startsWith('http://') ||
            image.startsWith('https://')
        ) {
            return image
        }

        return `http://127.0.0.1:8000/images/${image}`
    }


    const originalPrice = product.price
        ? Math.round(Number(product.price) * 1.20)
        : 0

    const discount = product.price
        ? Math.round(
            ((originalPrice - Number(product.price)) /
                originalPrice) * 100
        )
        : 0


    return (

        <div className="customer-product-card">

            {/* IMAGE */}

            <Link
                to={`/product/${product.id}`}
                className="customer-product-image-link"
            >

                <div className="customer-product-image-container">

                    <span className="discount-badge">
                        {discount}% OFF
                    </span>

                    <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="customer-product-image"
                        onError={(e) => {
                            e.target.src =
                                "https://via.placeholder.com/300x220?text=No+Image"
                        }}
                    />

                </div>

            </Link>


            {/* DETAILS */}

            <div className="customer-product-body">

                {/* RATING */}

                <div className="product-rating">

                    <span className="stars">
                        ★★★★★
                    </span>

                    <span className="rating-text">
                        4.5
                    </span>

                </div>


                {/* NAME */}

                <Link
                    to={`/product/${product.id}`}
                    className="customer-product-title-link"
                >

                    <h3 className="customer-product-title">
                        {product.name}
                    </h3>

                </Link>


                {/* DESCRIPTION */}

                <p className="customer-product-description">

                    {product.description
                        ? product.description.length > 65
                            ? product.description.substring(0, 65) + '...'
                            : product.description
                        : 'Quality product at the best price.'}

                </p>


                {/* PRICE */}

                <div className="customer-product-price-section">

                    <span className="current-price">
                        ₹{product.price}
                    </span>

                    <span className="original-price">
                        ₹{originalPrice}
                    </span>

                </div>


                {/* BUTTONS */}

                <div className="customer-product-actions">

                    <Link
                        to={`/product/${product.id}`}
                        className="view-product-btn"
                    >
                        View Details
                    </Link>

                    <button
                        className="add-cart-btn"
                        onClick={() =>
                            alert('Add to Cart coming next!')
                        }
                    >
                        🛒
                    </button>

                </div>

            </div>

        </div>
    )
}

export default Product

