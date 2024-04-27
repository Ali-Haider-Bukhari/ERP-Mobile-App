from bson import ObjectId
from mongoengine import Document, StringField,BooleanField, EmbeddedDocumentField , EmbeddedDocument ,  ReferenceField, ListField, FloatField, IntField, DateTimeField
from mongoengine.errors import ValidationError 
from models.User import User
from models.Course import Course
from datetime import datetime


class STUDENT(EmbeddedDocument):
    student_id = ReferenceField(User, required=True)
    attendance_status = StringField(required=True, choices=('PRESENT', 'ABSENT', 'PENDING'))

class Attendance(Document):
   
    course_id = ReferenceField(Course, required=True)
    date = DateTimeField(required=True)
    students = ListField(EmbeddedDocumentField(STUDENT), default=[])
    confirm_status = BooleanField(required=True, default=False)

    meta = {'collection': 'attandances', 'strict': True}

    @classmethod
    def insert_empty(cls, course_id, date):
 
        
        # Instantiate an empty Attendance object with the generated _id
        empty_attendance = cls( course_id=course_id, date=date)

        # Save the empty Attendance object to the database
        empty_attendance.save()

        return empty_attendance
    
    
    def fetch_attendance_by_course_id_sorted(course_id):
        # Find all attendance records for the given course ID, sorted by date
        attendances = Attendance.objects(course_id=course_id).order_by('date')

        serialized_obj = []
        for obj in attendances:
            serialized_students = []
            for student_info in obj.students:
                student_id = student_info.student_id  # Extract student_id from the embedded object
                attendance_status = student_info.attendance_status  # Extract attendance_status from the embedded object
                
                serialized_students.append({
                    'name': student_id.username,
                     'email': student_id.email,
                    #   'role': student_id.role,
                       'address': student_id.address,
                        'blood_group': student_id.blood_group,
                         'date_of_birth': student_id.date_of_birth,
                          'gender': student_id.gender,
                           'image': student_id.image,
                         'program': student_id.program,
                          'contact': student_id.contact,
                    'attendance_status': attendance_status
                })

            serialized_obj.append({
                '_id': str(obj.id),
                'course': {
                    'id': str(obj.course_id.id),
                    'name': obj.course_id.course_name  # Assuming Course has a 'course_name' field
                },
                'date': str(obj.date),
                'students': serialized_students,
                'confirm_status': obj.confirm_status
            })

        return serialized_obj
    

    @classmethod
    def append_student_to_latest_unconfirmed_attendance(cls, course_id, student_id, attendance_status):
        # Find the latest unconfirmed attendance record for the given course ID
        latest_attendance = cls.objects(course_id=course_id, confirm_status=False).order_by('-date').first()

        if latest_attendance:
            # Check if the student is already in the attendance list
            for student_info in latest_attendance.students:
                if student_info.student_id == student_id:
                    return False  # Student already exists in the attendance list

            # Append the new student to the latest attendance record
            new_student = STUDENT(student_id=student_id, attendance_status=attendance_status)
            latest_attendance.students.append(new_student)
            latest_attendance.save()
            return True  # Student successfully appended to attendance list
        else:
            return False
