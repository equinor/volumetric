import graphene


class ValidationError(graphene.ObjectType):
    id = graphene.String()
    message = graphene.String()
