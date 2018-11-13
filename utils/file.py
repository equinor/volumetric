import itertools
from csv import DictReader


def lower_first(iterator):
    return itertools.chain([next(iterator).lower()], iterator)


def read_file(filename, delimiter=" "):
    with open(filename, 'r') as file:
        reader = DictReader(lower_first(file), delimiter=delimiter)
        return [line for line in reader]
