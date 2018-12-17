import graphene


class FileFormat(graphene.Enum):
    FMU = 'FMU'
    CUSTOM = 'CUSTOM'
