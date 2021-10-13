from django.shortcuts import redirect, render
from .models import Profile
from .forms import ProfileForm

# Create your views here.


def kakaouser_landing(request):
    return render(request, 'kakaouser/kakaouser_landing.html')


def profile_list(request):
    profile_list = Profile.objects.all()
    
    return render(request, 'kakaouser/profile_list.html', {'profile_list' : profile_list})


def create_profile(request):
    if request.method == 'POST':
        profile_form = ProfileForm(request.POST)
        if profile_form.is_valid():
            profile_form.save()
            return redirect('/kakaouser/profile_list/')
    
    else:
        profile_form = ProfileForm()
        return render(request, 'kakaouser/create_profile.html', {'profile_form' : profile_form})