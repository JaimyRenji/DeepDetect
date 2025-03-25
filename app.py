from flask import Flask, request, jsonify
import tensorflow as tf
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
from PIL import Image
import io
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the fine-tuned model
model = load_model('fine_tuned_model.h5')

# Fine-tuning metrics (replace with actual values)
f1_score_val = 0.85  
accuracy_val = 0.90  

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    # Read and preprocess the image
    image_file = request.files['image']
    img = Image.open(io.BytesIO(image_file.read()))
    img = img.resize((128, 128))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    # Model prediction
    prediction = model.predict(img_array)
    prediction_score = float(prediction[0][0])  # Convert to float for JSON serialization
    result = "Real" if prediction_score < 0.5 else "Fake"

    return jsonify({
        "prediction": result,
        "prediction_score": prediction_score,  # Rounded for better readability
        "f1_score": f1_score_val,
        "accuracy": accuracy_val
    })

if __name__ == '__main__':
    app.run(debug=True)
