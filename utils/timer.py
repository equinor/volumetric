import time


def timeit(timed_function):
    def timer(*args, **kwargs):
        time_before = time.time()
        readable = time.ctime(time_before)
        print(f"Timing function {timed_function.__name__}. Started on {readable}")
        result = timed_function(*args, **kwargs)
        elapsed = round((time.time() - time_before), 4)
        print(f"Function: {timed_function.__name__}")
        print(f"Arguments: [{args}, {kwargs}]")
        print(f"took: {elapsed}s")
        print()
        return result

    return timer
