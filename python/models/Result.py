from bson import ObjectId
from mongoengine import Document, StringField, ReferenceField, ListField, FloatField, IntField, DateTimeField,EnumField
from mongoengine.errors import ValidationError 
from mongoengine import DoesNotExist
from models.User import User
from models.Course import Course
from enum import Enum

class ObjectofAssessment(Document):
    total_marks = FloatField(required=True)
    obtained_marks = FloatField(required=True)
    weightage = FloatField(required=True)

class GradeEnum(Enum):
    APlus="A+"
    A = "A"
    BPlus = "B+"
    B = "B"
    BMinus="B-"
    C="C"
    CMinus="C-"
    D="D"
    DMinus="D-"
    E="E"
    F="F"

class Result(Document):
    student_id = ReferenceField(User, required=True)
    teacher_id = ReferenceField(User, required=True)
    course_id = ReferenceField(Course, required=True)
    quiz = ListField(ReferenceField(ObjectofAssessment), default=[])
    assignment = ListField(ReferenceField(ObjectofAssessment), default=[])
    mid_term = ReferenceField(ObjectofAssessment,required=True)
    final_term = ReferenceField(ObjectofAssessment,required=True)
    totalmarks = ReferenceField(ObjectofAssessment)
    grade = EnumField(GradeEnum)
    academic_year = IntField(required=True)

    meta = {'collection': 'results', 'strict': True}

    def clean(self):
        
        student = User.objects.get(id=ObjectId(self.student_id['id']))
        if "STUDENT" not in str(student['role']):
            raise ValidationError("The user associated with student_id must have role 'STUDENT'")
        
        teacher = User.objects.get(id=ObjectId(self.teacher_id['id']))
        if "TEACHER" not in str(teacher['role']):
            raise ValidationError("The user associated with teacher_id must have role 'Teacher'")
        
        super().clean()
        total_weightage = 0
        for assessment_type in ['quiz', 'assignment']:
            for assessment in getattr(self, assessment_type):
                total_weightage += assessment.weightage
        total_weightage += self.mid_term.weightage + self.final_term.weightage

        if total_weightage != 100:
            raise ValidationError("Total weightage must be 100.")
        
        self.calculate_marks()
        self.determine_grade()
        

    def calculate_marks(self):
        total_marks = 0
        
        # Calculating marks for quizzes
        for quiz in self.quiz:
            total_marks += (quiz.obtained_marks / quiz.total_marks) * quiz.weightage
        
        # Calculating marks for assignments
        for assignment in self.assignment:
            total_marks += (assignment.obtained_marks / assignment.total_marks) * assignment.weightage
        
        # Adding mid-term marks
        if self.mid_term:
            total_marks += (self.mid_term.obtained_marks / self.mid_term.total_marks) * self.mid_term.weightage
        
        # Adding final-term marks
        if self.final_term:
            total_marks += (self.final_term.obtained_marks / self.final_term.total_marks) * self.final_term.weightage
        
        # Storing the calculated marks
        self.marks = total_marks

    def determine_grade(self):
        if self.marks >= 85:
            self.grade = GradeEnum.APlus
        elif self.marks >= 80:
            self.grade = GradeEnum.A
        elif self.marks >= 75:
            self.grade = GradeEnum.BPlus
        elif self.marks >= 71:
            self.grade = GradeEnum.BMinus
        elif self.marks >= 68:
            self.grade = GradeEnum.B
        elif self.marks >= 64:
            self.grade = GradeEnum.C
        elif self.marks >= 61:
            self.grade = GradeEnum.CMinus
        elif self.marks >= 58:
            self.grade = GradeEnum.D
        elif self.marks >= 53:
            self.grade = GradeEnum.DMinus
        elif self.marks >= 50:
            self.grade = GradeEnum.E
        else:
            self.grade = GradeEnum.F
        

    def create_result(student_id, teacher_id, course_id, quiz, assignment, mid_term, final_term, academic_year):
        result = Result(
            student_id=student_id,
            teacher_id=teacher_id,
            course_id=course_id,
            quiz=quiz,
            assignment=assignment,
            mid_term=mid_term,
            final_term=final_term,
            academic_year=academic_year
        )
        result.save()
        return result
    
    def read_result(course_id,student_id):
        try:
            result = Result.objects.get(course_id=ObjectId(course_id),student_id=ObjectId(student_id))
            return result
        except DoesNotExist:
            return []
        
    def append_quiz(self, quiz):
        self.quiz.append(quiz)
        self.calculate_marks()
        self.determine_grade()
        self.save()

    def append_assignment(self, assignment):
        self.assignment.append(assignment)
        self.calculate_marks()
        self.determine_grade()
        self.save()

    def to_json(self):
        return {
            'student_id': str(self.student_id.id),
            'teacher_id': str(self.teacher_id.id),
            'course_id': str(self.course_id.id),
            'quiz': [assessment.to_json() for assessment in self.quiz],
            'assignment': [assessment.to_json() for assessment in self.assignment],
            'mid_term': self.mid_term.to_json() if self.mid_term else None,
            'final_term': self.final_term.to_json() if self.final_term else None,
            'totalmarks': self.totalmarks.to_json() if self.totalmarks else None,
            'grade': self.grade.value,
            'academic_year': self.academic_year
        }
    # @classmethod
    # def insert_result(cls, student_id_str, teacher_id_str, course_id_str, marks, grade, semester, academic_year):
    #     try:
    #         # Convert string IDs to ObjectId
    #         student_id = ObjectId(student_id_str)
    #         teacher_id = ObjectId(teacher_id_str)
    #         course_id = ObjectId(course_id_str)
            
    #         # Create a new Result document
    #         result = cls(
    #             student_id=student_id,
    #             teacher_id=teacher_id,
    #             course_id=course_id,
    #             marks=marks,
    #             grade=grade,
    #             semester=semester,
    #             academic_year=academic_year
    #         )
    #         # Save the new Result document to the database
    #         result.save()
    #         return result.to_json()  # Convert result to JSON format before returning
    #     except Exception as e:
    #         return {'error': str(e)}
        
    # @classmethod
    # def fetchResults(cls, student_id_str, teacher_id_str, course_id_str):
    #     try:
    #         # Convert string IDs to ObjectId
    #         student_id = ObjectId(student_id_str)
    #         teacher_id = ObjectId(teacher_id_str)
    #         course_id = ObjectId(course_id_str)
            
    #         # Retrieve the result from the database
    #         result = cls.objects.get(student_id=student_id, teacher_id=teacher_id, course_id=course_id)
    #         return result.to_json()  # Convert result to JSON format before returning
    #     except DoesNotExist:
    #         return []