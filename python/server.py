
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

# print(DB_URL)
# Configure the MongoDB connection

connect(host= DB_URL)
    
##########################################################################################

@app.before_request
def keep_authenticated():
    allowed_endpoints = ['serve_image','login' ,'forget_verify' ,'set_password' ]
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
            'is_bot_message': message.is_bot_message
        }
        for message in Data_Messages
    ]
    for message in Data_Messages:
       print(message.message_content , "fetch Messages")
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
            'username': user.username,
            'email': user.email,
            'roll_number': user.roll_number,
            'role': str(user.role),  # Convert UserRoleEnum to string
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
    
    # Return success response
    return jsonify({'message': 'PDF file generated and saved successfully'})

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

    
        return jsonify(serialized_obj), 200
    else:
        return jsonify({'error': 'Result not found'}), 404




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

















if __name__ == '__main__':
    
   
    socketio.run(app, debug=True, host=config_data['host'], port=5000)
