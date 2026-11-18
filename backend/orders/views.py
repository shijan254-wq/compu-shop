from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem, Order, OrderItem, Wishlist, SiteSettings
from .serializers import CartSerializer, OrderSerializer, WishlistSerializer, SiteSettingsSerializer
from products.models import Product, Review
from products.serializers import ReviewSerializer

def get_or_create_cart(user):
    cart, _ = Cart.objects.get_or_create(user=user)
    return cart

class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        return Response(CartSerializer(get_or_create_cart(request.user)).data)

class CartAddView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        cart = get_or_create_cart(request.user)
        pid = request.data.get("product_id")
        qty = int(request.data.get("quantity", 1))
        product = get_object_or_404(Product, id=pid, is_active=True)
        item, created = CartItem.objects.get_or_create(cart=cart, product=product, defaults={"quantity": qty})
        if not created:
            item.quantity += qty; item.save()
        return Response(CartSerializer(cart).data)

class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def patch(self, request, pk):
        cart = get_or_create_cart(request.user)
        item = get_object_or_404(CartItem, id=pk, cart=cart)
        item.quantity = int(request.data.get("quantity", item.quantity))
        if item.quantity <= 0: item.delete()
        else: item.save()
        return Response(CartSerializer(cart).data)
    def delete(self, request, pk):
        cart = get_or_create_cart(request.user)
        item = get_object_or_404(CartItem, id=pk, cart=cart)
        item.delete()
        return Response(CartSerializer(cart).data)

class CheckoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request):
        cart = get_or_create_cart(request.user)
        if not cart.items.exists():
            return Response({"detail":"Cart ni tupu."}, status=400)
        d = request.data
        order = Order.objects.create(
            user=request.user,
            full_name=d.get("full_name",""), email=d.get("email",""),
            phone=d.get("phone",""), address=d.get("address",""),
            city=d.get("city",""), country=d.get("country","Tanzania"),
            notes=d.get("notes",""),
        )
        total = 0
        for item in cart.items.all():
            OrderItem.objects.create(order=order, product=item.product,
                product_name=item.product.name, price=item.product.final_price, quantity=item.quantity)
            total += item.product.final_price * item.quantity
        order.total_amount = total; order.save()
        # Tuma Email (Inaonekana kwenye terminal ya Django)
        try:
            send_mail(
                f"Oda yako {order.order_number} imepokelewa",
                f"Habari {order.full_name},\n\nAsante kwa kununua CompuShop. Oda yako yenye thamani ya {total} imepokelewa na inashughulikiwa.\n\nKaribu tena!",
                "noreply@compushop.tz",
                [order.email],
                fail_silently=True,
            )
        except Exception as e:
            print(f"Email error: {e}")
        cart.items.all().delete()
        return Response(OrderSerializer(order).data, status=201)

class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return Order.objects.filter(user=self.request.user)

class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self): return Order.objects.filter(user=self.request.user)

class WishlistView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        items = Wishlist.objects.filter(user=request.user)
        return Response(WishlistSerializer(items, many=True).data)

    def post(self, request):
        product_id = request.data.get("product_id")
        product = get_object_or_404(Product, id=product_id)
        item, created = Wishlist.objects.get_or_create(user=request.user, product=product)
        if not created:
            item.delete()
            return Response({"detail": "Imeondolewa kwenye wishlist"}, status=200)
        return Response(WishlistSerializer(item).data, status=201)


class ReviewCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")
        rating = int(request.data.get("rating", 5))
        comment = request.data.get("comment", "")
        product = get_object_or_404(Product, id=product_id)
        
        review, created = Review.objects.update_or_create(
            product=product, user=request.user,
            defaults={"rating": rating, "comment": comment}
        )
        return Response(ReviewSerializer(review).data, status=201)


class SearchSuggestionsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "")
        if len(query) < 2:
            return Response([])
        products = Product.objects.filter(name__icontains=query, is_active=True)[:5]
        return Response([{"id": p.id, "name": p.name, "slug": p.slug} for p in products])


from django.core.mail import send_mail
from rest_framework import generics

class SiteSettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = SiteSettingsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        obj, _ = SiteSettings.objects.get_or_create(pk=1)
        return obj

