from behave import *
import json


def context_response_json(context, response):
    if response.status_code == 200 or response.status_code == 201:
        context.response_json = json.loads(response.data)


@given(u'i access the resource url "{url}"')
def step_impl(context, url):
    context.url = str(url)


def get_headers(context):
    header = {}
    # Add authentication?
    return header


@when(u'i make a "{method}" request')
def step_impl(context, method):
    data = {}
    if 'text' in context and context.text:
        context.request_json = json.loads(context.text)
        data = json.dumps(context.request_json)

    headers = get_headers(context)

    if method == 'PUT':
        context.response = context.client.put(
            context.url,
            data=data,
            content_type='application/json',
            headers=headers
        )
    elif method == 'POST':
        context.response = context.client.post(
            context.url,
            data=data,
            content_type='application/json',
            headers=headers
        )
    elif method == 'GET':
        context.response = context.client.get(
            context.url,
            content_type='application/json',
            headers=headers
        )
    elif method == 'DELETE':
        context.response = context.client.delete(
            context.url,
            content_type='application/json',
            headers=headers
        )

    context.response_status = context.response.status_code
    if context.response.content_type == 'application/json':
        context_response_json(context, context.response)
