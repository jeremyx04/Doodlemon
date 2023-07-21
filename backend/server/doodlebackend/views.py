import json
from django.http import HttpResponse, JsonResponse
import sys
from . import ml
from django.views.decorators.csrf import csrf_exempt
import base64
from PIL import Image
import io
import numpy as np

def index(request):
    return HttpResponse('Hello World')

def submitImage(request):
    if request.method != 'POST':
        return HttpResponse('Invalid request method, expected POST')
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)['body']
    data_url = body['drawing_url']
    media_type, encoding = data_url.split(';base64,')
    base64_decoded = base64.b64decode(encoding)
    image = Image.open(io.BytesIO(base64_decoded))
    drawing = np.array(image)
    reference_url = body['reference_url']
    similarity = ml.compute_similarity(drawing, reference_url)
    return JsonResponse({
            'status': 200,
            'message': 'Image submitted successfully.',
            'similarity': similarity
        })
