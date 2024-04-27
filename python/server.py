
import requests  
from datetime import datetime, timedelta
import bcrypt
import json
from bson import ObjectId ,json_util
from flask import Flask, request, jsonify ,  send_file
from flask_cors import CORS
from flask_socketio import SocketIO
from mongoengine import connect , ValidationError
from models.User import User, UserRoleEnum
from models.Course import Course
from models.Attandance import Attendance
from models.Message import Message
from models.Result import ObjectofAssessment, Result
from models.Notification import Notification
from models.Location import Location
import cv2
import os
import smtplib
import ssl
import random
import string
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import io
import openpyxl
from deepface import DeepFace


# import tensorflow as tf
# import numpy as np
# import random
# from tensorflow.keras.preprocessing.text import Tokenizer
# from tensorflow.keras.preprocessing.sequence import pad_sequences

# from dataSet import texts
# from dataSet import labelsofTexts


app = Flask(__name__) 

# BELLOW MODEL CODE
# Convert labels to NumPy array

# labels = np.array(labelsofTexts)

# # Tokenize the text data
# max_words = 1000  # Maximum number of words to tokenize
# tokenizer = Tokenizer(num_words=max_words)

# tokenizer.fit_on_texts(texts)
# sequences = tokenizer.texts_to_sequences(texts)

# # Pad sequences to ensure uniform length
# maxlen = 20  # Maximum sequence length
# padded_sequences = pad_sequences(sequences, maxlen=maxlen)

# # Define the model architecture
# model = tf.keras.Sequential([
#     tf.keras.layers.Embedding(max_words, 16, input_length=maxlen),
#     tf.keras.layers.GlobalAveragePooling1D(),
#     tf.keras.layers.Dense(16, activation='relu'),
#     tf.keras.layers.Dense(1, activation='sigmoid')
# ])

# # Compile the model
# model.compile(optimizer='adam',
#                 loss='binary_crossentropy',
#                 metrics=['accuracy'])

# # Split the data into training and validation sets
# from sklearn.model_selection import train_test_split
# X_train, X_val, y_train, y_val = train_test_split(padded_sequences, labels, test_size=0.2, random_state=42)

# # Train the model with validation data
# model.fit(X_train, y_train, epochs=10, batch_size=32, validation_data=(X_val, y_val))
##################################################################################################################
import pandas as panda
# from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem.porter import *
import string
import nltk
# from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import confusion_matrix
# import seaborn
from textstat.textstat import *
# from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import f1_score
from sklearn.feature_selection import SelectFromModel
from sklearn.metrics import classification_report
from sklearn.metrics import accuracy_score
# from sklearn.svm import LinearSVC
from sklearn.ensemble import RandomForestClassifier
# from sklearn.naive_bayes import GaussianNB
import numpy as np
from nltk.sentiment.vader import SentimentIntensityAnalyzer as VS
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)


dataset = panda.read_csv("./Dataset/HateSpeech_Dataset/HateSpeechData.csv")
# dataset

# Adding text-length as a field in the dataset
dataset['text length'] = dataset['tweet'].apply(len)
# print(dataset.head())

# collecting only the tweets from the csv file into a variable name tweet
tweet=dataset.tweet

## 1. Removal of punctuation and capitlization
## 2. Tokenizing
## 3. Removal of stopwords
## 4. Stemming
nltk.download('stopwords')
stopwords = nltk.corpus.stopwords.words("english")

#extending the stopwords to include other words used in twitter such as retweet(rt) etc.
other_exclusions = ["#ff", "ff", "rt"]
stopwords.extend(other_exclusions)
stemmer = PorterStemmer()

def preprocess(tweet):  
    
    # removal of extra spaces
    tweet_space = tweet.str.replace(r'\s+', ' ')

    # removal of @name[mention]
    tweet_name = tweet_space.str.replace(r'@[\w\-]+', '')

    # removal of links[https://abc.com]
    # giant_url_regex =  re.compile(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')
    tweets = tweet_name.str.replace(r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+', '')
    
    # removal of punctuations and numbers
    punc_remove = tweets.str.replace("[^a-zA-Z]", " ")
    # remove whitespace with a single space
    newtweet = punc_remove.str.replace(r'\s+', ' ')
    # remove leading and trailing whitespace
    newtweet = newtweet.str.replace(r'^\s+|\s+?$', '')
    # replace normal numbers with numbr
    newtweet = newtweet.str.replace(r'\d+(\.\d+)?', 'numbr')
    # removal of capitalization
    tweet_lower = newtweet.str.lower()
    
    # tokenizing
    tokenized_tweet = tweet_lower.apply(lambda x: x.split())
    
    # removal of stopwords
    tokenized_tweet = tokenized_tweet.apply(lambda x: [item for item in x if item not in stopwords])
    
    # stemming of the tweets
    tokenized_tweet = tokenized_tweet.apply(lambda x: [stemmer.stem(i) for i in x]) 
    
    for i in range(len(tokenized_tweet)):
        tokenized_tweet[i] = ' '.join(tokenized_tweet[i])
    
    return tokenized_tweet

processed_tweets = preprocess(tweet)   

dataset['processed_tweets'] = processed_tweets
# print(dataset[["tweet","processed_tweets"]].head(10),"preprocessed")

#TF-IDF Features-F1
# https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html
tfidf_vectorizer = TfidfVectorizer(ngram_range=(1, 2),max_df=0.75, min_df=5, max_features=10000)

# TF-IDF feature matrix
tfidf = tfidf_vectorizer.fit_transform(dataset['processed_tweets'] )
tfidf

X = tfidf
y = dataset['class'].astype(int)
X_train_tfidf, X_test_tfidf, y_train, y_test = train_test_split(X, y, random_state=42, test_size=0.1)
rf=RandomForestClassifier()
rf.fit(X_train_tfidf,y_train)
y_preds = rf.predict(X_test_tfidf)
acc1=accuracy_score(y_test,y_preds)
report = classification_report( y_test, y_preds )
# print(report)
print("Random Forest, Accuracy Score:",acc1)
# ABOVE MODEL CODE

def hateSpeechDetector(message):

    processed_input = preprocess(panda.Series([message]))

    # Transform input text into TF-IDF features
    input_tfidf = tfidf_vectorizer.transform(processed_input)

    # Make prediction
    prediction = rf.predict(input_tfidf)

    if prediction[0] == 0:
        print("Prediction for the input text is hate", prediction)
        return True
    elif prediction[0] == 1:
        print("Prediction for the input text is offensive", prediction)
        return True
    else:
        print("Prediction for the input text is neither", prediction)
        return False

socketio = SocketIO(app)
CORS(app)  # Enable CORS for all routes


# Get the current directory of the server.py script
current_directory = os.path.dirname(os.path.abspath(__file__))

# Define the relative path to the global.json file
config_file_path = os.path.join(current_directory, '../Config/global.json')

# Step 1: Read the JSON file
with open(config_file_path, 'r') as file:
    config_data = json.load(file)  # Step 2: Parse the JSON data

DB_URL = config_data['url']

# print(DB_URL)
# Configure the MongoDB connection

connect(host= DB_URL)
    
##########################################################################################

@app.before_request
def keep_authenticated():
    allowed_endpoints = ['serve_image','login' ,'forget_verify' ,'set_password' , 'delete_user','create_location']
    token = request.headers.get('Authorization')
    if request.endpoint not in allowed_endpoints:
        if token is not None:
            value = User.verify_token(token)
            if value == None:
                print({"message": "Token has expired"})
                return jsonify({"message": "Token has expired"}), 401
        elif token is None:
            print({"message": "Token must be passed"})
            return jsonify({"message": "Token must be passed"}), 401
    


# Socket Io Message Recieved 

@socketio.on('message')
def handle_message(data):
   
    sender_id = ObjectId(data['sender_id'])
    
    receiver_id = ObjectId(data['receiver_id'])
    # print(data , "data in messages")


    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        message_content=data['message_content'],
        timestamp=datetime.now(),
        is_bot_message=False
    )
   

    new_message.save()
    userdata = User.objects(id=sender_id).first()
    newobj = {
         'sender': {
              "_id" : str(sender_id),
              "name" : userdata.username,
            } ,
            'receiver': {
              "_id" : str(receiver_id),
            } ,
        'message_content' : data['message_content'],
        'hatespeech':hateSpeechDetector(data['message_content'])
    }
    # print(newobj)
    # /Emit the message to all connected clients
   
    socketio.emit('message',newobj )


@socketio.on('fetch_messages')
def fetch_messages(data):
    # print(data ,  "data in python api")
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']

   
    Data_Messages =   Message.fetch_messages(sender_id , receiver_id)
     # Serialize messages to a list of dictionaries
    serialized_messages = [
        {
            'sender': {
              "_id" : str(message.sender_id.id),
                 "name" : str(message.sender_id.username),
                    "email" : str(message.sender_id.email),
                       "roll_number" : str(message.sender_id.roll_number),
            
            } ,
            'receiver': {
                 "_id" : str(message.receiver_id.id),
                      "name" : str(message.receiver_id.username),
                    "email" : str(message.receiver_id.email),
                       "roll_number" : str(message.receiver_id.roll_number),
                         },
            'message_content': message.message_content,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'is_bot_message': message.is_bot_message,
            # 'hatespeech':hateSpeechDetector(message.message_content)
        }
        for message in Data_Messages
    ]
    # for message in Data_Messages:
    #    print(message.message_content , "fetch Messages")
    sorted_messages = sorted(serialized_messages, key=lambda x: x['timestamp'])
  
    socketio.emit('fetched_messages', sorted_messages )    


###################### Pagination for fetching more messages ################
    




######################## Fetch Chats ################################
    
@app.route('/Users', methods=['GET'])
def get_users():
    users = User.objects().all()
    # print(users)
    user_list = [
        {   
            '_id': str(user.id),
            'image':user.image,
            'username': user.username,
            'email': user.email,
            'roll_number': user.roll_number,
            'role': str(user.role).split("UserRoleEnum.")[1], 
            'contact':user.contact,

           'program': str(user.program).split("UserProgramEnum.")[1] if "UserProgramEnum." in str(user.program) else "",  # Check if "UserProgramEnum." exists before splitting

            'gender':str(user.gender),

            'cnic':user.cnic,

            'blood_group':user.blood_group,

            'address':user.address,

            'semester':user.semester,
            'date_of_birth':user.date_of_birth
        }
        for user in users
    ]
    return jsonify(user_list)

@app.route('/FetchBot', methods=['GET'])
def fetch_bot():
    bot_id = request.args.get('_id')  # Get _id from query parameters
    if bot_id:
        bot = User.objects(id=bot_id).first()
        if bot:
            bot_data = {   
                '_id': str(bot.id),
                'username': bot.username,
                'email': bot.email,
                'roll_number': bot.roll_number,
                'role': str(bot.role),  # Convert UserRoleEnum to string
            }
            return jsonify(bot_data)
        else:
            return jsonify({'error': 'Bot not found'}), 404
    else:
        return jsonify({'error': 'No bot ID provided'}), 400






################ Save user and Bot Messages #####################




@app.route("/SaveBotMessages", methods=['POST'])
def Save_bot():
    try:
 
        data = request.get_json()
        # print(data , "data backend")
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
        message_content = data.get('message_content')
        bot_message_content = data.get('bot_message_content')
     
        

        # Create the user object
        botData = Message(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message_content=message_content,
            bot_message_content=bot_message_content,
              timestamp=datetime.now(),
               
        )
        # print(botData , "data backend")

        # Save the user object to the database
        botData.save()

        return jsonify({'status': 200, "obj": botData.to_json()})

    except Exception as e:
        # Handle the exception and return an error response
        return jsonify({'status': 400, 'error': str(e)})



@app.route('/SaveBotResponse', methods=['POST'])
def save_bot_response():
    try:
        data = request.get_json()
        
        message_id = data.get('messageId')
        bot_response = data.get('botResponse')
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
       
        if not message_id or not bot_response:
            return jsonify({'status': 400, 'error': 'Invalid data provided'})


      
        # Create a new Message object with bot response and other required fields
        new_message = Message(
            sender_id=sender_id,
            receiver_id=receiver_id,
            message_content="",
            bot_message_content=bot_response,
            timestamp=datetime.now(),
            is_bot_message=True
        )
        
        # Save the new message to the database
        new_message.save()
         
        return jsonify({'status': 200, 'message': 'Save success'})

    except Exception as e:
        return jsonify({'status': 400, 'error': str(e)})

# Example bot responses
bot_responses = [
    "Hello! How can I help you?",
    "What can I assist you with today?",
    "Feel free to ask me anything!",
    "I'm here to help. What do you need?",
    "How can I assist you today?"
]

@app.route('/GetBotResponse', methods=['POST'])
def get_bot_response():
    # This endpoint simply returns a random bot response from the list
    bot_message_content = random.choice(bot_responses)
    return jsonify({'bot_message_content': bot_message_content})



@app.route('/AI_Reply', methods=['POST'])
def ChatGPT():
    try:
        dataObj = request.get_json()
        content = dataObj.get('content')
        role = dataObj.get('role')
        # print(dataObj, content, role, "get json input")

        data = {
            "model": "gpt-3.5-turbo",
            "messages": [{"role": role, "content": content}]
            # "temperature": 0.7
        }

        headers = {
            "Content-Type": "application/json",
          
   
        }

        response = requests.post("https://api.openai.com/v1/chat/completions",
                                 json=data,
                                 headers=headers)

        response_json = response.json()
        print(response_json  , "AI reply")
        return response_json
    except Exception as e:
        return {'error': str(e)}





@app.route('/FetchMessages', methods=['POST'])
def fetch_messages():
    try:
        data = request.get_json()
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
        print(receiver_id , "recieve")
        # Fetch messages from the database based on the provided message IDs
        messages = Message.fetch_messages(sender_id , receiver_id)
          # Serialize messages to a list of dictionaries
        serialized_messages = [
            {
                'sender_id': str(message.sender_id.id),
                'receiver_id': str(message.receiver_id.id),
                'message_content': message.message_content,
                 'bot_message_content': message.bot_message_content,
                'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
                'is_bot_message': message.is_bot_message
            }
            for message in messages
        ]
      
        sorted_messages = sorted(serialized_messages, key=lambda x: x['timestamp'])
        print(len(sorted_messages) , "fetch length")
        return jsonify({'status': 200, 'messages': sorted_messages})

    except Exception as e:
        return jsonify({'status': 400, 'error': str(e)})











@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    username = data.get('username')
    role = UserRoleEnum[data.get('role')]  # Assuming the role is provided as a string

    # Optional field
    roll_number = data.get('roll_number', "")

    if not email or not password or not username or not role:
        return jsonify({"message": "Missing required fields"}), 400

    # Check if the user already exists
    if User.objects(email=email).first():
        return jsonify({"message": "User with this email already exists"}), 400

    try:
        user = User.register(email, password, username, role, roll_number)
        return jsonify({"message": "User registered successfully", "user": user.to_json()}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
##################################################################################################

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email,password)

    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    token = User.login_user(email,password)

    if token is None:
        return jsonify({"message": "Invalid email or password"}), 401
    else:
        return jsonify({"token": token}), 200
        
###############################################################################################
    
@app.route('/verify-token', methods=['POST'])
def verify_token():
    token = request.headers.get('Authorization')

    print(token,"token")
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    value = User.verify_token(token)
    if value == None:
        return jsonify({"message": "Token has expired"}), 401
    else:
        return jsonify({"message": "Token is valid", "user": value.to_json()}), 200
    
###########################################################################################################
@app.route('/users/<user_id>', methods=['GET'])
def fetch_user_by_id(user_id):
    user = User.fetch_by_id(user_id)
    if user:
        return jsonify(user.to_json()), 200
    else:
        return jsonify({"message": "User not found"}), 404
###########################################################################################################
@app.route('/users/update/<user_id>', methods=['PUT'])
def update_user_route(user_id):
    update_data = request.json  # Assuming update data is sent in JSON format in the request body
    user = User.fetch_by_id(user_id)
    
    if user:
        try:
            User.update_user(user, **update_data)
            updated_user = User.fetch_by_id(user_id)  # Fetch the updated user
            return jsonify({"message": "User updated successfully", "user": updated_user.to_json()}), 200
        except ValidationError as e:
            return jsonify({"message": str(e)}), 400
    else:
        return jsonify({"message": "User not found"}), 404
###########################################################################################################
@app.route('/insert_courses', methods=['POST'])
def create_course():
    try:
        data = request.json
        teacher_id_str = data.get('teacher_id_str')
        course_name = data.get('course_name')
        credit_hour = data.get('credit_hour')
        student_ids = data.get('student_ids', [])  # Optional, default to empty list

        # print(teacher_id_str,course_name,credit_hour,student_ids)
        # Insert the course using the insert_course method
        new_course = Course.insert_course(teacher_id_str, course_name, credit_hour, student_ids)
        
        if new_course:
            return jsonify({'message': 'Course created successfully', 'course_id': str(new_course.id)}), 201
        else:
            return jsonify({'message': 'Failed to create course'}), 400

    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

# Route to fetch courses by Teacher ID
@app.route('/courses_teacher/<teacher_id>', methods=['GET'])
def get_courses_by_teacher_id(teacher_id):
    try:
        courses = Course.fetch_courses_by_teacher_id(teacher_id)
        course_list = []
        for course in courses:
            course_info = {
                'course_id': str(course.id),
                'course_name': course.course_name,
                'credit_hour': course.credit_hour,
                'teacher_id': str(course.teacher_id.id),
                'students': []
            }
            # Fetch and include student information
            for student in course.students:
                student_info = {
                    'student_id': str(student.id),
                    'name': student.username,
                    'email': student.email,
                    # Include other student details as needed
                }
                course_info['students'].append(student_info)
            
            course_list.append(course_info)
        
        print(course_list)
        return jsonify(course_list)
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    
# Route to fetch courses by student ID
@app.route('/courses_student/<student_id>', methods=['GET'])
def get_courses_by_student_id(student_id):
    try:
        print(student_id)
        courses = Course.fetch_courses_by_student_id(student_id)
        course_list = [{'course_id': str(course.id), 'course_name': course.course_name,'credit_hour':course.credit_hour,'teacher_id':str(course.teacher_id.id)} for course in courses]
        print(course_list)
        return jsonify(course_list)
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400    

# Route to append a new student to an existing course
@app.route('/courses/<course_id>/students', methods=['PUT'])
def add_student_to_course(course_id):
    data = request.json
    try:
        course = Course.append_student_to_course(course_id, data['student_id'])
        return jsonify({'message': 'Student added to course successfully', 'course_id': str(course.id)}), 200
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    


@app.route('/fetch_attendance', methods=['GET'])
def fetch_attendance():
    course_id = request.args.get('course_id')

    if not course_id:
        return jsonify({'error': 'Course ID is required'}), 400
    
    try:
        attendances = Attendance.fetch_attendance_by_course_id_sorted(course_id)
        print(attendances)
        

        return jsonify(attendances), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@app.route('/fetch_attendancebyId', methods=['GET'])
def fetch_attendancebyid():
    _id = request.args.get('_id')
    print(_id , "_id get")

    if not _id:
        return jsonify({'error': 'ID is required'}), 400
    
    try:
        attendance =  Attendance.objects(id=_id).first()
        print(attendance)
        if not attendance:
            return jsonify({'error': 'Attendance record not found'}), 404

        serialized_students = []
        for student_info in attendance.students:
            student_id = student_info.student_id
            attendance_status = student_info.attendance_status

            serialized_students.append({
                '_id': str(student_id.id) ,
                'name': student_id.username,
                'email': student_id.email,
                'address': student_id.address,
                'blood_group': student_id.blood_group,
                'date_of_birth': student_id.date_of_birth,
                'gender': student_id.gender,
                'image': student_id.image,
                'program': student_id.program,
                'contact': student_id.contact,
                'attendance_status': attendance_status
            })

        serialized_obj = {
            '_id': str(attendance.id),
            'course': {
                'id': str(attendance.course_id.id),
                'name': attendance.course_id.course_name
            },
            'date': str(attendance.date),
            'students': serialized_students,
            'confirm_status': attendance.confirm_status
        }

        return jsonify(serialized_obj), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/insert_empty_attendance', methods=['POST'])
def insert_empty_attendance():
    try:    
        # Parse request data
        course_id = request.args.get('course_id') 
        date = request.args.get('date')
          # Check if an attendance record already exists for the given date
        existing_attendance = Attendance.objects(course_id=course_id, date=date).first()
        if existing_attendance:
            return jsonify({'error': 'Attendance for this date already exists'}), 400

        # Call insert_empty method from Attendance model
        empty_attendance = Attendance.insert_empty(course_id=course_id, date=date)
      
        # Extract the _id of the newly created document
        attendance_id = str(empty_attendance.id)
        
        # Prepare the response JSON object
        response_data = {
            'attendance_id': attendance_id,
            'message': 'Empty attendance record inserted successfully'
        }
        
        # Return the response with status code 200
        return jsonify(response_data), 200
    
    except Exception as e:
        # Handle other exceptions
        return jsonify({'error': 'Internal Server Error'}), 500


    # update attandence status


@app.route('/update_student_attendance_status', methods=['POST'])
def update_student_attendance_status():
    try:
        # Parse request data
        attendance_id = request.args.get('attendance_id')
        student_id = request.args.get('student_id')
        new_attendance_status = request.args.get('attendance_status')

        # Find the attendance record by its _id
        attendance = Attendance.objects(id=attendance_id).first()

        if not attendance:
            return jsonify({'error': 'Attendance record not found'}), 404

        # Find the student within the students list
        student = next((student for student in attendance.students if str(student.student_id.id) == student_id), None)

        if not student:
            return jsonify({'error': 'Student not found in attendance record'}), 404

        # Update the attendance status for the student
        student.attendance_status = new_attendance_status
        attendance.save()

        return jsonify({'message': 'Student attendance status updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500    

# ####################### Submit Attendance #########################
    


@app.route('/update_confirm_status', methods=['POST'])
def submit_attendance():
    try:
        # Parse request data
        data = request.json
        attendance_id = data.get('attendance_id')
        status = data.get('status')

        # Find the attendance record by its _id
        attendance = Attendance.objects(id=attendance_id).first()

        if not attendance:
            return jsonify({'error': 'Attendance record not found'}), 404

        # Update the attendance status for the student
        attendance.confirm_status = status
        attendance.save()

        return jsonify({'message': 'Student attendance status updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# add new course 

@app.route('/add_courses', methods=['POST'])
def add_course():
    try:
        # Parse request data
        data = request.json

        print("Received data:", data)  # Debug statement
        
        # Create new course object
        course = Course(
            course_name=data['course_name'],
            credit_hour=2.0  # Convert credit_hour to float
        )

        # Save the course to the database
        course.save()

        return jsonify({'message': 'Course created successfully'}), 200

    except Exception as e:
        print("Error:", e)  # Debug statement
        return jsonify({'error': str(e)}), 500



# delete course


@app.route('/delete_course/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        # Find the course by its ID
        course = Course.objects.get(id=course_id)
        # Delete the course
        course.delete()
        return jsonify({'message': 'Course deleted successfully'}), 200
    except Course.DoesNotExist:
        return jsonify({'error': 'Course not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#  fetch Courses

@app.route('/fetch_courses', methods=['GET'])
def get_courses():
    try:
        # Fetch all courses from the database
        courses = Course.objects().all()
        # Serialize the courses data
        serialized_courses = [{
            'id': str(course.id),
            'course_name': course.course_name,
            'credit_hour': float(course.credit_hour)  # Convert DecimalField to float
            # Add more fields if needed
        } for course in courses]
        return jsonify(serialized_courses), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Forget Password
@app.route('/forgetverify', methods=['POST'])
def forget_verify():
    try: 
        # Retrieve email from request JSON
        email = request.json.get('email')
        print(email , "recive in python")
        
        # Find user by email in User collection
        user = User.objects(email=email).first()
        
        # If user with provided email does not exist, return status 400
        if not user:
            return jsonify({'status': 400})

        # Generate a random password
        password = ''.join(random.choices(string.digits, k=5))
        
        # Retrieve email sender's credentials from config_data
        sender_email = config_data['email']
        sender_password = config_data['password']

        # Create email message
        message = MIMEMultipart("alternative")
        message["Subject"] = "UMS Portal Verification"
        message["From"] = sender_email
        message["To"] = email
        html = f"""
        <p>Your Verification Code is:  {password}</p>
        """

        part = MIMEText(html, "html")
        message.attach(part)

        # Send the email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())  

        # Return status 200 and verification password
        return jsonify({'status': 200, 'verification': password})
    
    except Exception as e:
        print(e)
        # If any exception occurs, return status 500
        return jsonify({'status': 500})

# Set password
    

# Route for setting a new password
    

@app.route('/setpassword', methods=['POST'])
def set_password():
    try:
        # Extract email and new password from the request JSON
        email = request.json.get('email')
        new_password = request.json.get('password')

        # Find the user by email in the User collection
        user = User.objects(email=email).first()

        # If user exists, update the password
        if user:
            print(email ,new_password , user.email , "get" )
            # Hash the new password before updating
            hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            print(hashed_password, "hash")
            user.password = str(hashed_password)  # Decode the hashed password
            user.save()
            return jsonify({'status': 'Password updated successfully'}),200

        # If user does not exist, return an error response
        return jsonify({'error': 'User not found with the provided email'}), 404

    except Exception as e:
        # Handle any exceptions and return an error response
        return jsonify({'error': str(e)}), 500



@app.route('/api/invoice', methods=['POST'])
def generate_invoice():
    invoice_data = request.json  # Get the invoice data from the request
    print(invoice_data , "data invoice")
    # Generate PDF invoice
    pdf_bytes = generate_pdf(invoice_data)
  
    # Save the PDF file to a folder
    pdf_folder = 'invoices'
    if not os.path.exists(pdf_folder):
        os.makedirs(pdf_folder)

    pdf_path = os.path.join(pdf_folder, f"{invoice_data['invoiceNo']}.pdf")
    with open(pdf_path, 'wb') as pdf_file:
        pdf_file.write(pdf_bytes)
    
    return send_file(pdf_path, as_attachment=True)

    # Return success response
    # return jsonify({'message': 'PDF file generated and saved successfully'})

def generate_pdf(invoice_data):
    # Calculate the balance
    balance = invoice_data["totalAmount"] - invoice_data["paid"]
    
    # Create a new PDF buffer
    pdf_buffer = io.BytesIO()
    
    # Create a new canvas
    c = canvas.Canvas(pdf_buffer, pagesize=letter)
    
    # Write the invoice data to the PDF
    c.drawString(100, 750, "Invoice No: " + invoice_data["invoiceNo"])
    c.drawString(100, 730, "Invoice Date: " + invoice_data["invoiceDate"])
    c.drawString(100, 710, "Due Date: " + invoice_data["dueDate"])
    c.drawString(100, 690, "Term: " + invoice_data["term"])
    c.drawString(100, 670, "Receipt For: " + invoice_data["receiptFor"])
    c.drawString(100, 650, "Barcode: " + invoice_data["barcode"])
    c.drawString(100, 630, "Total Amount: $" + str(invoice_data["totalAmount"]))
    c.drawString(100, 610, "Paid: $" + str(invoice_data["paid"]))
    c.drawString(100, 590, "Balance: $" + str(balance))  # Use calculated balance
    c.drawString(100, 570, "Status: " + invoice_data["status"])
    
    # Save the PDF
    c.save()
    
    # Get the PDF bytes from the buffer
    pdf_bytes = pdf_buffer.getvalue()
    
    return pdf_bytes


# generate Excel file students 



# Route to receive student data and generate Excel file
@app.route('/export_students', methods=['POST'])
def export_students():
    try:
        # Get JSON data from request
        data = request.get_json()

        # Get list of students
        students = data.get('students', [])

        # Create a new Excel workbook
        wb = openpyxl.Workbook()
        ws = wb.active

        # Write headers
        ws.append(['Name', 'Email'])

        # Write student data
        for student in students:
            ws.append([student.get('name', ''), student.get('email', '')])

        # Save the workbook
        wb.save('students.xlsx')

        # Return success response
        return jsonify({'message': 'Excel file generated successfully'}), 200
    except Exception as e:
        # Return error response
        return jsonify({'error': str(e)}), 500



@app.route('/result', methods=['POST'])
def add_or_update_result():
    # Parse request data
    data = request.get_json()
    student_id = ObjectId(data.get('student_id'))
    course_id = ObjectId(data.get('course_id'))
    quiz = data.get('quiz', [])
    assignment = data.get('assignment', [])
    mid_term = data.get('mid_term', {})
    final_term = data.get('final_term', {})
    academic_year = data.get('academic_year')

    # Check if document already exists
    existing_result = Result.objects(student_id=student_id, course_id=course_id).first()
    if existing_result:
        print("Exist")
        # Update existing document
        existing_result.update(
            set__quiz=quiz,
            set__assignment=assignment,
            set__mid_term=mid_term,
            set__final_term=final_term,
            set__academic_year=academic_year
        )
        return {'message': 'Result updated successfully'}, 200
    else:
        print("new create")
        # Create new document
        result = Result(
            student_id=student_id,
            course_id=course_id,
            quiz=quiz,
            assignment=assignment,
            mid_term=mid_term,
            final_term=final_term,
            academic_year=academic_year
        )
        result.save()
        return {'message': 'Result created successfully'}, 201

   
# ###############  Fetch Grades by student and course id ########################
@app.route('/Get_result/<student_id>/<course_id>', methods=['GET'])
def get_result_by_id(student_id, course_id):
    print(student_id, course_id, "_ids get in backend")
    
    # Convert strings to ObjectId
    student_id = ObjectId(student_id)
    course_id = ObjectId(course_id)
    
    result = Result.objects(student_id=student_id, course_id=course_id).first()
    
    serialized_obj = {
        'course': {
            'id': str(result.course_id.id),
            'name': result.course_id.course_name  # Assuming Course has a 'course_name' field
        },
        'quiz': [],
        'assignment': [],
        'mid_term': {
            'total_marks': result.mid_term.total_marks,
            'obtained_marks': result.mid_term.obtained_marks,
            'weightage': result.mid_term.weightage
        },
        'final_term': {
            'total_marks': result.final_term.total_marks,
            'obtained_marks': result.final_term.obtained_marks,
            'weightage': result.final_term.weightage
        },
        'totalmarks': result.totalmarks,
        'grade': result.grade.value if result.grade else None,
        'academic_year': result.academic_year
    }

    # Serialize quiz
    for assessment in result.quiz:
        serialized_obj['quiz'].append({
            'total_marks': assessment.total_marks,
            'obtained_marks': assessment.obtained_marks,
            'weightage': assessment.weightage
        })

    # Serialize assignment
    for assessment in result.assignment:
        serialized_obj['assignment'].append({
            'total_marks': assessment.total_marks,
            'obtained_marks': assessment.obtained_marks,
            'weightage': assessment.weightage
        })

    return jsonify(serialized_obj), 200  # Return outside the loop

# API route to delete a user by _id





@app.route('/del_user_byid/<string:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return jsonify({'message': 'User deleted successfully'})
    except User.DoesNotExist:
        return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update_userData', methods=['POST'])
def update_userData():
    user_id = request.json.get('_id')
    email = request.json.get('email')

    username = request.json.get('username')
    roll_number = request.json.get('roll_number')
    contact = request.json.get('contact')
    program = request.json.get('program')
    gender = request.json.get('gender')
    cnic = request.json.get('cnic')
    blood_group = request.json.get('blood_group')
    address = request.json.get('address')
    semester = request.json.get('semester')
    date_of_birth = request.json.get('date_of_birth')
    role = request.json.get('role')
    password = request.json.get('password')
       # If _id is not provided, create a new document
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')   
    if not user_id:
        new_user = User(email=email, username=username, roll_number=roll_number,
                        contact=contact, program=program, gender=gender,
                        cnic=cnic, blood_group=blood_group, address=address,
                        semester=semester, date_of_birth=date_of_birth , role=role , password=hashed_password)
        new_user.save()
        return jsonify({'message': 'New user created successfully'}) 
    # Retrieve the user object
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Update the user fields if they are provided
    if email:
        user.email = email
  
    if username:
        user.username = username
    if roll_number:
        user.roll_number = roll_number
    if contact:
        user.contact = contact
    if program:
        user.program = program
    if gender:
        user.gender = gender
    if cnic:
        user.cnic = cnic
    if blood_group:
        user.blood_group = blood_group
    if address:
        user.address = address
    if semester:
        user.semester = semester
    if date_of_birth:
        user.date_of_birth = date_of_birth

    # Save the updated user
    user.save()

    return jsonify({'message': 'User updated successfully'})

@app.route('/fetch-results', methods=['POST'])
def get_result():
    try:
        data = request.json
        
        # Parse data from JSON
        student_id_str = data.get('student_id')
        course_id_str = data.get('course_id')

        # Check if both parameters are provided
        if not (student_id_str and course_id_str):
            return jsonify({'error': 'Both student_id and course_id are required.'}), 400
        
        # Call fetch_results method
        results = Result.fetch_results(student_id_str, course_id_str)

        # Return the fetched results
        return jsonify(results), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


#  Update role
def user_serializer(user):
    return json.loads(json_util.dumps(user._data))

# Define Routes
@app.route('/Updaterole/<string:_id>/<string:role>', methods=['POST'])
def update_role(_id, role):
    try:
        # Perform the update query to change the role
        user = User.objects(id=_id).first()

        if user:
            # Save the current lastlogin and startdate fields before updating
            lastlogin_backup = user.lastlogin
            startdate_backup = user.startdate

            # Update the role field
            user.role = role
            user.save()

            # Set back the lastlogin and startdate fields to the user object after updating the role
            user.lastlogin = lastlogin_backup
            user.startdate = startdate_backup
            user.save()

            # Serialize the User object using the custom serializer
            serialized_user = user_serializer(user)

            return jsonify({"status": 200, "obj": serialized_user, "msg": "Update successful"})
        else:
            return jsonify({"status": 400, "msg": "Error updating user"})
    except Exception as e:
        print(e)
        return jsonify({"status": 500, "msg": "Internal Server Error"})

@app.route('/read_result', methods=['GET'])
def get_results():
    try:
        data = request.json
     
        student_id_str = data.get('student_id')
        course_id_str = data.get('course_id')

        print(data)

        if not (student_id_str and course_id_str):
            return jsonify({'message': 'Both student_id and course_id are required.'}), 400
     
        results = Result.fetch_results(student_id_str, course_id_str)

        return jsonify(results), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500

@app.route('/append_quiz', methods=['PUT'])
def append_quiz():
    data = request.json
    result_id = ObjectId(data['result_id'])
    quiz = data['quiz']
    
    result = Result.objects.get(id=result_id)
    result.append_quiz(quiz)
    
    return jsonify({'message': 'Quiz appended successfully'}), 200

@app.route('/append_assignment', methods=['PUT'])
def append_assignment():
    data = request.json
    result_id = ObjectId(data['result_id'])
    assignment = data['assignment']
    
    result = Result.objects.get(id=result_id)
    result.append_assignment(assignment)
    
    return jsonify({'message': 'Assignment appended successfully'}), 200

@app.route('/uploadImage/<user_id>', methods=['POST'])
def upload_image(user_id):
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image = request.files['image']
    if image.filename == '':
        return jsonify({'error': 'No image selected'}), 400

    print(image,"IMAGE CHECK")
    objID = str(ObjectId())
    image_path = os.path.join(config_data['IMAGE_FOLDER'], objID+".jpg")

    update_data = {'image':objID}  # Assuming update data is sent in JSON format in the request body
    user = User.fetch_by_id(user_id)
    
    def remove_image(image_path):
        try:
            os.remove(image_path)
            print(f"Image '{image_path}' removed successfully.")
        except FileNotFoundError:
            print(f"Image '{image_path}' not found.")
        except Exception as e:
            print(f"Error occurred while removing image '{image_path}': {e}")

 
    if user:
        try:
            print(user.image,"USER IMAGE")
            remove_image(os.path.join(config_data['IMAGE_FOLDER'], user.image+".jpg"))
            User.update_user(user, **update_data)
            updated_user = User.fetch_by_id(user_id)  # Fetch the updated user
            image.save(image_path)
        except ValidationError as e:
            return jsonify({"message": str(e)}), 400
    
    return jsonify({'message': 'Image updated successfully', 'image': objID}), 200


@app.route('/fetch_image/<userid>', methods=['GET'])
def serve_image(userid):
    try:
        if '.' in userid:
            image_path = os.path.join(config_data['IMAGE_FOLDER'], userid)
            if os.path.exists(image_path):
                print("YES EXIST")
                return send_file(image_path, mimetype='image/jpeg')
        else:
            print("serve imagee got", userid)
            image_filename = f"{userid}.jpg"
            image_path = os.path.join(config_data['IMAGE_FOLDER'], image_filename)
            
            print(image_path)
            if os.path.exists(image_path):
                print("YES EXIST")
                return send_file(image_path, mimetype='image/jpeg')
            else:
                print("NOT EXIST")
                default_image_path = os.path.join(config_data['IMAGE_FOLDER'], 'logo.png')
                return send_file(default_image_path, mimetype='image/png')
    except Exception as e:
        return jsonify({'error': str(e)}), 500
####################################################################
@app.route('/create_result', methods=['POST'])
def create_result():
    
    data = request.json
    student_id = ObjectId(data['student_id'])
    course_id = ObjectId(data['course_id'])
    quiz_data = data.get('quiz', [])
    quiz = [ObjectofAssessment(**item) for item in quiz_data]
    assignment_data = data.get('assignment', [])
    assignment = [ObjectofAssessment(**item) for item in assignment_data]
    mid_term = ObjectofAssessment(**data['mid_term'])
    final_term = ObjectofAssessment(**data['final_term'])
    academic_year = data['academic_year']

    result = Result.create_result(student_id, course_id, quiz, assignment, mid_term, final_term, academic_year)

    return jsonify(result.to_json())



# BELOW NOTIFICATION APIs

@app.route('/notifications', methods=['GET'])
def get_notifications():
    notifications = Notification.fetch_all()
    print(notifications,"before return")
    return jsonify(notifications), 200

@app.route('/insertNotification/<string:headline>', methods=['POST'])
def create_notification(headline):
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image = request.files['image']
    
    if image.filename == '':
        return jsonify({'error': 'No image selected'}), 400
    
    def find_file_format(content_type):
        format_mapping = {
            'image/jpeg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'video/mp4': 'mp4',
            'audio/mpeg': 'mp3',
        }
        return format_mapping.get(content_type, 'unknown')


    print(image,"IMAGE CHECK",find_file_format(image.content_type))
    
    objID = str(ObjectId())
    image_path = os.path.join(config_data['IMAGE_FOLDER'], objID+"."+find_file_format(image.content_type))
    
    headline = headline
    if not image or not headline:
        return jsonify({'error': 'Image and headline are required'}), 400
    image.save(image_path)

    notification = Notification.create(image=objID+"."+find_file_format(image.content_type), headline=headline)
    print(objID,"objid")
    return {"message":'successfully insert'},200

@app.route('/notifications/<string:notification_id>', methods=['DELETE'])
def delete_notification(notification_id):
    success = Notification.objects(id=notification_id).first()
    if success:
        success.delete()
        return jsonify({'message': 'Notification deleted successfully'}), 200
    else:
        return jsonify({'error': 'Notification not found'}), 404

#############################################################################
@app.route('/locations', methods=['POST'])
def create_location():
        data = request.json
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        title = data.get('title')
        description = data.get('description')

        if latitude is None or longitude is None or title is None or description is None:
            return jsonify({'error': 'Missing fields'}), 400

        location = Location.create_location(latitude, longitude, title, description)
        return jsonify({'id': str(location.id)}), 201

@app.route('/getLocations', methods=['GET'])
def fetch_all_locations():
    locations = Location.fetch_all_locations()
    print(locations,"LIST")
    location_list = []
    for location in locations:
        location_dict = {
            'id': str(location.id),
            'latitude': location.coordinate.latitude,
            'longitude': location.coordinate.longitude,
            'title': location.title,
            'description': location.description
        }
        location_list.append(location_dict)
    return jsonify(location_list)

@app.route('/locations/<location_id>', methods=['PUT'])
def update_location(location_id):
        data = request.json
        location = Location.get_location()
        if location:
            location.update_location(
                latitude=data.get('latitude'),
                longitude=data.get('longitude'),
                title=data.get('title'),
                description=data.get('description')
            )
            return jsonify({'message': 'Location updated successfully'})
        else:
            return jsonify({'error': 'Location not found'}), 404

@app.route('/locations/<location_id>', methods=['DELETE'])
def delete_location(location_id):
        if Location.delete_location(location_id):
            return jsonify({'message': 'Location deleted successfully'})
        else:
            return jsonify({'error': 'Location not found'}), 404

@app.route('/upload-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files:
        return jsonify({'error': 'No video file provided'}), 400

    video_file = request.files['video']

    if video_file.filename == '':
        return jsonify({'error': 'No selected video file'}), 400

    if video_file and allowed_file(video_file.filename):
        video_path = os.path.join('./video', video_file.filename)
        video_file.save(video_path)

    # PERFORM FACE RECOGNITION HERE BELOW
        create_folder_if_not_exists("./frames")
        extract_frames(video_path, "./frames")
        match = perform_face_recognition_on_frames("./frames")
        print(match)

        return jsonify({'message': 'Video uploaded successfully', 'video_path': video_path,'person':match})
    else:
        return jsonify({'error': 'Invalid file type, only MP4 videos are allowed'}), 400

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {'mp4'}

def extract_frames(video_path, output_folder):
    # Open the video file
    vidcap = cv2.VideoCapture(video_path)
    success, image = vidcap.read()
    count = 0

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Get the frame rate of the video
    fps = vidcap.get(cv2.CAP_PROP_FPS)

    # Calculate the frame index for 2 seconds
    frame_index_2_seconds = int(3 * fps)

    # Loop through the video frames until 2 seconds or maximum 10 frames
    while count < frame_index_2_seconds and count < 10 and success:
        frame_path = os.path.join(output_folder, f"frame_{count:05d}.jpg")  # Define the frame filename
        cv2.imwrite(frame_path, image)  # Save the frame as an image
        success, image = vidcap.read()  # Read the next frame
        count += 1

    print(f"{count} frames extracted and saved to {output_folder}")

def create_folder_if_not_exists(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"Folder '{folder_path}' created.")
    else:
        print(f"Folder '{folder_path}' already exists.")

def perform_face_recognition_on_frames(frames_folder):
    best_reference_img = None
    total_score = 0

    # Iterate through the reference images
    for reference_img in os.listdir("./deepface/images"):
        reference_img_path = os.path.join("./deepface/images", reference_img)
        count = 0
        
        # Iterate through the frames in the folder
        for filename in os.listdir(frames_folder):
            if filename.endswith(".jpg") or filename.endswith(".png"):
                frame_path = os.path.join(frames_folder, filename)
                # Perform face recognition on each frame
                print(reference_img_path)
                result = DeepFace.verify(img1_path=frame_path, img2_path=reference_img_path)
                if result["verified"]:
                    print(f"Face recognized in {filename}: {result['distance']}")
                    count += 1
                else:
                    print(f"Face not recognized in {filename}")
        # Calculate the average recognition score for the reference image
        # avg_score = total_score / count if count > 0 else 0

        # Update the best reference image if its score is higher
        if total_score < count:
            total_score = count
            best_reference_img = reference_img
            print(best_reference_img,total_score)

    return best_reference_img

if __name__ == '__main__':
    socketio.run(app, debug=True, host=config_data['host'], port=5000)
