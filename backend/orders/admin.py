from django.contrib import admin
from .models import Cart, CartItem, Order, OrderItem

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("__str__","item_count","total","created_at")
    inlines = [CartItemInline]

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product_name","price","quantity")

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("order_number","full_name","total_amount","status","created_at")
    list_filter = ("status","created_at")
    search_fields = ("order_number","full_name","email","phone")
    inlines = [OrderItemInline]
    readonly_fields = ("order_number","created_at","updated_at")
