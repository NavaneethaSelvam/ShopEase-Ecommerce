import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

function SearchBarForProducts() {

const history = useHistory()
const [searchTerm, setSearchTerm] = useState("")

const onSubmit = (e) => {
    e.preventDefault()

    const search = searchTerm.trim()

    if (search) {
        history.push(`/?searchTerm=${encodeURIComponent(search)}`)
    } else {
        history.push("/")
    }
}

return (
    <div className="product-search-wrapper">

        <form onSubmit={onSubmit}>

            <div className="product-search-box">

                <span className="search-icon">
                    🔍
                </span>

                <input
                    type="text"
                    value={searchTerm}
                    placeholder="Search products..."
                    className="product-search-input"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {searchTerm && (
                    <button
                        type="button"
                        className="search-clear-btn"
                        onClick={() => setSearchTerm("")}
                    >
                        ✕
                    </button>
                )}

                <button
                    type="submit"
                    className="product-search-btn"
                >
                    Search
                </button>

            </div>

        </form>

    </div>
)


}

export default SearchBarForProducts
