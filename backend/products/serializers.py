from rest_framework import serializers
from .models import Category, Brand, Product, ProductImage, Review

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id","name","slug","description","image", "image_url","is_active","created_at")

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ("id","name","slug","logo","is_active")

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id","image", "image_url","alt_text")

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model = Review
        fields = ("id","product","user","user_name","rating","comment","created_at")
        read_only_fields = ("id","user","created_at")

class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    brand_name = serializers.CharField(source="brand.name", read_only=True)
    final_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    class Meta:
        model = Product
        fields = ("id","name","slug","price","discount_price","final_price","category","category_name","brand","brand_name","product_type","condition","stock","in_stock","image", "image_url","is_featured","created_at")

class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    final_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    in_stock = serializers.BooleanField(read_only=True)
    class Meta:
        model = Product
        fields = "__all__"

