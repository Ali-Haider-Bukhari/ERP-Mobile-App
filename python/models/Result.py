from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from mongoengine.errors import ValidationError 
from User import User
from Course import Course

class Result(Document):
    student_id = ReferenceField(User, required=True)
    teacher_id = ReferenceField(User, required=True)
    course_id = ReferenceField(Course, required=True)
    marks = FloatField(required=True)
    grade = StringField(required=True)
    semester = IntField(required=True)
    academic_year = IntField(required=True)

    meta = {'collection': 'results', 'strict': True}

    def clean(self):
        # Check if the user associated with student_id has role "STUDENT"
        if self.student_id.role != "STUDENT":
            raise ValidationError("The user associated with student_id must have role 'STUDENT'")
        
        if self.teacher_id.role != "TEACHER":
            raise ValidationError("The user associated with teacher_id must have role 'Teacher'")