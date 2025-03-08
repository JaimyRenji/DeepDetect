# fine_tune.py
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.losses import BinaryCrossentropy
from sklearn.metrics import f1_score, accuracy_score

# Load the pre-trained model
model = load_model('cnn_model.h5')

# Freeze some layers (optional)
for layer in model.layers[:-5]:
    layer.trainable = False

# Compile the model
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
    loss=tf.keras.losses.BinaryCrossentropy(from_logits=True),
    metrics=['accuracy']
)

# Prepare your dataset
train_datagen = ImageDataGenerator(rescale=1./255)
validation_datagen = ImageDataGenerator(rescale=1./255)

train_generator = train_datagen.flow_from_directory(
    './dataset/train',
    target_size=(128, 128),
    batch_size=32,
    class_mode='binary'
)

validation_generator = validation_datagen.flow_from_directory(
    './dataset/validation',
    target_size=(128, 128),
    batch_size=32,
    class_mode='binary'
)

# Fine-tune the model
history = model.fit(
    train_generator,
    epochs=10,
    validation_data=validation_generator
)

# Predict on validation set to calculate metrics
validation_pred = model.predict(validation_generator)
validation_pred_class = (validation_pred > 0.5).astype("int32")
validation_labels = validation_generator.classes

f1 = f1_score(validation_labels, validation_pred_class)
accuracy = accuracy_score(validation_labels, validation_pred_class)

print(f"Validation F1 Score: {f1:.4f}")
print(f"Validation Accuracy: {accuracy:.4f}")

# Save the fine-tuned model
model.save('fine_tuned_model.h5')
