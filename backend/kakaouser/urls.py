from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.kakaouser_landing),
    path('profile_list/', views.profile_list),
    path('create_profile/', views.create_profile),
    path('kakao_login/', views.kakao_login),
    path('kakao_login/send_result/', views.kakao_login_result),
    path('login_complete/', views.LoginComplete),
    path('create_nickname/', views.create_nickname)
]

urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root = settings.STATIC_ROOT)