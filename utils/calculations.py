import numpy as np
metric_list = ['stoiip', 'grv', 'nrv', 'npv', 'hcpv']


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


def sum_volumetrics(volumetrics):
    volumetrics_by_realization = {}
    volumetric_key_list = tuple(metric_list)
    volumetric_key_list = volumetric_key_list + ('realization',)

    for volumetric in volumetrics:
        if volumetric.realization not in volumetrics_by_realization:
            volumetrics_by_realization.update({
                volumetric.realization: {key: getattr(volumetric, key)
                                         for key in volumetric_key_list}
            })
            continue

        volumetrics_by_realization[volumetric.realization].update({
                key: sum([getattr(volumetric, key), volumetrics_by_realization[volumetric.realization][key]])
                for key in metric_list
            })

    for realization in volumetrics_by_realization:
        volumetrics_by_realization[realization].update({'id': realization})

    return volumetrics_by_realization
