from django.contrib.auth.validators import ASCIIUsernameValidator
from django.db import models


class User(models.Model):
    username_validator = ASCIIUsernameValidator()
    username = models.CharField(
        ("username"),
        max_length=150,
        unique=True,
        help_text=("Только латиница, цифры и спец символы."),
        validators=[username_validator],
        error_messages={
            "unique": ("Пользователь с таким именем уже существует."),
        },
    )
    first_name = models.CharField(("Имя"), max_length=150)
    last_name = models.CharField(("Фамилия"), max_length=150)
    email = models.CharField(
        ("Email"),
        max_length=256,
        unique=True,
        error_messages={
            "unique": ("Пользователь с таким email уже существует."),
        },
    )
    is_active = models.BooleanField(
        ("Активировать пользователя"),
        default=True,
    )
    is_superuser = models.BooleanField(
        ("Администратор"),
        default=False,
    )
    is_staff = models.BooleanField(
        ("Персонал"),
        default=False,
    )
    created = models.DateTimeField(auto_now_add=True, verbose_name="Created", editable=False)
    updated = models.DateTimeField(auto_now=True, verbose_name="Edited", editable=False)
    
    def __str__(self) -> str:
        return f'{self.first_name} {self.last_name}'


class Projects(models.Model):
    url_repo = models.URLField(("Url репозиторий"), unique=True)
    title = models.CharField(("Название проекта"), max_length=256)
    description = models.CharField(("Описание проекта"), max_length=1024)
    created = models.DateTimeField(auto_now_add=True, verbose_name="Created", editable=False)
    updated = models.DateTimeField(auto_now=True, verbose_name="Edited", editable=False)
    project_is_completed = models.BooleanField(("Завершить проект"), default=False)
    user = models.ManyToManyField(User)    
    
    def __str__(self) -> str:
        return f"{self.title}"

    def delete(self, *args):
        self.project_is_completed = True
        self.save()


class ToDo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField(("Комментарий"), blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created", editable=False)
    updated = models.DateTimeField(auto_now=True, verbose_name="Edited", editable=False)
    todo_is_completed = models.BooleanField(("Завершить"), default=False)
    
    def __str__(self) -> str:
        return f"{self.user.first_name} {self.user.last_name}"  

    def delete(self, *args):
        self.todo_is_completed = True
        self.save() 
