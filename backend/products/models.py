from django.db import models
from django.utils.text import slugify

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="categories/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ["name"]
    def save(self,*a,**k):
        if not self.slug: self.slug = slugify(self.name)
        super().save(*a,**k)
    def __str__(self): return self.name

class Brand(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    logo = models.ImageField(upload_to="brands/", blank=True, null=True)
    is_active = models.BooleanField(default=True)
    class Meta: ordering = ["name"]
    def save(self,*a,**k):
        if not self.slug: self.slug = slugify(self.name)
        super().save(*a,**k)
    def __str__(self): return self.name

class Product(models.Model):
    CONDITION_CHOICES = (("new","New"),("used","Used"),("refurbished","Refurbished"))
    TYPE_CHOICES = (("laptop","Laptop"),("desktop","Desktop"),("phone","Phone"),("tablet","Tablet"),("accessory","Accessory"))
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products")
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name="products")
    product_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="laptop")
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES, default="new")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    discount_price = models.DecimalField(max_digits=12, decimal_places=2, blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    sku = models.CharField(max_length=50, unique=True)
    processor = models.CharField(max_length=120, blank=True)
    ram = models.CharField(max_length=50, blank=True)
    storage = models.CharField(max_length=50, blank=True)
    screen_size = models.CharField(max_length=50, blank=True)
    battery = models.CharField(max_length=50, blank=True)
    os = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to="products/", blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["slug"]),models.Index(fields=["price"]),models.Index(fields=["is_active","is_featured"])]
    def save(self,*a,**k):
        if not self.slug:
            base = slugify(self.name); s = base; i = 1
            while Product.objects.filter(slug=s).exists(): s = f"{base}-{i}"; i += 1
            self.slug = s
        super().save(*a,**k)
    @property
    def final_price(self): return self.discount_price if self.discount_price else self.price
    @property
    def in_stock(self): return self.stock > 0
    def __str__(self): return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/gallery/")
    alt_text = models.CharField(max_length=150, blank=True)
    def __str__(self): return f"{self.product.name} — image"

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey("accounts.User", on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ["-created_at"]
        unique_together = ("product","user")
    def __str__(self): return f"{self.user.username} — {self.product.name}"

