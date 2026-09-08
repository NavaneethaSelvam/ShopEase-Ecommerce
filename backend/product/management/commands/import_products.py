
import requests
from django.core.management.base import BaseCommand
from product.models import Product


class Command(BaseCommand):

    help = "Import all available products from DummyJSON"


    def handle(self, *args, **kwargs):

        base_url = "https://dummyjson.com/products"

        limit = 100
        skip = 0

        all_products = []


        self.stdout.write(
            "Fetching products from DummyJSON..."
        )


        # =========================================
        # FETCH ALL AVAILABLE PRODUCTS
        # =========================================

        while True:

            response = requests.get(
                base_url,
                params={
                    "limit": limit,
                    "skip": skip
                },
                timeout=30
            )

            response.raise_for_status()

            data = response.json()

            products = data.get(
                "products",
                []
            )

            all_products.extend(products)


            total = data.get(
                "total",
                len(all_products)
            )


            self.stdout.write(
                f"Fetched {len(all_products)} / {total}"
            )


            if len(all_products) >= total:
                break


            skip += limit


        # =========================================
        # SAVE PRODUCTS TO DATABASE
        # =========================================

        count = 0


        for item in all_products:

            title = item.get(
                "title",
                "Unnamed Product"
            )


            description = item.get(
                "description",
                ""
            )


            price = item.get(
                "price",
                0
            )


            stock = item.get(
                "stock",
                0
            )


            category = item.get(
                "category",
                "Other"
            )


            # =====================================
            # PRODUCT IMAGE
            # =====================================

            image_url = (
                item.get("thumbnail")
                or (
                    item.get("images")
                    or [""]
                )[0]
            )


            # =====================================
            # SAVE / UPDATE PRODUCT
            # =====================================

            Product.objects.update_or_create(

                name=title,

                defaults={

                    "description":
                        description,

                    "category":
                        category,

                    "price":
                        price,

                    "stock":
                        stock > 0,

                    "image":
                        image_url,

                }
            )


            count += 1


        # =========================================
        # RESULT
        # =========================================

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully imported {count} products."
            )
        )

