from mongoengine import Document, StringField, BooleanField , ReferenceField, ListField, FloatField, IntField, DateTimeField
from models.User import User
from mongoengine.queryset.visitor import Q

class Message(Document):
    sender_id = ReferenceField(User, required=True)
    receiver_id = ReferenceField(User, required=True)  # Added receiver_id field
    message_content = StringField(required=True)
    timestamp = DateTimeField(required=True)
    is_bot_message = BooleanField(default=False)
    meta = {'collection': 'messages', 'strict': True}







    def fetch_messages(id1, id2):
        messages = Message.objects.filter(
            (
                (Q(sender_id=id1) & Q(receiver_id=id2)) |  # sender_id = id1 and receiver_id = id2
                (Q(sender_id=id2) & Q(receiver_id=id1))    # sender_id = id2 and receiver_id = id1
            )
        ).order_by('-timestamp')
        return messages