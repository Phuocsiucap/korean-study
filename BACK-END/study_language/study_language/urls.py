"""
URL configuration for study_language project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from category.urls import urlpatterns as category_urls
from users.urls import urlpatterns as users_urls
from AIgen.urls import urlpatterns as AIgen_urls

from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.middleware.csrf import get_token

@ensure_csrf_cookie
def csrf_view(request):
    return JsonResponse({"csrfToken": get_token(request)})

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/csrf/", csrf_view),
    path("api/", include(category_urls)),
    path('api/users/', include(users_urls)),
    path('api/aigen/', include(AIgen_urls)),
]
