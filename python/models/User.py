from mongoengine import Document, StringField, EmailField, DateTimeField

class User(Document):
    name = StringField(required=True)
    email = EmailField(required=True)
    password = StringField(required=True)  # Changed field name from 'pass' to 'password'
    role = StringField(required=True)

    meta = {'collection': 'user', 'strict': False}
