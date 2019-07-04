import graphene

from models import db, User as UserModel
from .validation_error import ValidationError


def validate_user_creation(shortname):
    if not UserModel.query.filter(UserModel.shortname == shortname).first():
        return True


class User(graphene.ObjectType):
    shortname = graphene.String()


class CreateUser(graphene.Mutation):
    class Arguments:
        shortname = graphene.String()

    ok = graphene.Boolean()
    validation_error = graphene.Field(ValidationError)

    def mutate(self, info, shortname):
        if not validate_user_creation(shortname):
            return CreateUser(
                ok=False, validation_error=ValidationError(id=1, message='The username is already in use'))

        user = UserModel(shortname=shortname)
        db.session.add(user)
        db.session.commit()

        return CreateUser(ok=True, validation_error=None)
