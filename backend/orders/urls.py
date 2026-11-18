from django.urls import path
from .views import (
    CartView, CartAddView, CartItemView, CheckoutView, 
    OrderListView, OrderDetailView, WishlistView, 
    ReviewCreateView, SearchSuggestionsView, SiteSettingsView
)

urlpatterns = [
    path("cart/", CartView.as_view()),
    path("cart/add/", CartAddView.as_view()),
    path("cart/items/<int:pk>/", CartItemView.as_view()),
    path("checkout/", CheckoutView.as_view()),
    path("orders/", OrderListView.as_view()),
    path("orders/<int:pk>/", OrderDetailView.as_view()),
    path("wishlist/", WishlistView.as_view()),
    path("reviews/", ReviewCreateView.as_view()),
    path("search/suggestions/", SearchSuggestionsView.as_view()),
    path("settings/", SiteSettingsView.as_view()),
]