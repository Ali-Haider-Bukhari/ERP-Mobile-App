from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField,EmailField,EnumField
from enum import Enum
import jwt
import datetime
import bcrypt

class UserRoleEnum(Enum):
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"
    BOT = "BOT"
    ADMIN   = "ADMIN"

class User(Document):
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    username = StringField(required=True, unique=True)
    roll_number = StringField(required=False)  # In case of teacher it will be "" empty
    role = EnumField(UserRoleEnum, required=True)
    meta = {'collection': 'users', 'strict': True}

    JWT_SECRET = 'FYP-BCSM-001'

    @staticmethod
    def generate_token(user_id):
            payload = {
                'user_id': str(user_id),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expiration time
            }
            token = jwt.encode(payload, User.JWT_SECRET, algorithm='HS256')
            return token
             # return token.decode('utf-8')

    @staticmethod
    def login_user(email, password):
        user = User.objects(email=email).first()
        if user and bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
            token = User.generate_token(user.id)
            return token
        return None

    @staticmethod
    def verify_token(token):
        try:
            payload = jwt.decode(token, User.JWT_SECRET, algorithms=['HS256'])
            user_id = payload['user_id']
            user = User.objects(id=user_id).first()
            return user
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None

    @staticmethod
    def register(email, password, username, role, roll_number=""):
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user = User(email=email, password=hashed_password, username=username, role=role, roll_number=roll_number)
        user.save()
        return user
        





# jwt_token = User.login_user(email="user@example.com", password="password123")
# if jwt_token:
#     print("JWT token:", jwt_token)
# else:
#     print("Authentication failed")

# # Verify JWT token
# user = User.verify_token(jwt_token)
# if user:
#     print("Authenticated user:", user.username)
# else:
#     print("Invalid token or token expired")