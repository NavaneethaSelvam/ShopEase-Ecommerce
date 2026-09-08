import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button } from 'react-bootstrap'
import { getAllAddress } from '../actions/userActions'
import { useHistory } from 'react-router-dom'


function UserAddressComponent({ handleAddressId }) {

    const history = useHistory()
    const dispatch = useDispatch()


    // =========================================
    // LOGIN REDUCER
    // =========================================

    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const {
        userInfo
    } = userLoginReducer


    // =========================================
    // ADDRESS REDUCER
    // =========================================

    const getAllAddressesOfUserReducer = useSelector(
        state => state.getAllAddressesOfUserReducer
    )

    const {
        addresses,
        loading,
        error
    } = getAllAddressesOfUserReducer


    // =========================================
    // SAFE ADDRESS LIST
    // =========================================
    // Always convert addresses into an array.
    // This prevents:
    // TypeError: addresses.map is not a function
    // =========================================

    let addressList = []

    if (Array.isArray(addresses)) {

        addressList = addresses

    } else if (
        addresses &&
        Array.isArray(addresses.results)
    ) {

        addressList = addresses.results

    } else if (
        addresses &&
        Array.isArray(addresses.addresses)
    ) {

        addressList = addresses.addresses

    } else if (
        addresses &&
        Array.isArray(addresses.data)
    ) {

        addressList = addresses.data

    }


    // =========================================
    // DEBUG
    // =========================================

    console.log(
        "ADDRESS API RESPONSE:",
        addresses
    )

    console.log(
        "ADDRESS LIST:",
        addressList
    )

    console.log(
        "TOTAL ADDRESSES:",
        addressList.length
    )


    // =========================================
    // GET ALL ADDRESSES
    // =========================================

    useEffect(() => {

        if (!userInfo) {

            history.push("/login")

        } else {

            dispatch(getAllAddress())

        }

    }, [dispatch, history, userInfo])


    // =========================================
    // AUTOMATICALLY SELECT FIRST ADDRESS
    // =========================================

    useEffect(() => {

        if (
            Array.isArray(addressList) &&
            addressList.length > 0 &&
            addressList[0] &&
            addressList[0].id
        ) {

            handleAddressId(
                addressList[0].id
            )

        }

    }, [addresses, handleAddressId])


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <div className="text-center p-3">

                Loading saved addresses...

            </div>

        )

    }


    // =========================================
    // ERROR
    // =========================================

    if (error) {

        return (

            <div className="alert alert-danger">

                {error}

            </div>

        )

    }


    // =========================================
    // NO ADDRESSES
    // =========================================

    if (addressList.length === 0) {

        return (

            <Card
                className="p-4 text-center"
                style={{
                    border: "1px solid #d8c5f0",
                    borderRadius: "15px"
                }}
            >

                <div
                    style={{
                        fontSize: "40px",
                        marginBottom: "10px"
                    }}
                >
                    📍
                </div>


                <h5>
                    No Saved Address
                </h5>


                <p className="text-muted">

                    Please add an address to continue your order.

                </p>


                <Button
                    variant="primary"
                    onClick={() =>
                        history.push("/all-addresses/")
                    }
                >

                    + Add New Address

                </Button>

            </Card>

        )

    }


    // =========================================
    // RETURN
    // =========================================

    return (

        <div>


            {/* =====================================
                SAVED ADDRESSES
            ===================================== */}

            {Array.isArray(addressList) &&
                addressList.map((address, idx) => (

                    <Card
                        key={address.id || idx}
                        className="p-3 mb-3"
                        style={{
                            border:
                                idx === 0
                                    ? "2px solid #6f42c1"
                                    : "1px solid #d8c5f0",

                            borderRadius: "15px",

                            background:
                                idx === 0
                                    ? "#faf7ff"
                                    : "#ffffff",

                            boxShadow:
                                "0 4px 12px rgba(111, 66, 193, 0.08)"
                        }}
                    >


                        {/* =================================
                            ADDRESS CONTAINER
                        ================================= */}

                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "12px"
                            }}
                        >


                            {/* =================================
                                RADIO BUTTON
                            ================================= */}

                            <input
                                type="radio"
                                name="addressId"
                                value={address.id}
                                defaultChecked={idx === 0}
                                onChange={() =>
                                    handleAddressId(
                                        address.id
                                    )
                                }
                                style={{
                                    marginTop: "5px",
                                    width: "18px",
                                    height: "18px",
                                    accentColor: "#6f42c1"
                                }}
                            />


                            {/* =================================
                                ADDRESS DETAILS
                            ================================= */}

                            <div
                                style={{
                                    flex: 1
                                }}
                            >


                                {/* =================================
                                    NAME + SELECTED
                                ================================= */}

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "8px"
                                    }}
                                >


                                    <div>

                                        <span
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: "700",
                                                color: "#2d2142"
                                            }}
                                        >

                                            {address.name ||
                                                "Saved Address"}

                                        </span>

                                    </div>


                                    {/* SELECTED BADGE */}

                                    {idx === 0 && (

                                        <span
                                            style={{
                                                background: "#6f42c1",
                                                color: "#fff",
                                                padding: "4px 10px",
                                                borderRadius: "20px",
                                                fontSize: "11px",
                                                fontWeight: "600"
                                            }}
                                        >

                                            SELECTED

                                        </span>

                                    )}

                                </div>


                                {/* =================================
                                    PHONE
                                ================================= */}

                                <div
                                    style={{
                                        marginBottom: "7px",
                                        color: "#555"
                                    }}
                                >

                                    📞{" "}

                                    {address.phone_number ||
                                        "Phone number not available"}

                                </div>


                                {/* =================================
                                    ADDRESS
                                ================================= */}

                                <div
                                    style={{
                                        lineHeight: "1.6",
                                        color: "#555"
                                    }}
                                >

                                    📍{" "}

                                    {address.house_no || ""}


                                    {address.landmark && (

                                        <>
                                            ,{" "}
                                            {address.landmark}
                                        </>

                                    )}


                                    {address.city && (

                                        <>
                                            ,{" "}
                                            {address.city}
                                        </>

                                    )}


                                    {address.state && (

                                        <>
                                            ,{" "}
                                            {address.state}
                                        </>

                                    )}


                                    {address.pin_code && (

                                        <>
                                            {" "} -{" "}
                                            {address.pin_code}
                                        </>

                                    )}

                                </div>


                            </div>


                        </div>


                    </Card>

                ))}


            {/* =====================================
                ADD NEW ADDRESS
            ===================================== */}

            <div
                style={{
                    marginTop: "12px",
                    textAlign: "center"
                }}
            >

                <Button
                    variant="outline-primary"
                    onClick={() =>
                        history.push("/all-addresses/")
                    }
                    style={{
                        borderRadius: "10px",
                        fontWeight: "600",
                        padding: "9px 20px"
                    }}
                >

                    + Add New Address

                </Button>

            </div>


        </div>

    )

}


export default UserAddressComponent