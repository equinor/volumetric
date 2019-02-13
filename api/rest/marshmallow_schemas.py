from app import marshmallow


class VolumetricSchema(marshmallow.ModelSchema):
    class Meta:
        fields = ('id', 'phase', 'bulk', 'net', 'porv', 'hcpv', 'stoiip', 'giip', 'associatedgas', 'associatedliquid',
                  'recoverable')


volumetric_schema = VolumetricSchema(strict=True)


class RealizationSchema(marshmallow.ModelSchema):
    class Meta:
        fields = ('id', 'realization', 'iteration', 'volumetrics')

    volumetrics = marshmallow.Nested(VolumetricSchema, many=True)


class LocationSchema(marshmallow.ModelSchema):
    class Meta:
        fields = ('id', 'region_name', 'zone_name', 'facies_name', 'license', 'realizations')

    realizations = marshmallow.Nested(RealizationSchema, many=True)


location_schema = LocationSchema(strict=True)


class CaseSchema(marshmallow.ModelSchema):
    class Meta:
        ordered = True
        fields = ('id', 'name', 'created_user', 'case_type', 'created_date', 'case_version', 'description',
                  'is_official', 'official_from_date', 'official_to_date', 'field_name', 'locations')

    locations = marshmallow.Nested(LocationSchema, many=True)


case_schema = CaseSchema(strict=True)
