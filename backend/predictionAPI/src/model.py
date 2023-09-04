import tensorflow as tf
import numpy as np

def create_model(embedding_dim=16, lstm_units=20, num_classes=6):
    model = tf.keras.models.Sequential([
        tf.keras.layers.Embedding(10000, embedding_dim, input_length=50),
        tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(lstm_units, return_sequences=True)),
        tf.keras.layers.Bidirectional(tf.keras.layers.LSTM(lstm_units)),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])

    model.compile(
        loss='sparse_categorical_crossentropy',
        optimizer='adam',
        metrics=['accuracy']
    )

    return model

def train_model(model, train_sequences, train_labels, val_sequences, val_labels, epochs=50):
    model.summary()
    history = model.fit(
        train_sequences, train_labels,
        validation_data=(val_sequences, val_labels),
        epochs=epochs,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(monitor='val_accuracy', patience=2)
        ]
    )
    return history

def evaluate_model(model, test_sequences, test_labels):
    return model.evaluate(test_sequences, test_labels)

