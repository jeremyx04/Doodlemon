import cv2
import numpy as np
import tensorflow as tf
import tensorflow_hub as hub
import requests
import random
import os
import math

m = tf.keras.Sequential([
    hub.KerasLayer("https://tfhub.dev/google/imagenet/mobilenet_v3_large_100_224/feature_vector/5",
                   trainable=False),  # Can be True, see below.
    tf.keras.layers.Dense(100, activation='softmax')
])
m.build([None, 224, 224, 3])  # Batch input shape.

def url_to_buf(url):
    res = requests.get(url)
    if res.status_code != 200:
        return
    return res.content

def buf_to_image(buf):
    img_array = np.frombuffer(buf, dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_GRAYSCALE)
    return img

def process_features(img):
    img = tf.io.read_file(img)
    img = tf.io.decode_jpeg(img,channels=3)
    img = tf.image.resize_with_pad(img, 224, 224)
    img = tf.image.convert_image_dtype(img,tf.float32)[tf.newaxis, ...] / 255.0
    features = m(img)
    feature_set = np.squeeze(features)
    return list(feature_set)

def cosine_similarity(a, b):
    dot = 0
    mag_a = 0
    mag_b = 0
    for i,j in zip(a,b):
        dot += i*j
        mag_a += i*i
        mag_b += j*j
    mag_a = math.sqrt(mag_a)
    mag_b = math.sqrt(mag_b)
    return dot / (mag_a * mag_b)
        
def compute_similarity(drawing, reference_url):
    reference = buf_to_image(url_to_buf(reference_url))
    rand_key = str(random.randint(1,10000))

    drawing_path = 'drawing_' + rand_key + '.png'
    reference_path = 'reference_' + rand_key + '.png'

    threshold_low, threshold_high = 150, 200

    drawing_edges = cv2.Canny(drawing, threshold_low, threshold_high)
    drawing = cv2.bitwise_not(drawing_edges)

    reference_edges = cv2.Canny(reference, threshold_low, threshold_high)
    reference = cv2.bitwise_not(reference_edges)
    
    try:
        cv2.imwrite(drawing_path,drawing)
        cv2.imwrite(reference_path,reference)
    except Exception as e:
        print(e)

    drawing_features = process_features(drawing_path)
    reference_features = process_features(reference_path)

    os.remove(drawing_path)
    os.remove(reference_path)
    
    return cosine_similarity(drawing_features,reference_features)
