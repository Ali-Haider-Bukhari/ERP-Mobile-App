from mongoengine import Document, StringField, EmailField, DateTimeField ,EnumField
from enum import Enum

class UserRoleEnum(Enum):
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"
    ADMIN   = "ADMIN"

class User(Document):
    name = StringField(required=True)
    email = EmailField(required=True)
    password = StringField(required=True)
    role = EnumField(UserRoleEnum, required=True)

    meta = {'collection': 'user', 'strict': False}