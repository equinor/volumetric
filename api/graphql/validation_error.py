import graphene


class ValidationError(graphene.ObjectType):
    id = graphene.String()
    message = graphene.String()


class ValidationField(graphene.ObjectType):
    valid = graphene.Boolean()
    message = graphene.String()
