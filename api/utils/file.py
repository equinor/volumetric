from csv import DictReader


def read_file(filename, delimiter=" "):
    content_list = filename.content.splitlines()
    content_list[0] = content_list[0].lower()
    reader = DictReader(content_list, delimiter=delimiter)
    return [line for line in reader]
