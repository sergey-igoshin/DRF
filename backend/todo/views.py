# from django.shortcuts import render
from django.http import HttpResponse, HttpResponseBadRequest
import io
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.viewsets import ModelViewSet
from rest_framework.parsers import JSONParser
from .models import User, Projects, ToDo
from .serializers import UserModelSerializer, UserModelSerializerVersion2, UserSerializer, ProjectModelSerializer, ProjectSerializer, ToDoModelSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from rest_framework import mixins
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import DjangoModelPermissions


class ProjectLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10


class ToDoLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 20


class UserCustomViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin, 
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet
    ):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]


class ProjectsCustomViewSet(
    mixins.CreateModelMixin, 
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin, 
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet
    ):
    queryset = Projects.objects.all()
    serializer_class = ProjectSerializer
    renderer_classes = [JSONRenderer, BrowsableAPIRenderer]



class UserAPIVIew(APIView):
    renderer_classes = [JSONRenderer]
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)


class ProjectAPIVIew(APIView):
    renderer_classes = [JSONRenderer]
    def get(self, request, format=None):
        projects = Projects.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class UserModelViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    # renderer_classes = [JSONRenderer]
    # serializer_class = UserModelSerializer
    permission_classes = [DjangoModelPermissions]

    def get_serializer_class(self):
        if self.request.version == 'v2':
            return UserModelSerializerVersion2
        return UserModelSerializer


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
    pagination_class = ProjectLimitOffsetPagination
    permission_classes = [DjangoModelPermissions]

    @action(detail=True, methods=['get'])
    def get_project_title(self, request, pk=None):
        project = get_object_or_404(Projects, pk=pk)
        return Response({'title': str(project)})

    def get_queryset(self):
        title = self.request.query_params.get('title', None)
        if title:
            return Projects.objects.filter(title=title)
        return Projects.objects.all()


class ToDoModelViewSet(ModelViewSet):
    queryset = ToDo.objects.all()
    serializer_class = ToDoModelSerializer
    pagination_class = ToDoLimitOffsetPagination
    permission_classes = [DjangoModelPermissions]
