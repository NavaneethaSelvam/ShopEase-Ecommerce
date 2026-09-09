from .models import StripeModel, BillingAddress, OrderModel

from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password, check_password

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    UserSerializer,
    UserRegisterTokenSerializer,
    CardsListSerializer,
    BillingAddressSerializer,
    AllOrdersListSerializer
)


# =========================================================
# REGISTER USER
# =========================================================

class UserRegisterView(APIView):
    """Register a new user."""

    def post(self, request, format=None):

        data = request.data

        username = data.get("username", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")

        if username == "" or email == "" or password == "":
            return Response(
                {
                    "detail": "Username, email and password cannot be empty."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        check_username = User.objects.filter(
            username=username
        ).exists()

        check_email = User.objects.filter(
            email=email
        ).exists()

        if check_username:
            return Response(
                {
                    "detail": "A user with that username already exists!"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if check_email:
            return Response(
                {
                    "detail": "A user with that email address already exists!"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password)
        )

        serializer = UserRegisterTokenSerializer(
            user,
            many=False
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


# =========================================================
# LOGIN
# =========================================================

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):

        data = super().validate(attrs)

        serializer = UserRegisterTokenSerializer(
            self.user
        ).data

        for key, value in serializer.items():
            data[key] = value

        return data


class MyTokenObtainPairView(TokenObtainPairView):

    serializer_class = MyTokenObtainPairSerializer


# =========================================================
# STRIPE CARDS LIST
# =========================================================

class CardsListView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):

        stripe_cards = StripeModel.objects.filter(
            user=request.user
        )

        serializer = CardsListSerializer(
            stripe_cards,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# USER ACCOUNT DETAILS
# =========================================================

class UserAccountDetailsView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, pk):

        try:

            user = User.objects.get(id=pk)

            serializer = UserSerializer(
                user,
                many=False
            )

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        except User.DoesNotExist:

            return Response(
                {
                    "detail": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


# =========================================================
# UPDATE USER ACCOUNT
# =========================================================

class UserAccountUpdateView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def put(self, request, pk):

        try:

            user = User.objects.get(id=pk)

            if request.user.id != user.id:

                return Response(
                    {
                        "detail": "Permission denied."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            username = request.data.get(
                "username",
                user.username
            )

            email = request.data.get(
                "email",
                user.email
            )

            password = request.data.get(
                "password",
                ""
            )

            user.username = username
            user.email = email

            if password != "":
                user.password = make_password(password)

            user.save()

            serializer = UserSerializer(
                user,
                many=False
            )

            return Response(
                {
                    "details": "User successfully updated.",
                    "user": serializer.data
                },
                status=status.HTTP_200_OK
            )

        except User.DoesNotExist:

            return Response(
                {
                    "detail": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


# =========================================================
# DELETE USER ACCOUNT
# =========================================================

class UserAccountDeleteView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request, pk):

        try:

            user = User.objects.get(id=pk)

            if request.user.id != user.id:

                return Response(
                    {
                        "detail": "Permission denied."
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            password = request.data.get(
                "password",
                ""
            )

            if check_password(
                password,
                user.password
            ):

                user.delete()

                return Response(
                    {
                        "details": "User successfully deleted."
                    },
                    status=status.HTTP_204_NO_CONTENT
                )

            return Response(
                {
                    "detail": "Incorrect password."
                },
                status=status.HTTP_401_UNAUTHORIZED
            )

        except User.DoesNotExist:

            return Response(
                {
                    "detail": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


# =========================================================
# GET ALL BILLING ADDRESSES
# =========================================================

class UserAddressesListView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):

        user_addresses = BillingAddress.objects.filter(
            user=request.user
        )

        serializer = BillingAddressSerializer(
            user_addresses,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# GET SINGLE ADDRESS
# =========================================================

class UserAddressDetailsView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request, pk):

        try:

            user_address = BillingAddress.objects.get(
                id=pk,
                user=request.user
            )

            serializer = BillingAddressSerializer(
                user_address,
                many=False
            )

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        except BillingAddress.DoesNotExist:

            return Response(
                {
                    "detail": "Address not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )


# =========================================================
# CREATE BILLING ADDRESS
# =========================================================

class CreateUserAddressView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def post(self, request):

        data = request.data

        new_address = {
            "name": data.get("name", "").strip(),
            "user": request.user.id,
            "phone_number": data.get(
                "phone_number",
                ""
            ).strip(),
            "pin_code": data.get(
                "pin_code",
                ""
            ).strip(),
            "house_no": data.get(
                "house_no",
                ""
            ).strip(),
            "landmark": data.get(
                "landmark",
                ""
            ).strip(),
            "city": data.get(
                "city",
                ""
            ).strip(),
            "state": data.get(
                "state",
                ""
            ).strip(),
        }

        serializer = BillingAddressSerializer(
            data=new_address,
            many=False
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "detail": "Address validation failed.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# UPDATE BILLING ADDRESS
# =========================================================

class UpdateUserAddressView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def put(self, request, pk):

        try:

            user_address = BillingAddress.objects.get(
                id=pk,
                user=request.user
            )

        except BillingAddress.DoesNotExist:

            return Response(
                {
                    "detail": "Address not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        data = request.data

        updated_address = {
            "name": data.get(
                "name",
                user_address.name
            ),

            "user": request.user.id,

            "phone_number": data.get(
                "phone_number",
                user_address.phone_number
            ),

            "pin_code": data.get(
                "pin_code",
                user_address.pin_code
            ),

            "house_no": data.get(
                "house_no",
                user_address.house_no
            ),

            "landmark": data.get(
                "landmark",
                user_address.landmark or ""
            ),

            "city": data.get(
                "city",
                user_address.city
            ),

            "state": data.get(
                "state",
                user_address.state
            ),
        }

        serializer = BillingAddressSerializer(
            user_address,
            data=updated_address,
            many=False
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "detail": "Address validation failed.",
                "errors": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# =========================================================
# DELETE BILLING ADDRESS
# =========================================================

class DeleteUserAddressView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def delete(self, request, pk):

        try:

            user_address = BillingAddress.objects.get(
                id=pk,
                user=request.user
            )

        except BillingAddress.DoesNotExist:

            return Response(
                {
                    "detail": "Address not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        user_address.delete()

        return Response(
            {
                "detail": "Address successfully deleted."
            },
            status=status.HTTP_204_NO_CONTENT
        )


# =========================================================
# ALL ORDERS LIST
# =========================================================

class OrdersListView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):

        if request.user.is_staff:

            orders = OrderModel.objects.all()

        else:

            orders = OrderModel.objects.filter(
                user=request.user
            )

        serializer = AllOrdersListSerializer(
            orders,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


# =========================================================
# CHANGE ORDER DELIVERY STATUS
# =========================================================

class ChangeOrderStatus(APIView):

    permission_classes = [
        permissions.IsAdminUser
    ]

    def put(self, request, pk):

        try:

            order = OrderModel.objects.get(
                id=pk
            )

        except OrderModel.DoesNotExist:

            return Response(
                {
                    "detail": "Order not found."
                },
                status=status.HTTP_404_NOT_FOUND
            )

        order.is_delivered = request.data.get(
            "is_delivered",
            order.is_delivered
        )

        order.delivered_at = request.data.get(
            "delivered_at",
            order.delivered_at
        )

        order.save()

        serializer = AllOrdersListSerializer(
            order,
            many=False
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )