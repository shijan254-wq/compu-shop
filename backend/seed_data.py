import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from products.models import Category, Brand, Product

print("Inaanza kuweka seed data...")

# Categories
for c in ["Laptops","Desktops","Phones","Tablets","Accessories"]:
    Category.objects.get_or_create(name=c, defaults={"description": f"{c} mbalimbali"})

# Brands
for b in ["HP","Dell","Apple","Lenovo","Samsung","Asus","Acer","Sony","Tecno","Infinix"]:
    Brand.objects.get_or_create(name=b)

# Products na Picha zake
data = [
    ("HP Pavilion 15","laptop","HP","Laptops",1200000,"Core i5, 8GB RAM, 512GB SSD", "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80"),
    ("Dell XPS 13","laptop","Dell","Laptops",2200000,"Core i7, 16GB RAM, 1TB SSD", "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80"),
    ("Apple MacBook Air M3","laptop","Apple","Laptops",3200000,"M3 chip, 16GB, 512GB SSD", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"),
    ("Lenovo ThinkPad X1","laptop","Lenovo","Laptops",2800000,"Core i7, 16GB, 1TB SSD", "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80"),
    ("Asus ROG Zephyrus","laptop","Asus","Laptops",3500000,"Ryzen 9, 32GB, RTX 4060", "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80"),
    ("Acer Aspire 5","laptop","Acer","Laptops",950000,"Core i5, 8GB, 512GB SSD", "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80"),
    ("iPhone 15 Pro","phone","Apple","Phones",2800000,"A17 Pro, 8GB, 256GB", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80"),
    ("Samsung Galaxy S24","phone","Samsung","Phones",2400000,"Snapdragon 8 Gen 3, 8GB, 256GB", "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80"),
    ("Tecno Camon 30","phone","Tecno","Phones",450000,"8GB, 256GB", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80"),
    ("Infinix Note 40","phone","Infinix","Phones",380000,"8GB, 256GB", "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80"),
    ("Sony Xperia 1 V","phone","Sony","Phones",2600000,"Snapdragon 8 Gen 2, 12GB, 256GB", "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80"),
    ("iPad Pro 11","tablet","Apple","Tablets",2000000,"M2 chip, 8GB, 256GB", "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80"),
    ("Samsung Galaxy Tab S9","tablet","Samsung","Tablets",1500000,"Snapdragon 8 Gen 2, 12GB, 256GB", "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80"),
    ("Desktop HP EliteDesk","desktop","HP","Desktops",900000,"Core i5, 8GB, 1TB HDD", "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&q=80"),
    ("Desktop Dell OptiPlex","desktop","Dell","Desktops",850000,"Core i5, 8GB, 500GB SSD", "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80"),
]

for i, (name, ptype, brand, cat, price, desc, img) in enumerate(data, 1):
    Product.objects.get_or_create(
        sku=f"SKU-{i:03d}",
        defaults={
            "name": name, "description": desc, "product_type": ptype,
            "category": Category.objects.get(name=cat),
            "brand": Brand.objects.get(name=brand),
            "price": price, "stock": 10 + i, "is_featured": i <= 6,
            "image_url": img
        }
    )

print(f"OK! Categories: {Category.objects.count()}, Brands: {Brand.objects.count()}, Products: {Product.objects.count()}")