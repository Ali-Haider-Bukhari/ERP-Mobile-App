import json
from bson import ObjectId
from mongoengine import Document,DecimalField, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from models.User import User
from mongoengine.errors import ValidationError 
from datetime import datetime

class Notification(Document):
    image = StringField(required=True, unique=True)
    headline = StringField(required=True)
    date_time = DateTimeField(default=datetime.now)

    meta = {'collection': 'notifications', 'strict': True}

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
    def fetch_all(cls):
        # Retrieve all notifications from the database
        notifications = cls.objects().all()
        print(notifications,"notifications")
        # Convert QuerySet to a list of dictionaries
        notification_dicts = [{"id": str(notification.id), "image": notification.image, "headline": notification.headline, "date_time": str(notification.date_time)} for notification in notifications]

        # Serialize list of dictionaries to JSON
        serialized_notifications = json.dumps(notification_dicts)

        return serialized_notifications