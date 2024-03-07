from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField
from models.User import User
from mongoengine.errors import ValidationError 

class Course(Document):
    teacher_id = ReferenceField(User, required=True)
    course_name = StringField(required=True)
    credit_hour = IntField(required=True)
    students = ListField(ReferenceField(User))
    meta = {'collection': 'courses', 'strict': True}

    def clean(self):
        # Check if the user associated with teacher_id has role "TEACHER"
        if self.teacher_id.role != "TEACHER":
            raise ValidationError("The user associated with teacher_id must have role 'Teacher'")
        
    def insert_course(teacher_id, course_name, student_ids):
        # Create a new Course instance
        course = Course(teacher_id=teacher_id, course_name=course_name)

        # Add students to the course
        for student_id in student_ids:
            student = User.objects(id=student_id).first()
            if student:
                course.students.append(student)
            else:
                raise ValidationError(f"Student with ID {student_id} not found.")

        # Save the course to the database
        course.save()
        return course

        
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