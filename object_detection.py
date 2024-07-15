import sys
import base64
import numpy as np
import cv2

def preprocess_image(base64_image):
    # Remove the header from the base64 string
    base64_image = base64_image.split(',')[1]
    # Decode base64 image
    image_data = base64.b64decode(base64_image)
    # Convert bytes to numpy array
    nparr = np.frombuffer(image_data, np.uint8)
    # Decode image
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    # Resize image if needed (e.g., MobileNet expects 224x224 images)
    resized_image = cv2.resize(image, (224, 224))
    # Normalize image
    normalized_image = resized_image / 255.0
    # Expand dimensions to match the input shape of the model
    expanded_image = np.expand_dims(normalized_image, axis=0)
    return expanded_image

def detect_gender(base64_image):
    # Simulate gender detection logic
    # Here, we randomly determine gender for demonstration purposes
    gender = 'Male' if np.random.rand() >= 0.5 else 'Female'
    return f"Gender detected: {gender}"

if __name__ == "__main__":
    try:
        json_data = sys.stdin.read().strip()
        data = json.loads(json_data)
        base64_image = data.get('base64Image', '')
        if not base64_image:
            raise ValueError("Base64 image data not found in JSON input")

        preprocessed_image = preprocess_image(base64_image)
        result = detect_gender(preprocessed_image)
        print(result)
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        sys.exit(1)
