from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from User import User
from mongoengine.errors import ValidationError 

class Course(Document):
    teacher_id = ReferenceField(User, required=True)
    course_name = StringField(required=True)
    students = ListField(ReferenceField(User))
    meta = {'collection': 'courses', 'strict': True}

    def clean(self):
        # Check if the user associated with teacher_id has role "TEACHER"
        if self.teacher_id.role != "TEACHER":
            raise ValidationError("The user associated with teacher_id must have role 'Teacher'")