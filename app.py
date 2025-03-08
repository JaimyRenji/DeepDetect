# app.py
from flask import Flask, request, jsonify
import tensorflow as tf 
from tensorflow import keras
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load your model
model = load_model('fine_tuned_model.h5')

print(model.summary())
# Load metrics from fine-tuning (you can save these in a file or database)
# For simplicity, let's assume you have them saved in variables
f1_score_val = 0.85  # Replace with actual F1 score from fine-tuning
accuracy_val = 0.90  # Replace with actual accuracy from fine-tuning

@app.route('/predict', methods=['POST'])  
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    img = Image.open(io.BytesIO(image_file.read()))
    img = img.resize((128, 128))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    result = "Real" if prediction[0][0] < 0.5 else "Fake"

    return jsonify({
        "prediction": result,
        "f1_score": f1_score_val,
        "accuracy": accuracy_val
    })

if __name__ == '__main__':
    app.run(debug=True)
