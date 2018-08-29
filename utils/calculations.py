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
        # TODO: Handle 0 values
        percentile = np.percentile(data, p, interpolation='midpoint')
        return float(percentile)

    return get_pvalue


def get_mean(data):
    # TODO: Handle 0 values
    mean = np.mean(data)
    return float(mean)


def get_sum_means(volumetrics_by_location):
    # Input: A dictionary of location ID's. Each ID containing a list of volumetrics from that location.
    means_per_location = {}
    for location in volumetrics_by_location:
        means_per_location[location] = {
            metric_name: calculate(volumetrics_by_location[location], metric_name, get_mean)
            for metric_name in metric_list
        }

    total_mean = {metric_name: 0 for metric_name in metric_list}
    for location in means_per_location:
        total_mean = {
            metric_name: (total_mean[metric_name] + means_per_location[location][metric_name])
            for metric_name in metric_list
        }

    return {metric_name: total_mean[metric_name] for metric_name in metric_list}
