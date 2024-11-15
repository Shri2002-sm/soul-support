import streamlit as st
import json
import numpy as np
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import speech_recognition as sr
import os

# Load the intent data
with open('interview1.json') as file:
    data = json.load(file)

# Prepare the training data
training_sentences = []
training_labels = []
labels = []
responses = []

for intent in data['intents']:
    for pattern in intent['patterns']:
        training_sentences.append(pattern)
        training_labels.append(intent['tag'])
    responses.append(intent['responses'])

    if intent['tag'] not in labels:
        labels.append(intent['tag'])

# Encode the labels
enc = LabelEncoder()
enc.fit(training_labels)
training_labels = enc.transform(training_labels)

# Tokenization and padding
vocab_size = 10000
embedding_dim = 16
max_len = 20
trunc_type = 'post'
oov_token = "<OOV>"

tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_token)
tokenizer.fit_on_texts(training_sentences)
sequences = tokenizer.texts_to_sequences(training_sentences)
padded = pad_sequences(sequences, truncating=trunc_type, maxlen=max_len)

# Function to create and train the model
def create_model():
    classes = len(labels)
    model = tf.keras.models.Sequential([
        keras.layers.Embedding(vocab_size, embedding_dim, input_length=max_len),
        keras.layers.GlobalAveragePooling1D(),
        keras.layers.Dense(16, activation='relu'),
        keras.layers.Dense(16, activation='relu'),
        keras.layers.Dense(classes, activation='softmax')
    ])

    model.compile(loss='sparse_categorical_crossentropy', optimizer='adam', metrics=['accuracy'])
    return model

# Try to load the model, create a new one if it fails
try:
    model = tf.keras.models.load_model('mental_health_assistant_model.h5')
except:
    print("Creating a new model")
    model = create_model()
    training_labels_final = np.array(training_labels)
    model.fit(padded, training_labels_final, epochs=500)
    model.save('mental_health_assistant_model.h5')

# Custom styling for the UI
st.markdown(
    """
    <style>
    html, body, [class*="css"]  {
        font-family: 'Roboto', sans-serif;
    }
    .title {
        font-size: 50px;
        font-weight: bold;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 20px;
    }
    .subheader {
        font-size: 24px;
        color: #2980b9;
        text-align: center;
        margin-top: 10px;
    }
    .listening {
        font-size: 20px;
        color: #e74c3c;
        font-weight: bold;
        text-align: center;
    }
    .stButton>button {
        background-color: #3498db;
        color: white;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 5px;
        margin-top: 20px;
    }
    .stButton>button:hover {
        background-color: #2980b9;
        color: white;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# Streamlit UI starts here
st.markdown('<div class="title">Mental Health Assistant Application</div>', unsafe_allow_html=True)

# Sidebar for choosing between Chatbot and Voice Assistant
option = st.sidebar.selectbox("Choose an option:", ["Chatbot", "Voice Assistant"])

# Initialize session state for chat history
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = []

if 'voice_chat_history' not in st.session_state:
    st.session_state.voice_chat_history = []

# Function to predict the intent
def predict_intent(user_input):
    sequences_input = tokenizer.texts_to_sequences([user_input])
    padded_input = pad_sequences(sequences_input, truncating='post', maxlen=max_len)
    result = model.predict(padded_input)
    category = enc.inverse_transform([np.argmax(result)])[0]
    return category

# Function to display chat history
def display_chat_history(history):
    for speaker, text in history:
        if speaker == "User":
            st.markdown(
                f"<div style='text-align: right; color: #3498db; font-family: Arial, sans-serif; font-size: 18px; "
                f"border-radius: 10px; padding: 10px; background-color: #f1f1f1; margin-bottom: 10px;'>{text}</div>",
                unsafe_allow_html=True)
        else:
            st.markdown(
                f"<div style='text-align: left; color: #2ecc71; font-family: Arial, sans-serif; font-size: 18px; "
                f"border-radius: 10px; padding: 10px; background-color: #f1f1f1; margin-bottom: 10px;'>{text}</div>",
                unsafe_allow_html=True)

# Callback function for chat input
def on_input_change():
    user_input = st.session_state.user_input
    if user_input:
        # Predict the intent
        category = predict_intent(user_input)

        # Fetch a random response for the predicted intent
        response = None
        for i in data['intents']:
            if i['tag'] == category:
                response = np.random.choice(i['responses'])
                break

        # Update chat history
        st.session_state.chat_history.append(("User", user_input))
        st.session_state.chat_history.append(("Bot", response))

        # Clear the input box (this will happen on next rerun)
        st.session_state.user_input = ""

if option == "Chatbot":
    st.subheader("Chatbot for Mental Health")

    # Create a container for the chat history
    chat_container = st.container()

    # Display chat history
    with chat_container:
        display_chat_history(st.session_state.chat_history)

    # Take user input from a text box
    st.text_input("Ask me something:", key="user_input", on_change=on_input_change)

elif option == "Voice Assistant":
    st.subheader("Voice Assistant for Mental Health")

    # Create a container for the voice chat history
    voice_chat_container = st.container()

    # Display voice chat history
    with voice_chat_container:
        display_chat_history(st.session_state.voice_chat_history)

    # Function to listen to the user's voice
    def listen():
        r = sr.Recognizer()
        with sr.Microphone() as source:
            st.write('<div class="listening">Listening...</div>', unsafe_allow_html=True)
            r.adjust_for_ambient_noise(source)
            try:
                audio = r.listen(source, timeout=5)  # Add a timeout
                text = r.recognize_google(audio)
                return text
            except sr.UnknownValueError:
                st.write("Sorry, I could not understand the audio.")
                return None
            except sr.RequestError:
                st.write("Could not request results from Google Speech Recognition service.")
                return None
            except Exception as e:
                st.write(f"An error occurred: {e}")
                return None

    # Button to start voice interaction
    if st.button("Speak to Assistant"):
        user_input = listen()
        if user_input:
            st.write(f"User: {user_input}")

            if user_input and user_input.lower() != "sorry, i could not understand the audio.":
                # Predict the intent
                category = predict_intent(user_input)

                # Fetch a random response for the predicted intent
                response = None
                for i in data['intents']:
                    if i['tag'] == category:
                        response = np.random.choice(i['responses'])
                        break

                # Update voice chat history
                st.session_state.voice_chat_history.append(("User", user_input))
                st.session_state.voice_chat_history.append(("Bot", response))

                # Optionally, you can print the response on the UI
                st.write(f"Bot: {response}")
