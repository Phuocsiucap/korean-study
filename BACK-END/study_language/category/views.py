from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Lesson, Word
from .serializers import CategorybaseSerializer, CategoryFullSerializer, LessonSerializer, WordSerializer

# from rest_framework.permissions import IsAuthenticated


class CategoryListView(APIView):
    
    def get(self, request):
        categories = Category.objects.filter(user=request.user)
        serializer = CategoryFullSerializer(categories, many=True)
        return Response(serializer.data)
    
    
    def post(self, request):
        serializer = CategoryFullSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CategoryDetailView(APIView):
  
    def get(self, request, id):
        # id = request.GET("id")
        category = Category.objects.get(id=id)
        serializer = CategoryFullSerializer(category)
        return Response(serializer.data)

class LessonListView(APIView):
   
    def get(self, request, category_id):
        # request.GET("category_id")
        lessons = Lesson.objects.filter(category_id=category_id)
        serializer = LessonSerializer(lessons, many=True)
        return Response(serializer.data)
    
    def post(self, request, category_id):
        data = request.data.copy()
        data["category"] =  category_id# gán category cho lesson
        serializer = LessonSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def put(self, request, category_id, lesson_id):
        data = request.data.copy()
        lesson = Lesson.objects.get(id=lesson_id, category_id=category_id)
        serializer = LessonSerializer(lesson, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, category_id, lesson_id):
        lesson = Lesson.objects.get(id=lesson_id, category_id=category_id)
        lesson.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)