import numpy as np


def get_pvalue_func(p):
    def get_pvalue(data):
        # TODO: Handle 0 values
        percentile = np.percentile(data, p, interpolation='midpoint')
        return "{:.2f}".format(percentile)

    return get_pvalue


def get_mean(data):
    # TODO: Handle 0 values
    mean = np.mean(data)
    return "{:.2f}".format(mean)
