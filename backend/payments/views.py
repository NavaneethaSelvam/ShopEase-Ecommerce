
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from account.models import StripeModel, OrderModel

from datetime import datetime


# =========================================================
# DEMO PAYMENT MODE
# =========================================================
# Resume / college project purpose.
# Real card details are NOT stored in database.
#
# Set this to False only when you have a valid Stripe
# test secret key and want to use real Stripe test payments.
# =========================================================

DEMO_PAYMENT_MODE = True


# =========================================================
# CHECK TOKEN
# =========================================================

class CheckTokenValidation(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        return Response(
            {
                "message": "Token is Valid"
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# TEST PAYMENT
# =========================================================

class TestStripeImplementation(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        return Response(
            {
                "success": True,
                "message": "Test payment successful"
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# CREATE CARD
# =========================================================

class CreateCardTokenView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        try:

            data = request.data

            email = data.get("email")
            card_number = str(data.get("number", ""))
            exp_month = data.get("exp_month")
            exp_year = data.get("exp_year")
            cvc = str(data.get("cvc", ""))
            save_card = data.get("save_card", False)

            # -------------------------------------------------
            # BASIC VALIDATION
            # -------------------------------------------------

            if not email:
                return Response(
                    {
                        "detail": "Email is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if len(card_number) != 16:
                return Response(
                    {
                        "detail": "Card number must contain exactly 16 digits."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not card_number.isdigit():
                return Response(
                    {
                        "detail": "Invalid card number."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not exp_month or not exp_year:
                return Response(
                    {
                        "detail": "Expiry date is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if len(cvc) != 3 or not cvc.isdigit():
                return Response(
                    {
                        "detail": "CVC must contain exactly 3 digits."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # -------------------------------------------------
            # DEMO PAYMENT MODE
            # -------------------------------------------------

            if DEMO_PAYMENT_MODE:

                last4 = card_number[-4:]

                # IMPORTANT:
                # Full card number and CVC are NOT saved.
                #
                # We only return dummy card information
                # to the frontend.

                card_data = {
                    "id": "demo_card_" + last4,
                    "last4": last4,
                    "exp_month": exp_month,
                    "exp_year": exp_year
                }

                return Response(
                    {
                        "success": True,
                        "customer_id": "demo_customer",
                        "email": email,
                        "card_data": card_data
                    },
                    status=status.HTTP_200_OK
                )

        except Exception as e:

            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================================================
# CHARGE CUSTOMER
# =========================================================

class ChargeCustomerView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        try:

            data = request.data

            # -------------------------------------------------
            # REQUIRED DATA
            # -------------------------------------------------

            name = data.get("name")
            card_number = str(data.get("card_number", ""))
            address = data.get("address")
            ordered_item = data.get("ordered_item")
            paid_status = data.get("paid_status", True)
            total_price = data.get("total_price", 0)
            is_delivered = data.get(
                "is_delivered",
                False
            )
            delivered_at = data.get(
                "delivered_at",
                "Not Delivered"
            )

            # -------------------------------------------------
            # VALIDATION
            # -------------------------------------------------

            if not name:
                return Response(
                    {
                        "detail": "Name is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if not ordered_item:
                return Response(
                    {
                        "detail": "Ordered item is required."
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # -------------------------------------------------
            # DEMO PAYMENT
            # -------------------------------------------------

            # Only last 4 digits are stored in OrderModel.
            # Full card number is never stored.

            if len(card_number) > 4:

                safe_card_number = card_number[-4:]

            else:

                safe_card_number = card_number

            # -------------------------------------------------
            # SAVE ORDER
            # -------------------------------------------------

            new_order = OrderModel.objects.create(

                name=name,

                card_number=safe_card_number,

                address=address,

                ordered_item=ordered_item,

                paid_status=True,

                paid_at=datetime.now(),

                total_price=total_price,

                is_delivered=is_delivered,

                delivered_at=delivered_at,

                user=request.user
            )

            # -------------------------------------------------
            # SUCCESS RESPONSE
            # -------------------------------------------------

            return Response(
                {
                    "success": True,

                    "data": {
                        "order_id": new_order.id,

                        "customer_id":
                            "demo_customer",

                        "message":
                            "Payment Successful"
                    }
                },

                status=status.HTTP_200_OK
            )

        except Exception as e:

            return Response(
                {
                    "detail": str(e)
                },

                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


# =========================================================
# RETRIEVE CARD
# =========================================================

class RetrieveCardView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        return Response(
            {
                "success": True,
                "message": "Card details are not available in demo mode."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# UPDATE CARD
# =========================================================

class CardUpdateView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        return Response(
            {
                "success": True,
                "detail": "Card updated successfully."
            },
            status=status.HTTP_200_OK
        )


# =========================================================
# DELETE CARD
# =========================================================

class DeleteCardView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):

        return Response(
            {
                "success": True,
                "detail": "Card deleted successfully."
            },
            status=status.HTTP_200_OK
        )

