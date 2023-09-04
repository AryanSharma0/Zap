import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from heapq import nlargest

nltk.download("punkt")
nltk.download("stopwords")

def summarize_text(text): 
    
    stop_words = set(stopwords.words("english"))
    word_tokens = word_tokenize(text)
    
    word_frequencies = {}
    for word in word_tokens:
        if word.lower() not in stop_words:
            if word.isalnum():  # Consider only alphanumeric words
                if word not in word_frequencies.keys():
                    word_frequencies[word] = 1
                else:
                    word_frequencies[word] += 1

    max_frequency = max(word_frequencies.values())
    for word in word_frequencies.keys():
        word_frequencies[word] = word_frequencies[word] / max_frequency

    sentence_tokens = sent_tokenize(text)
    sentence_score = {}
    for sent in sentence_tokens:
        for word in word_tokenize(sent):
            if word.lower() in word_frequencies.keys():
                if sent not in sentence_score.keys():
                    sentence_score[sent] = word_frequencies[word.lower()]
                else:
                    sentence_score[sent] += word_frequencies[word.lower()]

    select_length = int(len(sentence_tokens) * 0.5)
    summary = nlargest(select_length, sentence_score, key=sentence_score.get)
    return summary