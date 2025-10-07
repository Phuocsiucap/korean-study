from django.db import models
from django.conf import settings


# Create your models here.
class Category(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,  # dùng CustomUser
        on_delete=models.CASCADE,
        related_name='categories'
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    lesson = models.IntegerField(default = 0)
    total_words = models.IntegerField(default = 0)
    completed = models.IntegerField(default = 0)
    progress = models.FloatField(default = 0.0)
    icon = models.CharField(max_length=255, blank=True, null=True)  # URL or path to the icon image
    color = models.CharField(max_length=7, blank=True, null=True)  # Hex color code, e.g., #RRGGBB
    def __str__(self):
        return self.name
    
class Lesson(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    word_count = models.IntegerField(default = 0)
    difficulty = models.CharField(max_length=50) #de, trung binh, kho
    completed = models.BooleanField(default=False)
    lastStudied = models.DateTimeField(auto_now_add=True)
    score = models.IntegerField(default = 0)
    studyTime = models.FloatField(default = 0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='lessons')
    
    def __str__(self):
        return f"{self.title} - {self.category.name}"
    
class Word(models.Model):
    word = models.CharField(max_length=100)
    meaning = models.CharField(max_length=255)
    difficulty = models.IntegerField(default = 1) #1-5
    learned = models.BooleanField(default=False)
    lastStudied = models.DateTimeField(null=True, blank=True)
    streak = models.IntegerField(default = 0) #max = 3 if = 0 down level of word
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='words')
    
    def __str__(self):
        return f"{self.word} - {self.meaning}"