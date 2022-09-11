from logging import error
import graphene
from graphene_django import DjangoObjectType
from .models import User, Projects, ToDo


class UserObjectType(DjangoObjectType):
    class Meta:
        model = User
        field = "__all__"


class ProjectObjectType(DjangoObjectType):
    class Meta:
        model = Projects
        field = "__all__"


class TodoObjectType(DjangoObjectType):
    class Meta:
        model = ToDo
        field = "__all__"


class Query(graphene.ObjectType):
    
    all_users = graphene.List(UserObjectType)

    def resolve_all_users(self, info):
        return User.objects.all()

    all_projects = graphene.List(ProjectObjectType)

    def resolve_all_projects(self, info):
        return Projects.objects.all()

    all_todos = graphene.List(TodoObjectType)

    def resolve_all_todos(self, info):
        return ToDo.objects.all()

    get_user_by_id = graphene.Field(UserObjectType, pk=graphene.Int(required=True))

    def resolve_get_user_by_id(self, info, pk):
        return User.objects.get(pk=pk)

    get_user_by_name = graphene.List(
        UserObjectType, 
        first_name=graphene.String(required=False),
        last_name=graphene.String(required=False)
    )

    def resolve_get_user_by_name(self, info, first_name=None, last_name=None):

        params = {}

        if not first_name and not last_name:
            return User.objects.all()       

        if first_name :
            params['first_name'] = first_name
        if last_name :
            params['last_name'] = last_name

        return User.objects.filter(**params)
        

class UserCreateMutation(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        email = graphene.String(required=True)
        is_active = graphene.Boolean(required=True)
        is_superuser = graphene.Boolean(required=True)
        is_staff = graphene.Boolean(required=True)

    user = graphene.Field(UserObjectType)

    @classmethod
    def mutate(cls, root, info, username, first_name, last_name, email, is_active, is_superuser, is_staff):
        user = User(
            username=username,
            first_name=first_name, 
            last_name=last_name, 
            email=email, 
            is_active=is_active,
            is_superuser=is_superuser, 
            is_staff=is_staff
        )
        user.save()
        return cls(user)


class UserUpdateMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.Int(required=True)
        username = graphene.String(required=False)
        first_name = graphene.String(required=False)
        last_name = graphene.String(required=False)
        email = graphene.String(required=False)
        is_active = graphene.Boolean(required=False)
        is_superuser = graphene.Boolean(required=False)
        is_staff = graphene.Boolean(required=False)

    user = graphene.Field(UserObjectType)

    @classmethod
    def mutate(cls, root, info, pk, username=None, first_name=None, last_name=None, email=None, is_active=None, is_superuser=None, is_staff=None):
        user = User.objects.get(pk=pk)
        if username:
            user.username = username

        if first_name:
            user.first_name = first_name

        if last_name:
            user.last_name = last_name

        if email:
            user.email = email

        if is_active:
            user.is_active = is_active

        if is_superuser:
            user.is_superuser = is_superuser

        if is_staff:
            user.is_staff = is_staff

        if username or first_name or last_name or email or is_active or is_superuser or is_staff:
            user.save()
        return cls(user)


class UserDeleteMutation(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        pk = graphene.ID()

    user = graphene.Field(UserObjectType)

    @classmethod
    def mutate(cls, root, info, **kwargs):
        ok = False
        user = User.objects.get(pk=kwargs["pk"])

        if user:
            ok = True
            user.delete()

        return UserDeleteMutation(ok=ok)


#######################################################################


class UserInput(graphene.InputObjectType):
    pk = graphene.Int()


class ProjectInput(graphene.InputObjectType):
    url_repo = graphene.String()
    title = graphene.String()
    description = graphene.String()
    project_is_completed = graphene.Boolean()
    user = graphene.List(UserInput)



class ProjectCreateMutation(graphene.Mutation):
    class Arguments:
        input = ProjectInput(required=True)

    ok = graphene.Boolean()
    project = graphene.Field(ProjectObjectType)

    @staticmethod
    def mutate(root, info, input=None):
        ok = True
        users = []
        for user_id in input.user:                       
            user = User.objects.get(pk=user_id.pk)            
            if user is None:
                return ProjectCreateMutation(ok=False, project=None)
            users.append(user_id.pk)
        
        instance = Projects(
            url_repo = input.url_repo,
            title = input.title,
            description = input.description,
            project_is_completed = input.project_is_completed
        )
        instance.save()
        instance.user.set(users)
        return ProjectCreateMutation(ok=ok, project=instance)


class ProjectUpdateMutation(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        input = ProjectInput(required=False)

    ok = graphene.Boolean()
    project = graphene.Field(ProjectObjectType)

    @staticmethod
    def mutate(root, info, id, input=None):
        ok = False
        project_instance = Projects.objects.get(pk=id)        

        if project_instance:
            ok = True            

            if input.url_repo:
                project_instance.url_repo = input.url_repo
            if input.title:    
                project_instance.title = input.title
            if input.description:
                project_instance.description = input.description
            if input.project_is_completed:
                project_instance.project_is_completed = input.project_is_completed
            
            project_instance.save()

            if input.user:
                users = []                
                for user_input in input.user:                    
                    user_id = User.objects.get(pk=user_input.pk)
                    
                    if user_id is None:
                        return ProjectUpdateMutation(ok=False, project=None)
                    users.append(user_id.pk)
                project_instance.user.set(users)
                print(users)

            return ProjectUpdateMutation(ok=ok, project=project_instance)
        return ProjectUpdateMutation(ok=ok, project=None)


class ProjectDeleteMutation(graphene.Mutation):
    ok = graphene.Boolean()

    class Arguments:
        pk = graphene.ID()

    @classmethod
    def mutate(cls, root, info, **kwargs):
        ok = False
        project = Projects.objects.get(pk=kwargs["pk"])   

        if project:
            ok = True
            project.delete()

        return ProjectDeleteMutation(ok=ok)


#######################################################################


class TodoCreateMutation(graphene.Mutation):
    class Arguments:
        comment = graphene.String()
        todo_is_completed = graphene.Boolean()
        user_id = graphene.Int()

    ok = graphene.Boolean()
    todo = graphene.Field(TodoObjectType)

    @classmethod
    def mutate(self, root, info, **kwargs):

        ok = True
        user = User.objects.get(pk=kwargs['user_id'])
        if user:
            todo_instans = ToDo(
                comment = kwargs['comment'],
                todo_is_completed = kwargs['todo_is_completed'], 
                user_id = kwargs['user_id']
            )
            todo_instans.save()
            return TodoCreateMutation(ok=ok, todo=todo_instans)
        return TodoCreateMutation(ok=False, todo=None)


class TodoUpdateMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.Int(required=True)
        comment = graphene.String(required=False)
        todo_is_completed = graphene.Boolean(required=False)
    
    todos = graphene.Field(TodoObjectType)

    @classmethod
    def mutate(self, root, info, pk, comment=None, todo_is_completed=None):
        
        todo = ToDo.objects.get(pk=pk)
        if todo:
            if comment:
                todo.comment = comment
            if todo_is_completed:
                todo.todo_is_completed = todo_is_completed
            if comment or todo_is_completed:
                todo.save()            

        return TodoUpdateMutation(todo)


class TodoDeleteMutation(graphene.Mutation):
    class Arguments:
        pk = graphene.ID()

    ok = graphene.Boolean()
    todos = graphene.Field(TodoObjectType)

    @classmethod
    def mutate(self, root, info, **kwargs):
        ok = False
        todo = ToDo.objects.get(pk=kwargs["pk"])

        if todo:
            ok = True
            todo.delete()

        return TodoDeleteMutation(ok=ok)


class Mutations(graphene.ObjectType):
    create_user = UserCreateMutation.Field()
    update_user = UserUpdateMutation.Field()
    delete_user = UserDeleteMutation.Field()
    create_project = ProjectCreateMutation.Field()
    update_project = ProjectUpdateMutation.Field()
    delete_project = ProjectDeleteMutation.Field()
    create_todo = TodoCreateMutation.Field()
    update_todo = TodoUpdateMutation.Field()
    delete_todo = TodoDeleteMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutations)
