import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { useLocation, useHistory } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Message from './Message'

import './PaymentStatus.css'

const PaymentStatus = () => {


const location = useLocation()
const history = useHistory()

const boughtData =
    location.state && location.state.detail
        ? location.state.detail
        : null


if (!boughtData) {
    return (
        <div className="payment-status-page">

            <Card className="payment-status-card">

                <div className="status-icon error-icon">
                    !
                </div>

                <h2>Payment Status Not Available</h2>

                <p>
                    We couldn't find your payment details.
                </p>

                <Button
                    variant="primary"
                    onClick={() => history.push('/')}
                >
                    Go to Home
                </Button>

            </Card>

        </div>
    )
}


return (

    <div className="payment-status-page">

        <Card className="payment-status-card">

            <div className="success-circle">
                ✓
            </div>


            <span className="success-label">
                PAYMENT SUCCESSFUL
            </span>


            <h1>
                Thank You for Your Order!
            </h1>


            <p className="success-description">
                Your payment has been completed successfully.
                Your order is now being processed.
            </p>


            <div className="order-success-box">

                <div className="order-success-row">

                    <span>
                        Product
                    </span>

                    <strong>
                        {boughtData.name}
                    </strong>

                </div>


                <div className="success-divider"></div>


                <div className="order-success-row">

                    <span>
                        Amount Paid
                    </span>

                    <strong className="paid-price">
                        ₹ {boughtData.price}
                    </strong>

                </div>


                <div className="success-divider"></div>


                <div className="order-success-row">

                    <span>
                        Payment Status
                    </span>

                    <strong className="paid-status">
                        ✓ Paid
                    </strong>

                </div>

            </div>


            <div className="success-message">

                <span>
                    📦
                </span>

                <p>
                    Your order details are available in
                    your orders page.
                </p>

            </div>


            <div className="success-actions">

                <Link to="/all-orders/">

                    <Button
                        variant="primary"
                        className="orders-button"
                    >
                        View My Orders
                    </Button>

                </Link>


                <Button
                    variant="outline-secondary"
                    className="continue-button"
                    onClick={() => history.push('/')}
                >
                    Continue Shopping
                </Button>

            </div>

        </Card>

    </div>
)


}

export default PaymentStatus
