import graphene
from graphql import GraphQLError

from models import db, User as UserModel, Field as FieldModel, Role as RoleModel
from utils.authentication import is_fieldadmin
from utils.db import get_or_create

ROLES = ('admin', 'fieldadmin', 'creator', 'reader')


def validate_role_assignment(role, field):
    if not FieldModel.query.filter(FieldModel.name == field).first():
        return False
    if role not in ROLES:
        return False
    return True


class Role(graphene.ObjectType):
    user = graphene.String()
    field = graphene.String()
    role = graphene.String()


class AssignRole(graphene.Mutation):
    class Arguments:
        user = graphene.String()
        role = graphene.String()
        field = graphene.String()

    Output = Role

    def mutate(self, info, user, role, field):
        auth_user = info.context.user

        if not is_fieldadmin(auth_user, field):
            raise GraphQLError('Unauthorized')

        get_or_create(db.session, UserModel, defaults=None, shortname=user)

        if not validate_role_assignment(role, field):
            raise GraphQLError('The field does not exist, or the role is not a valid role')

        role_model = RoleModel.query.filter(RoleModel.user == user, RoleModel.field == field).first()
        if not role_model:
            role_model = RoleModel(user=user, field=field)
        role_model.role = role

        db.session.add(role_model)
        db.session.commit()
        return Role(user=user, field=field, role=role)


class DeleteRole(graphene.Mutation):
    class Arguments:
        user = graphene.String()
        field = graphene.String()

    Output = Role

    def mutate(self, info, user, field):
        auth_user = info.context.user

        if not is_fieldadmin(auth_user, field):
            raise GraphQLError('Unauthorized')

        role_model = RoleModel.query.filter(RoleModel.user == user, RoleModel.field == field).first()
        if not role_model:
            return DeleteRole(ok=True, role=Role(user=user, field=field))

        db.session.delete(role_model)
        db.session.commit()
        return Role(user=user, field=field)


def resolve_role_by_user(self, info, user):
    auth_user = info.context.user

    get_or_create(db.session, UserModel, defaults=None, shortname=user)
    roles = RoleModel.query.filter(RoleModel.user == user).all()

    if user == auth_user.shortname:
        return roles

    # Only fieldadmins can see roles of other users, but only within the field.
    reduced_roles = []
    for role in roles:
        if not is_fieldadmin(auth_user, role.field):
            continue
        reduced_roles.append(role)

    return reduced_roles


def resolve_role_by_field(self, info, field):
    user = info.context.user
    if not is_fieldadmin(user, field):
        raise GraphQLError('Unauthorized')

    return RoleModel.query.filter(RoleModel.field == field).all()
