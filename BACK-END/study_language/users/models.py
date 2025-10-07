# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    points= models.FloatField(default = 0)
    streak= models.IntegerField(default = 0)
    wordsLearned = models.IntegerField(default = 0)
    studyTime = models.FloatField(default = 0)
    phone = models.CharField(max_length=20, blank=True, null=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
