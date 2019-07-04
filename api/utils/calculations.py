import numpy as np

# Order matters
METRICS = ('bulk', 'net', 'porv', 'hcpv', 'stoiip', 'giip', 'associatedgas', 'associatedliquid', 'recoverable')


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
