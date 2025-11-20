import pandas as pd
import matplotlib.pyplot as plt
import re
from collections import Counter
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report
import joblib

url = "https://raw.githubusercontent.com/justmarkham/pycon-2016-tutorial/master/data/sms.tsv"
df = pd.read_csv(url, sep='\t', header=None, names=['etiqueta', 'mensaje'])

print("Datos cargados desde la URL. Primeras filas:")
print(df.head())

df['etiqueta'] = df['etiqueta'].replace({'ham': 0, 'spam': 1})

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[^a-z\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df['mensaje_limpio'] = df['mensaje'].apply(clean_text)

vectorizador = TfidfVectorizer(stop_words='english', max_features=1000)

X_texto = vectorizador.fit_transform(df['mensaje_limpio'])
y = df['etiqueta']

print(f"Matriz de texto (TF-IDF): {X_texto.shape}")

X_train, X_test, y_train, y_test = train_test_split(X_texto, y, test_size=0.2, random_state=42)

modelo_svm = LinearSVC()
modelo_svm.fit(X_train, y_train)
y_pred_svm = modelo_svm.predict(X_test)
print("\n===== SVM (LINEARSVC) =====")
print("Exactitud:", accuracy_score(y_test, y_pred_svm))

joblib.dump(vectorizador, 'tfidf_vectorizer.joblib')
joblib.dump(modelo_svm, 'spam_classifier_model.joblib')

print("\n--------------------------------------------------")
print("✅ Modelo y Vectorizador guardados correctamente.")
print("--------------------------------------------------")

