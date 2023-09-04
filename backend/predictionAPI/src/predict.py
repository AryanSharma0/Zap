import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences

def predict_emotion(model, tokenizer, custom_text):
    # Tokenize the custom text
    custom_tokens = tokenizer.texts_to_sequences([custom_text])
    
    # Pad the sequence
    custom_padded_sequences = pad_sequences(custom_tokens, truncating='post', maxlen=50, padding='post')
    
    # Make predictions
    predictions = model.predict(custom_padded_sequences)
    
    # Get the predicted class index (the class with the highest probability)
    predicted_class_index = np.argmax(predictions[0])
    
    return predicted_class_index
def predict_spam(text, model, tokenizer):
    # Preprocess the text and convert it into a sequence
    text_sequence = tokenizer.texts_to_sequences([text])
    text_sequence = pad_sequences(text_sequence, maxlen=50, padding='post')

    # Make predictions
    prediction = model.predict(text_sequence)
    predicted_class = np.argmax(prediction[0])  # Get the predicted class (0 or 1)
    return predicted_class
