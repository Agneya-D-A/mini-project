from flask import Flask, request, jsonify
from io import BytesIO
import numpy as np
import tensorflow as tf
from PIL import Image
import os
import requests

app = Flask(__name__)

# Load your TensorFlow model here
model = tf.keras.models.load_model("src/backend/model/u_net_model_1.keras")
print("Model input shape:", model.input_shape)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the image file path from the request
        data = request.json
        imagePath = data['imagePath']

        
        original_image = Image.open(imagePath).resize((256, 256))
        original_image_np = np.array(original_image)

        input_image = original_image.resize((128, 128))
        input_image_np = np.array(input_image) / 255.0  # Normalize to [0, 1]
        input_image_np = np.expand_dims(input_image_np, axis=0)  # Add batch dimension

        predictions = model.predict(input_image_np)
        predicted_mask = (predictions[0].squeeze() > 0.5).astype(np.uint8) * 255

        # Resize the predicted mask back to 256x256 for visualization
        predicted_mask_resized = Image.fromarray(predicted_mask).resize((256, 256))
        predicted_mask_resized_np = np.array(predicted_mask_resized)

         # Save the mask to a file
        mask_path = "static/mask.png"
        os.makedirs(os.path.dirname(mask_path), exist_ok=True)
        predicted_mask_resized.save(mask_path)

        # Step 5: Send mask path to Node.js server
        # node_server_url = "http://localhost:3000/receive-mask"  # Replace with your Node.js server endpoint
        # payload = {"maskPath": os.path.abspath(mask_path)}
        # response = requests.post(node_server_url, json=payload)

        
        return jsonify({"message": "Prediction successful", "maskPath": mask_path})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({'message': 'Error during prediction', 'error': str(e)}), 500


app.run(debug=True, port=5000)
