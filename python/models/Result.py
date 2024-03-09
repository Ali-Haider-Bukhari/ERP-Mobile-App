from bson import ObjectId
from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from mongoengine.errors import ValidationError 
from mongoengine import DoesNotExist
from models.User import User
from models.Course import Course

class Result(Document):
    student_id = ReferenceField(User, required=True)
    teacher_id = ReferenceField(User, required=True)
    course_id = ReferenceField(Course, required=True)
    marks = FloatField(required=True)
    grade = StringField(required=True)
    academic_year = IntField(required=True)

    meta = {'collection': 'results', 'strict': True}

    def clean(self):
        
        student = User.objects.get(id=ObjectId(self.student_id['id']))
        if "STUDENT" not in str(student['role']):
            raise ValidationError("The user associated with student_id must have role 'STUDENT'")
        
        teacher = User.objects.get(id=ObjectId(self.teacher_id['id']))
        if "TEACHER" not in str(teacher['role']):
            raise ValidationError("The user associated with teacher_id must have role 'Teacher'")
        

    @classmethod
    def insert_result(cls, student_id_str, teacher_id_str, course_id_str, marks, grade, semester, academic_year):
        try:
            # Convert string IDs to ObjectId
            student_id = ObjectId(student_id_str)
            teacher_id = ObjectId(teacher_id_str)
            course_id = ObjectId(course_id_str)
            
            # Create a new Result document
            result = cls(
                student_id=student_id,
                teacher_id=teacher_id,
                course_id=course_id,
                marks=marks,
                grade=grade,
                semester=semester,
                academic_year=academic_year
            )
            # Save the new Result document to the database
            result.save()
            return result.to_json()  # Convert result to JSON format before returning
        except Exception as e:
            return {'error': str(e)}
        
    @classmethod
    def fetchResults(cls, student_id_str, teacher_id_str, course_id_str):
        try:
            # Convert string IDs to ObjectId
            student_id = ObjectId(student_id_str)
            teacher_id = ObjectId(teacher_id_str)
            course_id = ObjectId(course_id_str)
            
            # Retrieve the result from the database
            result = cls.objects.get(student_id=student_id, teacher_id=teacher_id, course_id=course_id)
            return result.to_json()  # Convert result to JSON format before returning
        except DoesNotExist:
            return []