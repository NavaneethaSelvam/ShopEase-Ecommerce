from .models import StripeModel, BillingAddress, OrderModel
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken


# =========================================================
# USER SERIALIZER
# =========================================================

class UserSerializer(serializers.ModelSerializer):

    admin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "admin"
        ]

    def get_admin(self, obj):
        return obj.is_staff


# =========================================================
# USER REGISTER TOKEN SERIALIZER
# =========================================================

class UserRegisterTokenSerializer(UserSerializer):

    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "admin",
            "token"
        ]

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


# =========================================================
# STRIPE CARD SERIALIZER
# =========================================================

class CardsListSerializer(serializers.ModelSerializer):

    class Meta:
        model = StripeModel
        fields = "__all__"


# =========================================================
# BILLING ADDRESS SERIALIZER
# =========================================================

class BillingAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = BillingAddress
        fields = "__all__"


# =========================================================
# ORDERS SERIALIZER
# =========================================================

class AllOrdersListSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderModel
        fields = "__all__"