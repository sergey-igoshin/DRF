from django.contrib import admin
from django.urls import include, path, re_path
from rest_framework.authtoken import views
from todo.views import *
from drf_yasg.views import get_schema_view
from drf_yasg.openapi import Info, License, Contact

schema_view = get_schema_view(
    Info(
        title='ToDo',
        default_version='v1',
        description='description',
        license=License(name='MIT'),
        contact=Contact(email='sergey@csb-mirena.ru')
    )
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path('api-auth-token/', views.obtain_auth_token),
    path("api/", include('todo.urls')),
    path("api/<str:version>/", include('todo.urls')),
    path("user_get/", user_get),
    path("user_get/<int:pk>", user_get),
    path("user_post/", user_post),
    path("user_post/<int:pk>", user_post),
    path("project_get/", project_get),
    path("project_get/<int:pk>", project_get),
    path('views/api-view/users/', UserAPIVIew.as_view()),
    path('views/api-view/projects/', ProjectAPIVIew.as_view()),
    path('project_api_view_set/', ProjectsCustomViewSet.as_view({'get': 'list'})),
    path('project_api_view_set/<int:pk>', ProjectsCustomViewSet.as_view({'get': 'retrieve'})),
    path('project_api_view_set/kwargs/<str:title>', ProjectModelViewSet.as_view({'get': 'list'})),
    path('swagger', schema_view.with_ui()),
    re_path(r'swagger(?P<format>\.json|\.yaml)', schema_view.without_ui()),
]
