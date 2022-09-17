import os

from .settings import *

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "generate_new_valid_key")

DEBUG = False

ALLOWED_HOSTS.append('194.58.108.181')

del STATICFILES_DIRS
STATIC_ROOT = BASE_DIR / "static"