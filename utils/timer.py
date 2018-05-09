import time


def timeit(timed_function):
    def timer(*args, **kwargs):
        time_before = time.time()
        result = timed_function(*args, **kwargs)
        elapsed = round((time.time() - time_before), 2)
        print("Function: {function} Arguments: [{args}, {kwargs}] took: {elapsed}s".format(
            function=timed_function.__name__, args=args, kwargs=kwargs, elapsed=elapsed))
        return result

    return timer
