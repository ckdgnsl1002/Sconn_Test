from django.shortcuts import redirect, render
from .models import Profile
from django.contrib.auth.models import User
from django.contrib import auth
from .forms import ProfileForm
from django.http import HttpResponse,JsonResponse
import json

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
    
def kakao_login(request):
    return render(request, 'kakaouser/index.html')


def kakao_login_result(request):
    if request.is_ajax() and request.method == 'POST': #ajax 방식일 때 아래 코드 실행
        user_pk = request.POST.get('user_pk')
        phone_number = request.POST.get('phone_number')
        email = request.POST.get('email')
        thumbnail_url = request.POST.get('thumbnail_url')
        
        nickname = request.POST.get('nickname')
        print(user_pk)
        print(phone_number)
        print(email)
        print(thumbnail_url)
        print(nickname)
        
        all_user = User.objects.all()
        
        context = {}
        
        if request.user.is_authenticated:
            auth.logout(request)
            print('logout complete')
        
        # DB에 현재 정보와 일치하는 유저가 있다면 로그인 시켜라
        try:
            matched_user = all_user.get(email=email)
        except:
            matched_user = None
            
        print(matched_user)
        
        if matched_user != None:
            verified_user = auth.authenticate(username = matched_user.username, password=user_pk)
            print(verified_user)
            if verified_user:
                auth.login(request, verified_user)
                print('login complete')
                context['user_create'] = False
                context['username'] = str(verified_user.username)
            else:
                pass
                
        else:
            # 없다면 새로 만들어라
            print('계정생성됨')
            created_user = User.objects.create_user(
                username=nickname,
                password=user_pk,
                email=email
            )
            auth.login(request, created_user)
            context['user_create'] = True
            context['username'] = str(created_user.username)
            
            print('생성된 계정으로 로그인 완료')
            
            created_profile = Profile.objects.create(
                user = created_user, 
                phone_number = phone_number,
                thumbnail_url = thumbnail_url,
                is_follow_channel = False,
                )
            created_profile.save()
            
            
        
        return JsonResponse(json.dumps(context), safe=False, json_dumps_params = {'ensure_ascii':False})
    
    
def LoginComplete(request):
    return render(request, 'kakaouser/login_complete.html')


def create_nickname(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            new_nickname = request.POST.get('new_nickname')
            context={}
            if new_nickname:
                current_user = request.user
                current_user.username = new_nickname
                current_user.save()
                context['new_username'] = new_nickname
                
            return JsonResponse(json.dumps(context), safe=False, json_dumps_params = {'ensure_ascii':False})
                
        else:
            return redirect('/')
            