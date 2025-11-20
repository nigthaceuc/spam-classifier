from flask import Flask, request, jsonify
import joblib
import re

app = Flask(__name__)

# --- CONFIGURACIÓN Y CARGA ---
try:
    # Asegúrate de que estos archivos estén en la misma carpeta que este script
    vectorizer = joblib.load('tfidf_vectorizer.joblib')
    model = joblib.load('spam_classifier_model.joblib')
    print("AI Modelos cargados correctamente.")
except Exception as e:
    print(f"Error al cargar el modelo o vectorizador: {e}")
    exit()

# --- FUNCIÓN DE LIMPIEZA ---
# DEBE SER IDÉNTICA A LA USADA EN EL ENTRENAMIENTO
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    # Elimina todo lo que no sean letras minúsculas o espacios
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# --- ENDPOINT REST ---
@app.route('/classify_spam', methods=['POST'])
def classify_spam():
    # 1. Obtener los datos del cuerpo (esperamos un JSON: {"message": "texto aqui"})
    data = request.get_json(silent=True)
    if not data or 'message' not in data:
        return jsonify({"error": "Formato de solicitud inválido. Se espera {'message': 'texto'}"}), 400

    message_text = data['message']

    # 2. Pre-procesamiento: Limpiar el mensaje
    cleaned_message = clean_text(message_text)

    # 3. Vectorización: Transformar el mensaje
    # ¡Importante! Usar .transform(), NUNCA .fit_transform()
    message_vector = vectorizer.transform([cleaned_message])

    # 4. Predicción
    # El modelo devuelve [0] o [1]
    prediction = model.predict(message_vector)[0]
    
    # 5. Formatear la respuesta
    is_spam = bool(prediction)
    
    response = {
        "message": message_text,
        "isSpam": is_spam,  # Usamos camelCase para la respuesta JSON a Java
        "label": "spam" if is_spam else "ham"
    }

    return jsonify(response)

# --- EJECUCIÓN DEL SERVIDOR ---
if __name__ == '__main__':
    # Ejecuta el servidor en el puerto 5000 (Asegúrate que no esté ocupado)
    print("Iniciando servidor de clasificación de spam en http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
