from flask_socketio import SocketIO
import os
from dotenv import load_dotenv 

import re
from flask import render_template
import urllib.parse

import random
import string

from flask_cors import CORS
from flask import Flask, request, jsonify

import bcrypt
from datetime import datetime
import json
from bson import ObjectId , json_util
from mongoengine import connect, Q , DoesNotExist

import os
import smtplib
import ssl
import json
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from models.User import User, UserRoleEnum
from models.Message import Message

import re 
import requests  
import smtplib 
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from werkzeug.utils import secure_filename
from bson import ObjectId


app = Flask(__name__)

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


# Configure the MongoDB connection

connect( host= DB_URL)
    
##########################################################################################

@app.before_request
def keep_authenticate():
    token = request.headers.get('Authorization')
    if token is not None and token != "null":
        value = User.verify_token(token)
        if value == None:
            return jsonify({"message": "Token has expired"}), 401
    


# Socket Io Message Recieved 

@socketio.on('message')
def handle_message(data):
    print(data ,"messages")
    sender_id = ObjectId(data['sender_id']['$oid'])
    
    receiver_id = ObjectId(data['receiver_id'])

    print(sender_id , receiver_id , "both -ids")

    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        message_content=data['message_content'],
        timestamp=datetime.now(),
        is_bot_message=False
    )
   
    new_message.save()

    # Emit the message to all connected clients
   
    socketio.emit('message', data)


@socketio.on('fetch_messages')
def fetch_messages(data):
    print(data ,  "data in python api")
    sender_id = data['sender_id']
    receiver_id = data['receiver_id']

   
    Data_Messages =   Message.fetch_messages(sender_id , receiver_id)
     # Serialize messages to a list of dictionaries
    serialized_messages = [
        {
            'sender_id': str(message.sender_id.id),
            'receiver_id': str(message.receiver_id.id),
            'message_content': message.message_content,
            'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S'),
            'is_bot_message': message.is_bot_message
        }
        for message in Data_Messages
    ]
    print(serialized_messages , "fetch Messages")
  
    socketio.emit('fetched_messages', serialized_messages )    



  # messages = Message.objects(sender_id=sender_id, receiver_id=receiver_id).order_by('-timestamp')
   
    # serialized_messages = [{'sender_id': str(message.sender_id), 'receiver_id': str(message.receiver_id), 'message_content': message.message_content, 'timestamp': message.timestamp.strftime('%Y-%m-%d %H:%M:%S')} for message in messages]
    # Emit messages to the client who requested them

# def fetch_messages(id1, id2):
#     messages = Message.objects.filter(
#         (
#             (Q(sender_id=id1) & Q(receiver_id=id2)) |  # sender_id = id1 and receiver_id = id2
#             (Q(sender_id=id2) & Q(receiver_id=id1))    # sender_id = id2 and receiver_id = id1
#         )
#     )
#     return messages



######################## Fetch Chats ################################
    
@app.route('/Users', methods=['GET'])
def get_users():
    users = User.objects().all()
    print(users)
    user_list = [
        {   
            '_id': str(user.id),
            'username': user.username,
            'email': user.email,
            'roll_number': user.roll_number,
            'role': str(user.role),  # Convert UserRoleEnum to string
        }
        for user in users
    ]
    return jsonify(user_list)





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






#  Delete all documents

   

# @app.route('/deleterecord', methods=['POST'])
# def deleterecord():
#     try:
#         # Delete all records from the 'Patient' collection
#         deleted_count = Users.objects().delete()

#         # Return the number of deleted records as the response
#         return jsonify({"deleted_count": deleted_count})

#     except Exception as e:
#         print(f"Error deleting records: {e}")
#         return jsonify({"error": str(e)}), 500




#  Fetch Patients


# @app.route('/FetchPatients', methods=['POST'])
# def fetch_patients():
#     data = request.get_json()
#     print(data)
#     users = Users.objects()

#     user_list = []

#     if users:
#         for user in users:
#             provider = user.provider.lower()
#             fax = user.fax
            

#             # Check if firstname, lastname, and phone match the provided data
#             if (data['firstname'].lower() in provider  ) and ( data['lastname'].lower()  in provider ) and (data['fax'] in fax ):
#                 user_dict = {
#                     'patientname': user.patientname,
#                     'fax': user.fax,
#                     'faxhistory': user.faxhistory,
#                     'dob': user.dob,
#                     'dos': user.dos,
#                     'provider': user.provider,
#                     'age': user.age,
#                     'physician': user.physician,
#                     'emapuget': user.emapuget,
#                     'emgstudy': user.emgstudy,
#                     'summary': user.summary,
#                     'impression': user.impression,
#                     'recommendation': user.recommendation,
#                     'dateofsigning': user.dateofsigning,
#                     'report': user.report,
#                     'filename': user.filename,
#                     'status': user.status,
#                 }
#                 user_list.append(user_dict)

#     return jsonify(user_list)







#  Sign Up API

@app.route('/signup',  methods=['POST'])
def signup():
    
    email = request.json['email']
    firstname = request.json['firstname']
    lastname = request.json['lastname']
    phone = request.json['phone']
    role = request.json['role']
    fax = request.json['fax']

  

    

    # Generate verification token and expiration time
    expiration_time = datetime.now() + timedelta(minutes=5)
    expiration_time_str = expiration_time.strftime('%Y-%m-%d %H:%M:%S')

    # Save user details to the database
    user = {
        'email': email,
        'firstname': firstname,
        'lastname': lastname,
        'phone': phone,
        'role': role,
        'fax': fax,
        'expirationTime': expiration_time_str,
    }
   

    # Send verification email
    send_verification_email(email, firstname, lastname , phone , role , fax ,expiration_time_str )

    return jsonify({'status': 200})

def send_verification_email(email, firstname, lastname , phone , role , fax ,expiration_time_str ):
    
    sender_email = config_data['email']
    password = config_data['password']

    message = MIMEMultipart("alternative")
    message["Subject"] = "EMA Provider Portal Verification"
    message["From"] = sender_email
    message["To"] = email

    verification_obj = {
        'email': email,
        'firstname': firstname,
        'lastname': lastname,
        'phone': phone,
        'role': role,
        'fax': fax,
        "expiration_time":expiration_time_str
       
    }
    verification_data = json.dumps(verification_obj)
    verification_data_encoded = urllib.parse.quote(verification_data)
    verification_link = f"{config_data['frontend_local_url']}/Verification?data={verification_data_encoded}"
  

    html = f"""
    <p>Dear {firstname} {lastname},</p>
    <p>Click <a href="{verification_link}">here</a> to create a password for your account.</p>
    <p>{email}</p>
    """

    part = MIMEText(html, "html")
    message.attach(part)

    # Send the email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(sender_email, email, message.as_string())


#  Insert user

@app.route("/InsertUser", methods=['POST'])
def insert_user():
    try:
        data = request.json
        firstname = data.get('firstname')
        lastname = data.get('lastname')
        email = data.get('email')
        phone = data.get('phone')
        password = data.get('password')
        role = data.get('role')
        fax = data.get('fax')

        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Get the current date
        current_date = datetime.now()

        # Create the user object
        user = User(
            firstname=firstname,
            lastname=lastname,
            email=email,
            phone=phone,
            password=hashed_password,
            role=role,
            fax=fax,
            lastlogin=None,  # Initialize with None, as it will be set later
            startdate=current_date.strftime('%B %d, %Y')
        )

        # Save the user object to the database
        user.save()

        return jsonify({'status': 200, "obj": user.to_json()})

    except Exception as e:
        # Handle the exception and return an error response
        return jsonify({'status': 400, 'error': str(e)})



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
#  Login 


# @app.route('/login', methods=['POST'])
# def login():
#     data = request.get_json()
#     email = data.get('email')
#     password = data.get('password')

#     if not email or not password:
#         return jsonify({'message': 'Missing email or password'}), 400

#     try:
#         user = User.objects.get(email=email)
#         print(user)
#     except User.DoesNotExist:
#         return jsonify({'message': 'User not found'}), 500

#     if bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
#         user_data = {
#             'id': str(user.id),
#             'email': user.email,
#             'firstname': user.firstname,
#             'lastname': user.lastname,  
#             'role':user.role,
#             'fax':user.fax
            
#         } 
        
#         return jsonify({'status': 200, 'obj': user_data}), 200
#     else:
#         return jsonify({'message': 'Incorrect password'}), 400



#  Usercheck


# @app.route('/Usercheck', methods=['POST'])
# def user_check():
#     data = request.json
#     email = data.get('email')
#     firstname = data.get('firstname')
#     lastname = data.get('lastname')
#     fax = data.get('fax')

#     # Check if the email already exists
#     if User.objects(email=email).count() > 0:
#         return jsonify({"status": 400, "message": "Email Already Exists"})

#     # Check if a user with the same first name, last name, and fax number already exists
#     users = User.objects(fax=fax)
#     for user in users:
#         if firstname.lower() in user.firstname.lower() and lastname.lower() in user.lastname.lower():
#             return jsonify({"status": 400, "message": f"User with {firstname} {lastname} already exists with the same Fax Number"})

#     return jsonify({"status": 200, "message": "User Created"})


#  Get patients Details


# @app.route('/Patientdetails', methods=['POST'])
# def get_patient_details():
#     try:
#         patient_id = request.json.get('_id', '')
#         object_id = ObjectId(patient_id)
#         patient = Users.objects(id=object_id).first()


#         if patient:
#             # Convert the patient object to a dictionary
#             patient_data = patient.to_mongo().to_dict()

#             # Convert ObjectId to string for JSON serialization
#             patient_data['_id'] = str(patient_data['_id'])

#             return jsonify([patient_data])
#         else:
#             return jsonify([])

#     except Exception as e:
#         print(e)
#         return jsonify({'message': 'Internal Server Error'}), 500



# # download 

# # @app.route('/download/<string:_id>', methods=['GET'])
# # def download_file(_id):
# #     directory = "../../data"  # Change this to the appropriate directory on your system

# #     try:
# #         # Find the patient record by _id
# #         name = Users.objects.get(id=_id)
# #     except Users.DoesNotExist:
# #         abort(404, "Patient not found")

# #     file_name = name.filename

# #     file_path = os.path.join(directory, file_name)

# #     if not os.path.exists(file_path):
# #         file_path = os.path.join(directory, file_name)
# #         print(file_path , 'path file ????') 
# #     if os.path.exists(file_path):
# #         print("File Exists")
# #     else:
# #         print("File Does Not Exist")

# #     print(os.path.exists(directory))

# #     try:
# #         return send_file(file_path, as_attachment=True)
# #     except Exception as e:
# #         print('Error downloading file:', e)
# #         abort(500, 'Error downloading file')
 


# # Search Patients 





# # Search API
# @app.route('/Search', methods=['POST'])
# def search_patients():
#     try:
#         searchquery = request.json['Value']['searchquery']

#         if searchquery == "all patients":
#             # Fetch all patients and convert the QuerySet to a list of dictionaries
#             patient_list = list(Users.objects.all().as_pymongo())
#             return json_util.dumps(patient_list)
#         elif searchquery == "":
#             return json_util.dumps([])

#         # Construct the regex pattern
#         regexPattern = re.compile('^' + searchquery, re.IGNORECASE)

#         # Find all patients from the database
#         all_patients = list(Users.objects.all().as_pymongo())

#         # Filter patients with lastnames matching the regex pattern
#         matched_patients = [patient for patient in all_patients if regexPattern.search(patient['patientname'].split()[-1])]

#         if matched_patients:
#             print('Matching patients:', len(matched_patients))
#             return json_util.dumps(matched_patients)
#         else:
#             print('No matching patients found')
#             return json_util.dumps([])

#     except Exception as e:
#         print('Error searching patients:', e)
#         return jsonify({'message': 'Internal Server Error'}), 500


# Edit Profile 





# @app.route('/edit/<string:_id>', methods=['POST'])
# def edit_patient(_id):
#     try:
#         patient_id = ObjectId(_id)

#         data = request.json
#         print(data)

#         patient = Users.objects(id=patient_id).first()
#         if not patient:
#             return jsonify({'status': 400, 'msg': 'Patient not found'})

#         patient.patientname = data.get('patientname', patient.patientname)
#         patient.dob = data.get('dob', patient.dob)
#         patient.dos = data.get('dateofservice', patient.dos)
#         patient.emgstudy = data.get('emgstudy', patient.emgstudy)
#         patient.report = data.get('report', patient.report)
#         patient.summary = data.get('summary', patient.summary)
#         patient.impression = data.get('impression', patient.impression)
#         patient.recommendation = data.get('recommendation', patient.recommendation)
#         patient.save()

#         # Convert ObjectId to string for JSON serialization
#         patient_data = json.loads(patient.to_json())
#         patient_data['_id'] = str(patient_data['_id'])

#         return jsonify({'status': 200, 'obj': patient_data, 'msg': 'Update profile successful'})
#     except Exception as e:
#         print(e)
#         return jsonify({'status': 500, 'msg': 'Internal Server Error'})



#  delete patients


# @app.route('/deletepatient/<string:_id>', methods=['DELETE'])
# def delete_patient(_id):
#     try:
#         patient_id = ObjectId(_id)
#         patient = Users.objects(id=patient_id).first()
#         if not patient:
#             return jsonify({'status': 404, 'msg': 'Patient not found'})

#         patient.delete()

#         return jsonify({'status': 200, 'msg': 'Patient deleted successfully'})
#     except Exception as e:
#         print(e)
#         return jsonify({'status': 500, 'msg': 'Internal Server Error'})



# Forget Password

@app.route('/forgetverify', methods=['POST'])
def forget_verify():
    try: 
        email = request.json.get('email')
        print(email , "recive in python")
        user = User.objects(email=email).first()
        if not user:
            return jsonify({'status': 400})

        Password = ''.join(random.choices(string.digits, k=5))
        
        
        sender_email = config_data['email']
        password = config_data['password']

        message = MIMEMultipart("alternative")
        message["Subject"] = "UMS Portal Verification"
        message["From"] = sender_email
        message["To"] = email
        html = f"""
        <p>Your Verification Code is:  {Password}</p>
        
        
        """

        part = MIMEText(html, "html")
        message.attach(part)

        # Send the email
        context = ssl.create_default_context()
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(sender_email, password)
            server.sendmail(sender_email, email, message.as_string())  
        return jsonify({'status': 200, 'verification': password})
    except Exception as e:
        print(e)
        return jsonify({'status': 500})

# Set password


@app.route('/UpdateUser', methods=['POST'])
def update_user():
    try:
        data = request.get_json()

        email = data.get('email', '')
        new_password = data.get('pass', '')

        # Hash the new password using bcrypt
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())

        # Find the user by email and update the password
        user = User.objects(email=email).first()
        if user:
            user.password = hashed_password.decode('utf-8')
            user.save()
            return jsonify({"status": 200, "message": "Password updated successfully"})
        else:
            return jsonify({"status": 404, "message": "User not found"})

    except Exception as e:
        print(e)
        return jsonify({"status": 500, "message": "Internal Server Error"})


#  delete Users



@app.route('/deleteUsers/<string:_id>', methods=['POST'])
def delete_User(_id):
    try:
        User_id = ObjectId(_id)
        user = User.objects(id=User_id).first()
        if not user:
            return jsonify({'status': 400, 'msg': 'User not found'})

        user.delete()

        return jsonify({'status': 200, 'msg': 'User deleted successfully'})
    except Exception as e:
        print(e)
        return jsonify({'status': 500, 'msg': 'Internal Server Error'})


#  search Users

@app.route('/SearchUser', methods=['POST'])
def search_user():
    try:
        data = request.json
        searchquery = request.json.get('Value', {}).get('searchquery', '')

        if searchquery == "all users":
            print("search works")
            # Fetch all patients and convert the QuerySet to a list of dictionaries
            patient_list = list(User.objects.all().as_pymongo())
            # print(len(patie))
            return json_util.dumps(patient_list)

        else:
            print(searchquery)
            if len(searchquery) == 0:
                return json_util.dumps([])

            regexPattern = {'$regex':'^'+ searchquery, '$options': 'i'}
            query = {
                '$or': [
                    {'firstname': regexPattern},
                    {'lastname': regexPattern}
                ]
            }

            patient_list = list(User.objects(__raw__=query).as_pymongo())  # Add more conditions if needed
            
            if len(patient_list) > 0:
                print('Matching user:' ,  len(patient_list))
                return json_util.dumps(patient_list)
            else:
                print('No matching user found')
                return json_util.dumps([])

    except Exception as e:
        print('Error searching patients:', e)
        return jsonify({'message': 'Internal Server Error'}), 500

# Check Email

@app.route('/emailcheck/<string:email>', methods=['POST'])
def email_check(email):
    try:
        check = User.objects(email=email).first()

        if check:
            return jsonify({'status': 200, 'msg': 'Email ID exists'})
        else:
            return jsonify({'status': 400, 'msg': 'Email ID does not exist'})
    except Exception as e:
        print(e)
        return jsonify({'status': 500, 'msg': 'Internal Server Error'})
    


if __name__ == '__main__':
    socketio.run(app, debug=True, host=config_data['host'], port=5000)
    # app.run(debug=False, host=config_data['host'], port=5000)
    # socketio.run(app)