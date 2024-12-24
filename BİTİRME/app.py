from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import base64

app = Flask(__name__)
CORS(app)

# Modeli yükle
model = tf.keras.models.load_model('C:/Users/Monster/OneDrive/Masaüstü/BİTİRME/actions.h5')

# Tahmin için örnek giriş (sadece modelin giriş gereksinimlerini kontrol etmek için)
test_input = np.random.rand(1, 30, 1662)  # Beklenen giriş formatı (1, 30, 1662)

# Tahmin örneği
prediction = model.predict(test_input)
print(prediction)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Base64 veriyi al ve decode et
        data_url = request.data.decode('utf-8')
        image_data = base64.b64decode(data_url.split(',')[1])

        # Görüntüyü işle
        image = Image.open(io.BytesIO(image_data))
        image = image.convert('L')  # Grayscale (tek kanallı)
        image = image.resize((1662, 30))  # Modelin beklediği boyut
        image = np.array(image) / 255.0  # Normalizasyon
        image = np.expand_dims(image, axis=0)  # (1, 30, 1662)

        # Tahmin yap
        prediction = model.predict(image)  # Modelin tüm tahminlerini al
        actions = ['var', 'yok', 'bakmak', 'olmak', 'baslamak', 'bilmek', 'dogru', 'yanlis', 'dinlemek']

        # En yüksek olasılığa sahip kelimeyi bulun
        predicted_index = np.argmax(prediction[0])
        predicted_action = actions[predicted_index]

        # Tahmin edilen kelimeyi döndür
        return jsonify({'prediction': predicted_action})

    except Exception as e:
        return jsonify({'error': str(e)})

@app.route('/')
def home():
    return send_file('translate.html')

if __name__ == '__main__':
    app.run(debug=True)
