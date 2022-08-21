from rest_framework.serializers import BooleanField, CharField, ModelSerializer, Serializer
from .models import User, Projects, ToDo


class UserSerializer(Serializer):
    username = CharField(max_length=150)
    first_name = CharField(max_length=150)
    last_name = CharField(max_length=150)
    email = CharField(max_length=256)
    is_active = BooleanField()

    def update(self, instance, validated_data):
        instance.username = validated_data.get("username", instance.username)
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.email = validated_data.get("email", instance.email)
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.save()
        return instance

    def create(self, validated_data):
        user = User(**validated_data)
        user.save()
        return user


class UserModelSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class ToDoModelSerializer(ModelSerializer):    
    class Meta:
        model = ToDo
        fields = "__all__"


class ProjectSerializer(Serializer):
    title = CharField(max_length=256)
    user = UserSerializer(many=True)


class ProjectModelSerializer(ModelSerializer):
    class Meta:
        model = Projects        
        fields = "__all__"
