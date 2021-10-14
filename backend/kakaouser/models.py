from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import SET_NULL
# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='related_profile')
    phone_number = models.CharField(max_length=20,null=True)
    thumbnail_url = models.TextField(max_length=5000, blank=True)
    is_follow_channel = models.BooleanField(default=False)
    
    def __str__(self):
        return f'[{self.pk}]{self.user.username}_profile'
    