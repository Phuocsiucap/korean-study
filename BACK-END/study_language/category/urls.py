from django.urls import path
from .views import *

urlpatterns = [
    path('categories', CategoryListView.as_view(), name='category-list'),
    path("categories/<int:id>", CategoryDetailView.as_view(), name="category-detail"),
    path("categories/<int:category_id>/lessons", LessonListView.as_view(), name="lesson-list"),
    path("categories/<int:category_id>/lessons/<int:lesson_id>", LessonListView.as_view(), name="lesson-detail"),
    # path("lessons/:id/", LessonDetailView.as_view(), name="lesson-detail"),
]