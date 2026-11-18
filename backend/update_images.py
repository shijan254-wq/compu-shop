import os, django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()
from products.models import Product

# Picha halisi za kompyuta na simu (kutoka Unsplash)
images = {
    "HP Pavilion 15": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80",
    "Dell XPS 13": "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80",
    "Apple MacBook Air M3": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    "Lenovo ThinkPad X1": "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600&q=80",
    "Asus ROG Zephyrus": "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&q=80",
    "Acer Aspire 5": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&q=80",
    "iPhone 15 Pro": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80",
    "Samsung Galaxy S24": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&q=80",
    "Tecno Camon 30": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80",
    "Infinix Note 40": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80",
    "Sony Xperia 1 V": "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&q=80",
    "iPad Pro 11": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80",
    "Samsung Galaxy Tab S9": "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&q=80",
    "Desktop HP EliteDesk": "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&q=80",
    "Desktop Dell OptiPlex": "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80",
}

count = 0
for name, url in images.items():
    updated = Product.objects.filter(name=name).update(image_url=url)
    if updated:
        count += 1

print(f"OK! Picha zimewekwa kwenye bidhaa {count}")