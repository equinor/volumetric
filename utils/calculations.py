import numpy as np

METRICS = ('stoiip', 'bulk', 'net', 'porv', 'hcpv', 'giip', 'associatedgas', 'associatedliquid', 'recoverable')


def calculate(volumetrics, metric_name, calculation_function):
    dataset = []
    for volumetric in volumetrics:
        metric = getattr(volumetric, metric_name)
        if metric is None:
            return None
        dataset.append(float(metric))

    if not dataset:
        return 0

    return calculation_function(dataset)


def get_pvalue_func(p):
    def get_pvalue(data):
        percentile = np.percentile(data, p, interpolation='midpoint')
        return float(percentile)

    return get_pvalue


def get_mean(data):
    mean = np.mean(data)
    return float(mean)


def _get_metric_value(volumetric, key):
    metric = getattr(volumetric, key)
    return metric if metric is not None else 0


def sum_volumetrics(volumetrics):
    volumetrics_by_realization = {}
    volumetric_key_list = METRICS + ('realization', )

    for volumetric in volumetrics:
        if volumetric.realization.realization not in volumetrics_by_realization:
            volumetrics_by_realization.update({
                volumetric.realization.realization:
                {key: _get_metric_value(volumetric, key)
                 for key in volumetric_key_list}
            })
        else:
            volumetrics_by_realization[volumetric.realization.realization].update({
                key: sum([
                    _get_metric_value(volumetric, key),
                    volumetrics_by_realization[volumetric.realization.realization][key]
                ])
                for key in METRICS
            })

    for realization in volumetrics_by_realization:
        volumetrics_by_realization[realization].update({'id': realization})

    return volumetrics_by_realization
