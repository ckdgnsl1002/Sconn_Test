from django import forms
from django.db.models import fields
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model=Profile
        fields=['user','phone_number','thumbnail_url', 'is_follow_channel']