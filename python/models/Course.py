from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from User import User

class Course(Document):
    course_name = StringField(required=True)
    teacher_id = ReferenceField(User, required=True)
    students = ListField(ReferenceField(User))
    meta = {'collection': 'courses', 'strict': True}
