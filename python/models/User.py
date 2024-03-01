from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField,EmailField,EnumField
from enum import Enum

class UserRoleEnum(Enum):
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"
    ADMIN   = "ADMIN"

class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    username = StringField(required=True, unique=True)
    roll_number = StringField(required=False)  # In case of teacher it will be "" empty
    role = EnumField(UserRoleEnum, required=True)
    meta = {'collection': 'users', 'strict': True}