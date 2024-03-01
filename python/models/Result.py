from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from User import User
from Course import Course

class Result(Document):
    student_id = ReferenceField(User, required=True)
    course_id = ReferenceField(Course, required=True)
    marks = FloatField(required=True)
    grade = StringField(required=True)
    semester = IntField(required=True)
    academic_year = IntField(required=True)

    meta = {'collection': 'results', 'strict': True}
