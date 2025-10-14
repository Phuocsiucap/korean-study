from django.urls import path 
from . import views

urlpatterns = [
    path("generate_quiz/", views.generate_quiz, name="generate_quiz")
]