from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField

# Define schemas
class User(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    roll_number = StringField(required=False)  # In case of teacher it will be "" empty
    email = StringField(required=True, unique=True)
    role = StringField(required=True, choices=('student', 'teacher', 'admin'))

class Course(Document):
    course_name = StringField(required=True)
    teacher_id = ReferenceField(User, required=True)
    students = ListField(ReferenceField(User))

class Attendance(Document):
    student_id = ReferenceField(User, required=True)
    course_id = ReferenceField(Course, required=True)
    date = DateTimeField(required=True)
    attendance_status = StringField(required=True, choices=('present', 'absent'))

class Message(Document):
    sender_id = ReferenceField(User, required=True)
    receiver_id = ReferenceField(User, required=True)
    message_content = StringField(required=True)
    timestamp = DateTimeField(required=True)
    is_bot_message = StringField(default=False)

class Result(Document):
    student_id = ReferenceField(User, required=True)
    course_id = ReferenceField(Course, required=True)
    marks = FloatField(required=True)
    grade = StringField(required=True)
    semester = IntField(required=True)
    academic_year = IntField(required=True)
