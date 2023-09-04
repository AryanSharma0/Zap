import uvicorn  # For initializing  ASGI (Asynchronous Server Gateway Interface) used by FastApi
# uvicorn main:app --reload
import pickle
from fastapi import FastAPI
from src.trainEmotion import trainEmotion
from src.trainSpam import trainSpam
from src.predict import predict_emotion,predict_spam
from src.summarisaion import summarize_text
from src.preprocessing import transform_text
import nltk
import tensorflow as tf

app = FastAPI(
    title="Sentiment Model API",
    description="An API that use NLP model to predict the sentiment of the chats",
    version="0.1",
) 
nltk.download('punkt')
# Training Emotion Modal
model, tokenizer = trainEmotion()

# Training spam Modal 
model2=trainSpam()

with open('vectorizer.pkl', 'rb') as file:
    tfidf = pickle.load(file)
# Route 1: Make predictions on custom text using API call

@app.get("/predictEmotion")
async def predictEmotion(request: str):
 
    custom_text = request
    # Get the predicted emotion index
    predicted_emotion_index = predict_emotion(model, tokenizer, custom_text)    
    print(custom_text)
    # Assuming you have a label mapping similar to the one mentioned earlier
    label_mapping = {
        0: "sadness",
        1: "joy", 
        2: "love",
        3: "anger",
        4: "fear",
        5: "surprise"
    }

    # Convert the predicted emotion index to the corresponding label
    predicted_emotion = label_mapping[predicted_emotion_index]

    return predicted_emotion

@app.get("/summarize")
async def summarize(passage: str):
    return summarize_text(passage)



@app.get("/spam")
async def spam(message: str):

    predicted_class = predict_spam(message, model, tokenizer)
    if predicted_class == 1:
        return True
    else:
        return False

if __name__=='__main__':
    uvicorn.run("api:app", host='http://192.168.89.86', port=8000)   