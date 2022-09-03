from django.test import TestCase
from rest_framework.test import APIRequestFactory, APIClient, APITestCase, force_authenticate
from rest_framework import status
from .views import UserModelViewSet
from django.contrib.auth.models import User
from .models import User as u
from .models import Projects as p
from mixer.backend.django import mixer


class UserAPIRequestFactory(TestCase):

    def setUp(self) -> None:
        self.factory = APIRequestFactory()
        self.user = User.objects.create_superuser(username='sergey', password='12345')
        self.url = '/api/users/'        
        self.view = UserModelViewSet.as_view({'get': 'list'})
        self.request = self.factory.get(self.url)

    def test_get_list_unauth(self):
        '''Пользователь не авторизован'''
        response = self.view(self.request)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_list_auth(self):
        '''Пользователь авторизован'''
        force_authenticate(self.request, user=self.user)
        response = self.view(self.request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ProjectAPIClient(APITestCase):

    def setUp(self) -> None:
        self.project = mixer.blend(p)
        self.client = APIClient()
        self.admin = User.objects.create_superuser(username='sergey', password='12345')
        self.url = f'/api/projects/{self.project.id}'

    def test_get_detail(self):
        '''Детальная информация о проекте'''
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_301_MOVED_PERMANENTLY)
        

class UserAPITestCase(APITestCase):

    def setUp(self) -> None:
        self.admin = User.objects.create_superuser(username='sergey', password='12345')
        self.count = 10
        self.url = '/api/users/'
        self.users = mixer.cycle(self.count).blend(u)
        self.guest = {
            "username": "serg",
            "first_name": "Сергей",
            "last_name": "Игошин",
            "email": "sergey@yandex.ru"
        }
    
    def test_authenticate(self): 
        self.client.force_authenticate(self.admin)       
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)      

    def test_login(self): 
        self.client.force_login(user=self.admin)       
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), self.count)

    def test_logout(self): 
        self.client.logout()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)        

    def test_create_guest(self):
        self.client.force_login(user=self.admin)
        response = self.client.post(self.url, self.guest, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        user = u.objects.get(pk=response.data.get('id'))
        self.assertEqual(user.username, self.guest.get('username'))        
