from bson import ObjectId
from mongoengine import Document, StringField,BooleanField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from mongoengine.errors import ValidationError 
from User import User
from Course import Course


class STUDENT(Document):
    student_id = ReferenceField(User, required=True)
    attendance_status =StringField(required=True, choices=('PRESENT', 'ABSENT','PENDING'))
    
class Attendance(Document):
    _id = StringField(primary_key=True, default=lambda: str(ObjectId()))
    course_id = ReferenceField(Course, required=True)
    date = DateTimeField(required=True)
    students = ListField(ReferenceField(STUDENT), default=[])
    confirm_status = BooleanField(required=True,default=False)
    
    meta = {'collection': 'attandances', 'strict': True}