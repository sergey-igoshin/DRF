# from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
import io
from rest_framework.renderers import JSONRenderer
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import JSONParser
from .models import User, Projects, ToDo
from .serializers import UserModelSerializer, UserSerializer, ProjectModelSerializer, ProjectSerializer, ToDoModelSerializer
from django.views.decorators.csrf import csrf_exempt


class UserModelViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer


def user_get(request, pk=None):
    if pk is not None:
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user)
    else:
        user = User.objects.all()
        serializer = UserSerializer(user, many=True)

    json_data = JSONRenderer().render(serializer.data)
    return HttpResponse(json_data)


def project_get(request, pk=None):
    if pk is not None:
        projects = Projects.objects.get(pk=pk)
        serializer = ProjectSerializer(projects)
    else:
        projects = Projects.objects.all()
        serializer = ProjectSerializer(projects, many=True)

    json_data = JSONRenderer().render(serializer.data)
    return HttpResponse(json_data)


@csrf_exempt
def user_post(request, pk=None):
    json_data = JSONParser().parse(io.BytesIO(request.body))
    
    if request.method == "POST":
        serializer = UserSerializer(data=json_data)
    elif request.method == "PUT":
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=json_data)
    elif request.method == "PATCH":
        user = User.objects.get(pk=pk)
        serializer = UserSerializer(user, data=json_data, partial=True)

    if serializer.is_valid():
        user = serializer.save()
        serializer = UserSerializer(user)
        json_data = JSONRenderer().render(serializer.data)
        
        return HttpResponse(json_data)

    return HttpResponseBadRequest(JSONRenderer().render(serializer.errors))


class ProjectModelViewSet(ModelViewSet):
    queryset = Projects.objects.all()
    serializer_class = ProjectModelSerializer


class ToDoModelViewSet(ModelViewSet):
    queryset = ToDo.objects.all()
    serializer_class = ToDoModelSerializer
