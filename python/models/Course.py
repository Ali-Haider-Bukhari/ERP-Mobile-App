from bson import ObjectId
from mongoengine import Document,DecimalField, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from models.User import User
from mongoengine.errors import ValidationError 

class Course(Document):
    teacher_id = ReferenceField(User, required=False)
    course_name = StringField(required=True)
    credit_hour = DecimalField(required=True, precision=2)
    students = ListField(ReferenceField(User), required=False,default=[])

    meta = {'collection': 'courses', 'strict': True}

    def clean(self):
        teacher = User.objects.get(id=ObjectId(self.teacher_id['id']))
        if "TEACHER" not in str(teacher['role']):
            raise ValidationError("The user associated with teacher_id must have role 'TEACHER'")   
   
    @classmethod
    def insert_course(cls, teacher_id_str, course_name, credit_hour, student_ids=[]):
        try:
            # Convert teacher_id_str to a reference
            teacher = User.objects.get(id=ObjectId(teacher_id_str))
            # Convert student_ids to references
            students = User.objects.filter(id__in=[ObjectId(sid) for sid in student_ids])
            new_course = cls(teacher_id=teacher['id'], course_name=course_name, credit_hour=credit_hour, students=students)
            new_course.save()
            return new_course
        except Exception as e:
            print("An error occurred:", e)
            return None

        
    def fetch_courses_by_teacher_id(teacher_id):
        # Find all courses where the given student is enrolled
        courses = Course.objects(teacher_id=teacher_id)
        return courses
    def fetch_courses_by_student_id(student_id):
        # Find all courses where the given student is enrolled
        courses = Course.objects(students=student_id)
        return courses
    
    def append_student_to_course(course_id, student_id):
        # Find the course by its ID
        course = Course.objects(id=course_id).first()
        if course:
            # Check if the student is already enrolled in the course
            if student_id in [str(student.id) for student in course.students]:
                raise ValidationError(f"Student with ID {student_id} is already enrolled in the course.")
            
            # Find the student
            student = User.objects(id=student_id).first()
            if student:
                # Append the student to the course
                course.students.append(student)
                course.save()
                return course
            else:
                raise ValidationError(f"Student with ID {student_id} not found.")
        else:
            raise ValidationError(f"Course with ID {course_id} not found.")