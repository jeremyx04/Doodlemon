import json
from django.http import HttpResponse, JsonResponse

def index(request):
    return JsonResponse({
        'test': 1
    })

def submitImage(request):
    if request.method != 'POST':
        return HttpResponse('Invalid request method, expected POST')
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    return JsonResponse({
        'url': body['body']['url'],
    })