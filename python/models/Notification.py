from bson import ObjectId
from mongoengine import Document,DecimalField, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from models.User import User
from mongoengine.errors import ValidationError 
from datetime import datetime

class Notification(Document):
    image = StringField(required=True)
    headline = StringField(required=True)
    date_time = DateTimeField(default=datetime.now)

    meta = {'collection': 'Notification', 'strict': True}