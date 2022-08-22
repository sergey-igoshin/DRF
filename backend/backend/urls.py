"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views
from todo.views import ProjectModelViewSet, ProjectsCustomViewSet, ToDoModelViewSet, UserModelViewSet, project_get, user_get, user_post
# from todo import views


router = DefaultRouter()
router.register("users", UserModelViewSet)
router.register("projects", ProjectModelViewSet)
router.register("todos", ToDoModelViewSet)

# router.register("users", UserCustomViewSet)
# router.register("projects", ProjectsCustomViewSet)
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path('api-auth-token/', views.obtain_auth_token),
    path("api/", include(router.urls)),
    path("user_get/", user_get),
    path("user_get/<int:pk>", user_get),
    path("user_post/", user_post),
    path("user_post/<int:pk>", user_post),
    path("project_get/", project_get),
    path("project_get/<int:pk>", project_get),
    # path('views/api-view/users/', views.UserAPIVIew.as_view()),
    # path('views/api-view/projects/', views.ProjectAPIVIew.as_view()),
    path('project_api_view_set/', ProjectsCustomViewSet.as_view({'get': 'list'})),
    path('project_api_view_set/<int:pk>', ProjectsCustomViewSet.as_view({'get': 'retrieve'})),
    path('project_api_view_set/kwargs/<str:title>', ProjectModelViewSet.as_view({'get': 'list'})),
]
