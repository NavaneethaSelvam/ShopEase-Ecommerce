import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Card, Button } from 'react-bootstrap'
import { getAllAddress } from '../actions/userActions'
import { useHistory } from 'react-router-dom'

function UserAddressComponent({ handleAddressId }) {

    const history = useHistory()
    const dispatch = useDispatch()

    // Login reducer
    const userLoginReducer = useSelector(
        state => state.userLoginReducer
    )

    const { userInfo } = userLoginReducer

    // Address list reducer
    const getAllAddressesOfUserReducer = useSelector(
        state => state.getAllAddressesOfUserReducer
    )

    const {
        addresses,
        loading,
        error
    } = getAllAddressesOfUserReducer


    // Get all addresses
    useEffect(() => {

        if (!userInfo) {

            history.push("/login")

        } else {

            dispatch(getAllAddress())

        }

    }, [dispatch, history, userInfo])


    // Automatically select first saved address
    useEffect(() => {

        if (
            addresses &&
            addresses.length > 0
        ) {

            handleAddressId(addresses[0].id)

        }

    }, [addresses, handleAddressId])


    // Loading
    if (loading) {

        return (
            <div className="text-center p-3">
                Loading saved addresses...
            </div>
        )

    }


    // Error
    if (error) {

        return (
            <div className="alert alert-danger">
                {error}
            </div>
        )

    }


    // No addresses
    if (!addresses || addresses.length === 0) {

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
                    onClick={() => history.push("/all-addresses/")}
                >
                    + Add New Address
                </Button>

            </Card>
        )

    }


    return (

        <div>

            {/* Saved Addresses */}

            {addresses.map((address, idx) => (

                <Card
                    key={address.id}
                    className="p-3 mb-3"
                    style={{
                        border: idx === 0
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

                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px"
                        }}
                    >

                        {/* Radio */}

                        <input
                            type="radio"
                            name="addressId"
                            value={address.id}
                            defaultChecked={idx === 0}
                            onChange={() =>
                                handleAddressId(address.id)
                            }
                            style={{
                                marginTop: "5px",
                                width: "18px",
                                height: "18px",
                                accentColor: "#6f42c1"
                            }}
                        />


                        {/* Address Details */}

                        <div
                            style={{
                                flex: 1
                            }}
                        >

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
                                        {address.name}
                                    </span>

                                </div>


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


                            {/* Phone */}

                            <div
                                style={{
                                    marginBottom: "7px",
                                    color: "#555"
                                }}
                            >
                                📞 {address.phone_number}
                            </div>


                            {/* Address */}

                            <div
                                style={{
                                    lineHeight: "1.6",
                                    color: "#555"
                                }}
                            >

                                📍 {address.house_no},{" "}
                                {address.landmark},{" "}
                                {address.city},{" "}
                                {address.state} -{" "}
                                {address.pin_code}

                            </div>

                        </div>

                    </div>

                </Card>

            ))}


            {/* Add New Address */}

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