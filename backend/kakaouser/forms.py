from django import forms
from django.db.models import fields
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model=Profile
        fields=['user','profile_img_url', 'is_follow_channel']