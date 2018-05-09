from csv import DictReader


def read_file(filename):
    with open(filename, 'r') as file:
        reader = DictReader(file, delimiter=" ")
        return [line for line in reader]