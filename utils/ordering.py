from functools import wraps
from natsort import natsorted, ns

import graphene


class OrderedList(graphene.List):
    def __init__(self, of_type, **kwargs):
        additional_kwargs = {
            'order_direction': graphene.String(),
        }
        if of_type != graphene.String:
            additional_kwargs['order_by'] = graphene.String()
        super().__init__(of_type, **additional_kwargs, **kwargs)


def sorting_func(items, order_direction, **kwargs):
    return natsorted(items, reverse=order_direction == 'desc', alg=ns.IGNORECASE, **kwargs)


def ordered_model(func):
    @wraps(func)
    def func_wrapper(self, info, order_by=None, order_direction='asc', **kwargs):
        items = func(self, info, **kwargs)
        if order_by is not None:
            items = sorting_func(items, order_direction=order_direction, key=lambda item: getattr(item, order_by))
        return items

    return func_wrapper


def ordered_strings(func):
    @wraps(func)
    def func_wrapper(self, info, order_direction='asc', **kwargs):
        items = func(self, info, **kwargs)
        items = sorting_func(items, order_direction=order_direction)

        return items

    return func_wrapper
