import tensorflow as tf
import tensorflow_hub as hub

m = tf.keras.Sequential([
    hub.KerasLayer("https://tfhub.dev/google/imagenet/mobilenet_v2_035_96/feature_vector/5",
                   trainable=False),  # Can be True, see below.
    tf.keras.layers.Dense(100, activation='softmax')
])
m.build([None, 96, 96, 3])  # Batch input shape.

print(m)