from bson import ObjectId
from mongoengine import Document,DecimalField, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from models.User import User
from mongoengine.errors import ValidationError 
from datetime import datetime

class Alert(Document):
    user_id = ReferenceField(User, required=True)
    image = StringField(required=True, unique=True)
    headline = StringField(required=True)
    date_time = DateTimeField(default=datetime.now)

    meta = {'collection': 'alerts', 'strict': True}

    @classmethod
    def create(cls, user_id, image, headline):
        # Generate a unique image string using ObjectId
        unique_image_string = str(ObjectId())
        # Create a new Alert document
        alert = cls(user_id=user_id, image=unique_image_string, headline=headline)
        # Save the document
        alert.save()
        return alert
    
    @classmethod
    def delete(cls, alert_id):
        # Find the alert by its ID
        alert = cls.objects(id=alert_id).first()
        if alert:
            # Delete the alert
            alert.delete()
            return True
        else:
            return False
        
    @classmethod
    def fetch_by_user_id(cls, user_id):
        # Retrieve all alerts for a given user_id
        alerts = cls.objects(user_id=user_id).all()
        return alerts