from bson import ObjectId
from mongoengine import Document,DecimalField, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from models.User import User
from mongoengine.errors import ValidationError 
from datetime import datetime

class Notification(Document):
    image = StringField(required=True, unique=True)
    headline = StringField(required=True)
    date_time = DateTimeField(default=datetime.now)

    meta = {'collection': 'Notification', 'strict': True}

    @classmethod
    def create(cls, image, headline):
        # Generate a unique image string using ObjectId
        unique_image_string = str(ObjectId())
        # Create a new Notification document
        notification = cls(image=unique_image_string, headline=headline)
        # Save the document
        notification.save()
        return notification
    
    @classmethod
    def delete(cls, notification_id):
        # Find the notification by its ID
        notification = cls.objects(id=notification_id).first()
        if notification:
            # Delete the notification
            notification.delete()
            return True
        else:
            return False