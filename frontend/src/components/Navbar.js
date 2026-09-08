import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { USER_LOGOUT } from '../constants'
import './Navbar.css'

function NavBar() {

    const history = useHistory()
    const dispatch = useDispatch()

    // =========================================
    // REDUX USER DATA
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const { userInfo } = userLoginReducer


    // =========================================
    // SEARCH STATE
    // =========================================

    const [search, setSearch] = useState('')


    // =========================================
    // SEARCH HANDLER
    // =========================================

    const searchHandler = (e) => {

        e.preventDefault()

        const searchValue = search.trim()

        if (searchValue) {

            history.push(
                '/?searchTerm=' +
                encodeURIComponent(searchValue)
            )

        } else {

            history.push('/')

        }

    }


    // =========================================
    // PROFILE CLICK
    // =========================================

    const profileHandler = () => {

        if (userInfo) {

            history.push('/account')

        } else {

            history.push('/login')

        }

    }


    // =========================================
    // LOGOUT
    // =========================================

    const logoutHandler = () => {

        localStorage.removeItem('userInfo')

        dispatch({
            type: 'USER_LOGOUT'
        })

        history.push('/')

    }


    return (

        <header className="shopease-navbar">

            {/* =========================================
                MAIN NAVBAR
            ========================================= */}

            <div className="navbar-container">


                {/* LOGO */}

                <div
                    className="shopease-logo"
                    onClick={() => history.push('/')}
                >

                    <div className="logo-icon">
                        🛍️
                    </div>

                    <div className="logo-text">

                        <h2>
                            Shop<span>Ease</span>
                        </h2>

                        <p>
                            Shop • Smile • Repeat
                        </p>

                    </div>

                </div>


                {/* =========================================
                    SEARCH
                ========================================= */}

                <form
                    className="navbar-search"
                    onSubmit={searchHandler}
                >

                    <span className="navbar-search-icon">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search for products, brands and more"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <button type="submit">
                        Search
                    </button>

                </form>


                {/* =========================================
                    RIGHT SIDE
                ========================================= */}

                <div className="navbar-actions">


                    {/* PROFILE */}

                    <div
                        className="profile-action"
                        onClick={profileHandler}
                    >

                        <span className="action-icon">
                            👤
                        </span>

                        <div>

                            <small>
                                Hello,
                            </small>

                            <strong>

                                {userInfo
                                    ? userInfo.username
                                    : 'Login'
                                }

                            </strong>

                        </div>

                    </div>


                    {/* LOGOUT - ONLY AFTER LOGIN */}

                    {userInfo && (

                        <button
                            className="logout-btn"
                            onClick={logoutHandler}
                        >

                            Logout

                        </button>

                    )}


                    {/* CART */}

                    <div
                        className="cart-action"
                        onClick={() =>
                            alert('Cart feature coming soon')
                        }
                    >

                        <div className="cart-icon-wrapper">

                            🛒

                            <span className="cart-count">
                                0
                            </span>

                        </div>

                        <strong>
                            Cart
                        </strong>

                    </div>


                </div>

            </div>


            {/* =========================================
                CATEGORY NAVBAR
            ========================================= */}

            <div className="category-navbar">


                <button
                    onClick={() => history.push('/')}
                >
                    Popular
                </button>


                <button
                    onClick={() =>
                        history.push('/?category=Women')
                    }
                >
                    Women
                </button>


                <button
                    onClick={() =>
                        history.push('/?category=Men')
                    }
                >
                    Men
                </button>


                <button
                    onClick={() =>
                        history.push(
                            '/?category=Home%20%26%20Kitchen'
                        )
                    }
                >
                    Home & Kitchen
                </button>


                <button
                    onClick={() =>
                        history.push('/?category=Beauty')
                    }
                >
                    Beauty
                </button>


                <button
                    onClick={() =>
                        history.push('/?category=Bags')
                    }
                >
                    Bags
                </button>


                <button
                    onClick={() =>
                        history.push('/?category=Footwear')
                    }
                >
                    Footwear
                </button>


                <button
                    onClick={() =>
                        history.push('/?category=Electronics')
                    }
                >
                    Electronics
                </button>


                <button
                    onClick={() =>
                        history.push('/?category=Watches')
                    }
                >
                    Watches
                </button>


            </div>

        </header>

    )
}

export default NavBar