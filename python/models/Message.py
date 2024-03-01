from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from User import User

class Message(Document):
    sender_id = ReferenceField(User, required=True)
    receiver_id = ReferenceField(User, required=True)
    message_content = StringField(required=True)
    timestamp = DateTimeField(required=True)
    is_bot_message = StringField(default=False)
    meta = {'collection': 'messages', 'strict': True}
