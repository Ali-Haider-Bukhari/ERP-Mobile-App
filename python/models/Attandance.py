from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from mongoengine.errors import ValidationError 
from User import User
from Course import Course

class Attendance(Document):
    student_id = ReferenceField(User, required=True)
    course_id = ReferenceField(Course, required=True)
    date = DateTimeField(required=True)
    attendance_status = StringField(required=True, choices=('present', 'absent'))
    meta = {'collection': 'attandances', 'strict': True}

    def clean(self):
        # Check if the user associated with student_id has role "STUDENT"
        if self.student_id.role != "STUDENT":
            raise ValidationError("The user associated with student_id must have role 'STUDENT'")