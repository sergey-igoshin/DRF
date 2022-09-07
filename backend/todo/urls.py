from django.urls import path,  include
from rest_framework.routers import DefaultRouter
from .views import UserModelViewSet, ProjectModelViewSet, ToDoModelViewSet

app_name = 'todo'

router = DefaultRouter()
router.register("users", UserModelViewSet)
router.register("projects", ProjectModelViewSet)
router.register("todos", ToDoModelViewSet)

urlpatterns = [
    path('', include(router.urls))
]
