from django.db import models
from django.contrib.auth.models import User
from django.db.models.deletion import SET_NULL
# Create your models here.

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    profile_img_url = models.TextField(max_length=5000, blank=True)
    is_follow_channel = models.BooleanField(default=False)
    
    def __str__(self):
        return f'[{self.pk}]{self.user.username}_profile'
    