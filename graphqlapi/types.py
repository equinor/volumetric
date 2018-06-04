import graphene


class VolumetricType(graphene.ObjectType):
    id = graphene.Int()
    location_id = graphene.Int()
    realization = graphene.Int()
    grv = graphene.Float()
    nrv = graphene.Float()
    npv = graphene.Float()
    hcpv = graphene.Float()
    stoiip = graphene.Float()


class LocationType(graphene.ObjectType):
    id = graphene.ID()
    faultblock_id = graphene.ID()
    zone_id = graphene.ID()
    facies = graphene.String()
    volumetrics = graphene.List(VolumetricType)


class FaultblockType(graphene.ObjectType):
    id = graphene.Int()
    model_id = graphene.Int()
    name = graphene.String()
    locations = graphene.List(LocationType)


class ZoneType(graphene.ObjectType):
    id = graphene.ID()
    name = graphene.String()
    model_id = graphene.Int()
    locations = graphene.List(LocationType)


class ModelType(graphene.ObjectType):
    name = graphene.String()
    id = graphene.Int()
    user = graphene.String()
    field_id = graphene.Int()
    faultblocks = graphene.List(FaultblockType)
    zones = graphene.List(ZoneType)


class FieldType(graphene.ObjectType):
    id = graphene.ID()
    name = graphene.String()
    models = graphene.List(ModelType)
