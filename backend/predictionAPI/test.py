import pickle
import os
print(os.getcwd())
filenamelst_abspathname = os.path.abspath('vectorizer.pkl')
a=open('vectorizer.pkl','rb')

print(a)
try:
    # tfidf = pickle.load(, 'rb'))
    model = pickle.load(open('model.pkl', 'rb'))
except FileNotFoundError as e:
    print("Error: File not found -", e)
except pickle.UnpicklingError as e:
    print("Error: Unpickling failed -", e)
