
from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    category = models.CharField(
        max_length=100,
        default="Other"
    )

    price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    stock = models.BooleanField(
        default=False
    )

    image = models.URLField(
        max_length=500,
        blank=True,
        null=True
    )

    def __str__(self):
        return self.name

