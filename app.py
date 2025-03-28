from flask import Flask, request, jsonify, send_file
import tensorflow as tf
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
from PIL import Image
import io
from flask_cors import CORS
import cv2
import subprocess

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

model = load_model('fine_tuned_model.h5')

f1_score_val = 0.85
accuracy_val = 0.90

# Function to run detector2.py and capture bounding box output
def run_detector2(image_path):
    try:
        result = subprocess.run(['python', 'detector2.py'], input=f"{image_path}", capture_output=True, text=True, shell=True)
        output = result.stdout

        bounding_box_line = next(line for line in output.splitlines() if "Bounding Box:" in line)
        bounding_box_str = bounding_box_line.split(':')[-1].strip()
        x = int(bounding_box_str.split('x=')[-1].split(',')[0])
        y = int(bounding_box_str.split('y=')[-1].split(',')[0])
        width = int(bounding_box_str.split('width=')[-1].split(',')[0])
        height = int(bounding_box_str.split('height=')[-1].split(',')[0])

        return x, y, width, height

    except Exception as e:
        print(f"Error running detector2.py: {e}")
        return 0, 0, 0, 0

# Function to draw bounding box
def draw_bounding_box(image_path, x, y, width, height):
    img = cv2.imread(image_path)
    if width > 0 and height > 0:
        cv2.rectangle(img, (x, y), (x + width, y + height), (0, 255, 0), 2)  # Green box
    output_path = "output_image.jpg"
    cv2.imwrite(output_path, img)
    return output_path

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image_file = request.files['image']
    image_path = "temp_image.jpg"
    image_file.save(image_path)

    img = Image.open(image_path)
    img = img.resize((128, 128))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    prediction_score = float(prediction[0][0])
    result = "Real" if prediction_score < 0.5 else "Fake"

    x, y, width, height = run_detector2(image_path)

    output_path = draw_bounding_box(image_path, x, y, width, height)

    return jsonify({
        "prediction": result,
        "prediction_score": prediction_score,
        "f1_score": f1_score_val,
        "accuracy": accuracy_val,
        "bounding_box": {
            "x": x,
            "y": y,
            "width": width,
            "height": height
        },
        "output_image": "/output_image"
    })

@app.route('/output_image', methods=['GET'])
def get_output_image():
    return send_file("output_image.jpg", mimetype="image/jpeg")

if __name__ == '__main__':
    app.run(debug=True)
