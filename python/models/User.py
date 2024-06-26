from bson import ObjectId
from mongoengine import Document, StringField, DateField,ReferenceField, ListField, FloatField, IntField, DateTimeField,EmailField,EnumField
from enum import Enum
from mongoengine.errors import ValidationError 
import jwt
import datetime
import bcrypt

class UserRoleEnum(Enum):
    TEACHER = "TEACHER"
    STUDENT = "STUDENT"
    BOT = "BOT"
    ADMIN   = "ADMIN"

class UserProgramEnum(Enum):
    BSCS = "BSCS"
    BSSE = "BSSE"
    BSIT = "BSIT"
    BSDS = "BSDS"

class UserGender(Enum):
    MALE = "MALE"
    FEMALE="FEMALE"
    OTHER ="OTHER"

class User(Document):
    image = StringField(required=True,default="logo.png")
    email = EmailField(required=True, unique=True)
    password = StringField(required=True)
    username = StringField(required=True, unique=True)
    roll_number = StringField(required=True,default="")  # In case of teacher it will be "" empty
    role = EnumField(UserRoleEnum, required=True)
    contact = StringField(required=True)
    program = EnumField(UserProgramEnum,required=True)
    gender = EnumField(UserGender,required=True)
    image = StringField(required=False)
    cnic = StringField(required=False)
    blood_group = StringField(required=False)
    address = StringField(required=False)
    semester=StringField(required=False)
    date_of_birth=StringField(required=False)
    meta = {'collection': 'users', 'strict': True}
 
    def clean(self): # Validations
            
        if "STUDENT" in str(self.role) and self.roll_number == "":
            raise ValidationError("user with role STUDENT must have his roll_number")
        if "TEACHER" in str(self.role) and len(self.roll_number) > 0:
            raise ValidationError("user with roll TEACHER cannot hace roll_number")

    JWT_SECRET = 'FYP-BCSM-001'

    @staticmethod
    def fetch_by_id(user_id):
            user = User.objects(id=ObjectId(user_id)).first()
            return user
    
    @staticmethod
    def update_user(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        try:
            self.validate()
        except ValidationError as e:
            raise ValidationError(str(e))
        self.save()

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