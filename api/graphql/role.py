import graphene
from graphql import GraphQLError

from models import db, User as UserModel, Field as FieldModel, Role as RoleModel
from utils.authentication import is_fieldadmin

ROLES = ('admin', 'fieldadmin', 'creator', 'reader')


def validate_role_assignment(shortname, role, field):
    if not UserModel.query.filter(UserModel.shortname == shortname).first():
        return False
    if not FieldModel.query.filter(FieldModel.name == field).first():
        return False
    if role not in ROLES:
        return False
    return True


def validate_get_role(shortname):
    if UserModel.query.filter(UserModel.shortname == shortname).first():
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

    ok = graphene.Boolean()

    def mutate(self, info, user, role, field):
        auth_user = info.context.user

        if not is_fieldadmin(auth_user, field):
            raise GraphQLError('Unauthorized')

        if not validate_role_assignment(user, role, field):
            raise GraphQLError('The user or field does not exist, or the role is not a valid role')

        role_model = RoleModel.query.filter(RoleModel.user == user, RoleModel.field == field).first()
        if not role_model:
            role_model = RoleModel(user=user, field=field)
        role_model.role = role

        db.session.add(role_model)
        db.session.commit()
        return AssignRole(ok=True)


def resolve_role(self, info, user):
    auth_user = info.context.user
    if not validate_get_role(shortname=user):
        raise GraphQLError('The user does not exist')
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
