from django.db import models
from django.contrib.auth.validators import ASCIIUsernameValidator


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
    first_name = models.CharField(("first name"), max_length=150)
    last_name = models.CharField(("last name"), max_length=150)
    email = models.CharField(
        ("email address"),
        max_length=256,
        unique=True,
        error_messages={
            "unique": ("Пользователь с таким email уже существует."),
        },
    )
    is_active = models.BooleanField(
        ("active"),
        default=True,
        help_text=(
            "Пользователь активный"
        ),
    )
    created = models.DateTimeField(auto_now_add=True, verbose_name="Created", editable=False)
    updated = models.DateTimeField(auto_now=True, verbose_name="Edited", editable=False)

