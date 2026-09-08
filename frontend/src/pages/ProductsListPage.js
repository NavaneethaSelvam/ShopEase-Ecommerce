
import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getProductsList } from '../actions/productActions'
import Message from '../components/Message'
import { Spinner } from 'react-bootstrap'
import Product from '../components/Product'
import { useHistory } from 'react-router-dom'
import { CREATE_PRODUCT_RESET } from '../constants'

function ProductsListPage() {

    const history = useHistory()
    const dispatch = useDispatch()

    // =========================================
    // URL PARAMETERS
    // =========================================

    const params = new URLSearchParams(history.location.search)

    const searchTerm = params.get('searchTerm') || ''
    const category = params.get('category') || ''


    // =========================================
    // REDUX
    // =========================================

    const productsListReducer = useSelector(
        state => state.productsListReducer
    )

    const {
        loading,
        error,
        products = []
    } = productsListReducer


    // =========================================
    // LOAD PRODUCTS
    // =========================================

    useEffect(() => {

        dispatch(getProductsList())

        dispatch({
            type: CREATE_PRODUCT_RESET
        })

    }, [dispatch])


    // =========================================
    // CATEGORY DETECTION
    // =========================================

    const getCategory = (product) => {

        const productCategory =
            (product.category || '').toLowerCase().trim()

        const name =
            (product.name || '').toLowerCase()

        const description =
            (product.description || '').toLowerCase()


        const text =
            name + ' ' +
            description + ' ' +
            productCategory


        // =========================================
        // WOMEN
        // =========================================

        if (
            productCategory === 'tops' ||
            productCategory === 'womens-dresses' ||
            productCategory === 'womens-shoes' ||
            productCategory === 'womens-bags' ||
            productCategory === 'womens-jewellery' ||
            productCategory === 'womens-jewelry' ||
            productCategory === 'womens-watches' ||
            text.includes('women') ||
            text.includes("women's")
        ) {
            return 'Women'
        }


        // =========================================
        // MEN
        // =========================================

        if (
            productCategory === 'mens-shirts' ||
            productCategory === 'mens-shoes' ||
            productCategory === 'mens-watches' ||
            productCategory === 'mens-accessories' ||
            text.includes('men') ||
            text.includes("men's")
        ) {
            return 'Men'
        }


        // =========================================
        // KIDS & TOYS
        // =========================================

        if (
            productCategory.includes('toy') ||
            productCategory.includes('kids') ||
            productCategory.includes('kid') ||
            text.includes('toy') ||
            text.includes('kids')
        ) {
            return 'Kids & Toys'
        }


        // =========================================
        // HOME & KITCHEN
        // =========================================

        if (
            productCategory === 'furniture' ||
            productCategory === 'home-decoration' ||
            productCategory === 'kitchen-accessories' ||
            productCategory === 'groceries' ||
            productCategory.includes('home') ||
            productCategory.includes('kitchen') ||
            text.includes('furniture') ||
            text.includes('kitchen')
        ) {
            return 'Home & Kitchen'
        }


        // =========================================
        // BEAUTY
        // =========================================

        if (
            productCategory === 'beauty' ||
            productCategory === 'fragrances' ||
            productCategory === 'skin-care' ||
            text.includes('makeup') ||
            text.includes('lipstick') ||
            text.includes('perfume') ||
            text.includes('fragrance') ||
            text.includes('skin care')
        ) {
            return 'Beauty'
        }


        // =========================================
        // JEWELLERY
        // =========================================

        if (
            productCategory.includes('jewellery') ||
            productCategory.includes('jewelry') ||
            text.includes('jewellery') ||
            text.includes('jewelry') ||
            text.includes('necklace') ||
            text.includes('earring') ||
            text.includes('bracelet') ||
            text.includes('ring')
        ) {
            return 'Jewellery'
        }


        // =========================================
        // BAGS
        // =========================================

        if (
            productCategory.includes('bag') ||
            text.includes('bag') ||
            text.includes('backpack') ||
            text.includes('handbag')
        ) {
            return 'Bags'
        }


        // =========================================
        // FOOTWEAR
        // =========================================

        if (
            productCategory.includes('shoe') ||
            productCategory.includes('footwear') ||
            productCategory.includes('sandal') ||
            text.includes('shoe') ||
            text.includes('sandal') ||
            text.includes('sneaker')
        ) {
            return 'Footwear'
        }


        // =========================================
        // ELECTRONICS
        // =========================================

        if (
            productCategory === 'laptops' ||
            productCategory === 'smartphones' ||
            productCategory === 'tablets' ||
            productCategory === 'mobile-accessories' ||
            productCategory === 'electronics' ||
            productCategory.includes('electronic') ||
            text.includes('laptop') ||
            text.includes('phone') ||
            text.includes('smartphone') ||
            text.includes('computer') ||
            text.includes('headphone') ||
            text.includes('keyboard') ||
            text.includes('mouse') ||
            text.includes('camera') ||
            text.includes('playstation') ||
            text.includes('xbox')
        ) {
            return 'Electronics'
        }


        // =========================================
        // WATCHES
        // =========================================

        if (
            productCategory.includes('watch') ||
            text.includes('watch')
        ) {
            return 'Watches'
        }


        // =========================================
        // SPORTS
        // =========================================

        if (
            productCategory.includes('sports') ||
            productCategory.includes('sport') ||
            text.includes('football') ||
            text.includes('basketball') ||
            text.includes('cricket') ||
            text.includes('sports')
        ) {
            return 'Sports'
        }


        // =========================================
        // DEFAULT
        // =========================================

        return 'Other'
    }


    // =========================================
    // SEARCH + CATEGORY FILTER
    // =========================================

const filteredProducts = useMemo(() => {

    const search = searchTerm.toLowerCase().trim()

    return products.filter((product) => {

        const name = (product.name || '').toLowerCase()
        const description = (product.description || '').toLowerCase()
        const productCategory = (product.category || '').toLowerCase()

        // SEARCH
        const matchesSearch =
            !search ||
            name.includes(search) ||
            description.includes(search) ||
            productCategory.includes(search)

        // CATEGORY
        const matchesCategory =
            !category ||
            category === 'Popular' ||
            getCategory(product) === category

        return matchesSearch && matchesCategory

    })

}, [products, searchTerm, category])


    // =========================================
    // DEBUG
    // =========================================

    useEffect(() => {

        if (products.length > 0) {

            console.log(
                'TOTAL PRODUCTS:',
                products.length
            )


            console.log(
                'PRODUCT NAMES:',
                products.map(product => ({
                    name: product.name,
                    category: product.category,
                    detectedCategory: getCategory(product)
                }))
            )


            console.log(
                'CATEGORY COUNTS:',
                products.reduce((result, product) => {

                    const cat = getCategory(product)

                    result[cat] =
                        (result[cat] || 0) + 1

                    return result

                }, {})
            )

        }

    }, [products])


    // =========================================
    // SEARCH HANDLER
    // =========================================

    const handleSearch = (event) => {

        const value =
            event.target.value


        if (value.trim()) {

            history.push(
                '/?searchTerm=' +
                encodeURIComponent(value.trim())
            )

        } else {

            history.push('/')

        }

    }


    // =========================================
    // CLEAR SEARCH
    // =========================================

    const clearSearch = () => {

        history.push('/')

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="shopease-home">


            {/* =========================================
                HERO
            ========================================= */}

            {!searchTerm && !category && (

                <section className="hero-section">

                    <div className="hero-overlay">

                        <div className="hero-content">

                            <span className="hero-small-title">
                                WELCOME TO SHOPEASE
                            </span>


                            <h1>
                                Style That Fits You
                            </h1>


                            <p>
                                Discover trending fashion,
                                accessories and everyday essentials
                                at amazing prices.
                            </p>


                            <div className="hero-buttons">

                                <button
                                    className="hero-primary-btn"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                'products-section'
                                            )
                                            ?.scrollIntoView({
                                                behavior: 'smooth'
                                            })
                                    }
                                >
                                    Shop Now
                                </button>


                                <button
                                    className="hero-secondary-btn"
                                    onClick={() =>
                                        document
                                            .getElementById(
                                                'products-section'
                                            )
                                            ?.scrollIntoView({
                                                behavior: 'smooth'
                                            })
                                    }
                                >
                                    Explore Products
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

            )}


            {/* =========================================
                BENEFITS
            ========================================= */}

            {!searchTerm && !category && (

                <section className="benefits-section">

                    <div className="benefit-card">

                        <div className="benefit-icon">
                            🚚
                        </div>

                        <div>

                            <h5>
                                Fast Delivery
                            </h5>

                            <p>
                                Delivery across India
                            </p>

                        </div>

                    </div>


                    <div className="benefit-card">

                        <div className="benefit-icon">
                            💵
                        </div>

                        <div>

                            <h5>
                                Cash on Delivery
                            </h5>

                            <p>
                                Pay when your order arrives
                            </p>

                        </div>

                    </div>


                    <div className="benefit-card">

                        <div className="benefit-icon">
                            🔄
                        </div>

                        <div>

                            <h5>
                                Easy Returns
                            </h5>

                            <p>
                                Simple return policy
                            </p>

                        </div>

                    </div>


                    <div className="benefit-card">

                        <div className="benefit-icon">
                            🔒
                        </div>

                        <div>

                            <h5>
                                Secure Payments
                            </h5>

                            <p>
                                100% secure checkout
                            </p>

                        </div>

                    </div>

                </section>

            )}


            {/* =========================================
                SEARCH
            ========================================= */}

            <section className="homepage-search">

                <div className="search-heading">

                    <h2>
                        Find Your Favourite Products
                    </h2>

                    <p>
                        Search from our collection
                    </p>

                </div>


                <div className="modern-search-box">

                    <span>
                        🔍
                    </span>


                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search for products, brands and more"
                    />


                    {searchTerm && (

                        <button
                            onClick={clearSearch}
                        >
                            ✕
                        </button>

                    )}

                </div>

            </section>


            {/* =========================================
                PRODUCTS
            ========================================= */}

            <section
                id="products-section"
                className="products-section"
            >

                <div className="products-heading">

                    <div>

                        <h2>

                            {searchTerm
                                ? `Search results for "${searchTerm}"`
                                : category
                                    ? `${category} Products`
                                    : 'Popular Products'
                            }

                        </h2>


                        <p>
                            {filteredProducts.length} products found
                        </p>

                    </div>

                </div>


                {/* =========================================
                    ERROR
                ========================================= */}

                {error && (

                    <Message variant="danger">
                        {error}
                    </Message>

                )}


                {/* =========================================
                    LOADING
                ========================================= */}

                {loading && (

                    <div className="loading-container">

                        <Spinner animation="border" />

                        <p>
                            Getting products...
                        </p>

                    </div>

                )}


                {/* =========================================
                    PRODUCTS / NO RESULTS
                ========================================= */}

                {!loading && (

                    filteredProducts.length === 0 ? (

                        <div className="empty-products">

                            <div className="empty-icon">
                                🛍️
                            </div>


                            <h3>
                                No products found
                            </h3>


                            <p>

                                No products match
                                "{searchTerm || category}".

                            </p>


                            <button
                                onClick={clearSearch}
                            >
                                View All Products
                            </button>

                        </div>

                    ) : (

                        <div className="product-grid">

                            {filteredProducts.map((product) => (

                                <Product
                                    key={product.id}
                                    product={product}
                                />

                            ))}

                        </div>

                    )

                )}

            </section>


            {/* =========================================
                SHOPPING BANNER
            ========================================= */}

            {!searchTerm && !category && (

                <section className="shopping-banner">

                    <div>

                        <h2>
                            Shop smarter with ShopEase
                        </h2>


                        <p>
                            Great products. Great prices.
                            Delivered to your doorstep.
                        </p>

                    </div>


                    <button
                        onClick={() =>
                            document
                                .getElementById(
                                    'products-section'
                                )
                                ?.scrollIntoView({
                                    behavior: 'smooth'
                                })
                        }
                    >
                        Start Shopping
                    </button>

                </section>

            )}

        </div>

    )

}


export default ProductsListPage

