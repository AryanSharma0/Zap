import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
from src.datasets import load_combined_datasets
from src.preprocessing import get_sequences, names_to_ids,transform_text
from src.model import create_model, train_model, evaluate_model

from src.plot import show_history,show_confusion_matrix


def trainEmotion():
    # Load and prepare datasets
    dataset = load_combined_datasets()

    train = dataset['train']
    val = dataset['validation']
    test = dataset['test']

    # Assuming you have the function get_tweets() implemented in datasets.py
    def get_tweets(data):
        tweets = [x['text'] for x in data]
        labels = [x['label_text'] for x in data]
        return tweets, labels 

    tweets, labels = get_tweets(train)
    # ...

    # Create tokenizer and tokenize the data
    tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=10000, oov_token='<OOV>')
    tokenizer.fit_on_texts(tweets)
    # ...

    tweets_train, train_labels = get_tweets(train)
    tweets_val, val_labels = get_tweets(val)
    tweets_test, test_labels = get_tweets(test)
    # Prepare sequences and labels



    classes = set(labels)
    print(classes)

    # plt.hist(labels, bins=11)
    # plt.show()


    classes_to_index = dict((c, i) for i, c in enumerate(classes))
    index_to_classes = dict((v, k) for k, v in classes_to_index.items())

    names_to_ids = lambda labels: np.array([classes_to_index.get(x) for x in labels])

    # Getting sequence
    train_sequences = get_sequences(tokenizer, tweets_train)
    val_sequences = get_sequences(tokenizer, tweets_val)
    test_sequences = get_sequences(tokenizer, tweets_test)

    # Getting name to ids according to class value
    train_labels = names_to_ids(labels)
    val_labels = names_to_ids(val_labels)
    test_labels = names_to_ids(test_labels)

    # Create the model
    model = create_model()
    # ...

    model.summary()

    # Train the model
    history = train_model(model, train_sequences, train_labels, val_sequences, val_labels)

    # Plot the training and validation accuracy over epochs
    # show_history(history)

    # Evaluate the model on the test data
    test_loss, test_accuracy = evaluate_model(model, test_sequences, test_labels)

    test_predictions = model.predict(test_sequences)
    predicted_labels = np.argmax(test_predictions, axis=1)
    true_labels = test_labels

    classes = ["sadness", "joy", "love", "anger", "fear", "surprise"]

    # Compute and display confusion matrix
    show_confusion_matrix(true_labels, predicted_labels, classes)
    return model, tokenizer