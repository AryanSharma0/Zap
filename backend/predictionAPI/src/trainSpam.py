import pandas as pd
from sklearn.preprocessing import LabelEncoder
from src.preprocessing import transform_text
from wordcloud import WordCloud
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix, precision_score
import tensorflow as tf
from src.model import create_model

def trainSpam():
    df = pd.read_csv("spam.csv", encoding='latin-1')
    df.drop(columns=['Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4'], inplace=True)
    df.rename(columns={'v1': 'target', 'v2': 'text'}, inplace=True)
    encoder = LabelEncoder()
    df['target'] = encoder.fit_transform(df['target'])
    df = df.drop_duplicates(keep='first')
    df['transformed_text'] = df['text'].apply(transform_text)

    wc = WordCloud(width=500, height=500, min_font_size=10, background_color='white')
    spam_wc = wc.generate(df[df['target'] == 1]['transformed_text'].str.cat(sep=" "))
    ham_wc = wc.generate(df[df['target'] == 0]['transformed_text'].str.cat(sep=" "))

    X = df['transformed_text'].values
    y = df['target'].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=2)

    model = create_model(embedding_dim=16, lstm_units=20, num_classes=2)  # Assuming 2 classes for spam and non-spam
    model.compile(
        loss='sparse_categorical_crossentropy',
        optimizer='adam',
        metrics=['accuracy']
    )
    model.summary()  # Display model summary before training

    # Preprocess text sequences into fixed-length sequences of 50 time steps (pad or truncate as needed)
    tokenizer = tf.keras.preprocessing.text.Tokenizer()
    tokenizer.fit_on_texts(X_train)
    X_train = tokenizer.texts_to_sequences(X_train)
    X_test = tokenizer.texts_to_sequences(X_test)
    X_train = tf.keras.preprocessing.sequence.pad_sequences(X_train, maxlen=50, padding='post')
    X_test = tf.keras.preprocessing.sequence.pad_sequences(X_test, maxlen=50, padding='post')

    model.fit(X_train, y_train, epochs=20, batch_size=32, validation_split=0.2)

    y_pred = model.predict(X_test)
    y_pred_labels = tf.argmax(y_pred, axis=1)

    print("Accuracy:", accuracy_score(y_test, y_pred_labels))
    print("Confusion Matrix:")
    print(confusion_matrix(y_test, y_pred_labels))
    print("Precision Score:", precision_score(y_test, y_pred_labels))
    return model,tokenizer
