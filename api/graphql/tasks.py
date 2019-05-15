from datetime import datetime, timedelta

import graphene
from graphql import GraphQLError
from sqlalchemy import desc

from models import Task as TaskModel


class Task(graphene.ObjectType):
    id = graphene.String()
    user = graphene.String()
    case_name = graphene.String()
    queued_at = graphene.DateTime()
    complete = graphene.Boolean()
    failed = graphene.Boolean()
    message = graphene.String()


def resolve_tasks(self, info, user, hours=None):
    auth_user = info.context.user

    # Return only personal data if user is not administrator
    if not auth_user.isAdmin and auth_user.shortname != user:
        raise GraphQLError('You are not authorized to view this data.')

    tasks_query = TaskModel.query.filter(TaskModel.user == user).order_by(desc(TaskModel.queued_at))

    if hours is not None:
        tasks_query = tasks_query.filter(TaskModel.queued_at >= (datetime.now() - timedelta(hours=hours)))

    return tasks_query.all()
