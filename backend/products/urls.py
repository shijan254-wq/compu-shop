from django.urls import path
from .views import CategoryListCreateView, BrandListCreateView, ProductListView, ProductDetailView
urlpatterns = [
    path("categories/", CategoryListCreateView.as_view()),
    path("brands/", BrandListCreateView.as_view()),
    path("products/", ProductListView.as_view()),
    path("products/<slug:slug>/", ProductDetailView.as_view()),
]
