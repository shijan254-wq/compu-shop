from django.db import models
from django.conf import settings

class Cart(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="cart", null=True, blank=True)
    session_key = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    @property
    def total(self): return sum(i.subtotal for i in self.items.all())
    @property
    def item_count(self): return sum(i.quantity for i in self.items.all())
    def __str__(self): return f"Cart ({self.user.username if self.user else 'anon'})"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    class Meta: unique_together = ("cart","product")
    @property
    def subtotal(self): return self.product.final_price * self.quantity
    def __str__(self): return f"{self.product.name} x {self.quantity}"

class Order(models.Model):
    STATUS_CHOICES = (("pending","Pending"),("paid","Paid"),("shipped","Shipped"),("delivered","Delivered"),("cancelled","Cancelled"))
    order_number = models.CharField(max_length=30, unique=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name="orders")
    full_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default="Tanzania")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta: ordering = ["-created_at"]
    def save(self,*a,**k):
        if not self.order_number:
            import uuid
            self.order_number = f"ORD-{uuid.uuid4().hex[:10].upper()}"
        super().save(*a,**k)
    def __str__(self): return self.order_number

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("products.Product", on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    @property
    def subtotal(self): return self.price * self.quantity
    def __str__(self): return f"{self.product_name} x {self.quantity}"

class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "product")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default="CompuShop")
    contact_email = models.EmailField(default="info@compushop.tz")
    contact_phone = models.CharField(max_length=20, default="+255 700 000 000")
    address = models.CharField(max_length=255, default="Dar es Salaam, Tanzania")

    class Meta:
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # Kudhamisha rekodi moja tu (Singleton)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.site_name
