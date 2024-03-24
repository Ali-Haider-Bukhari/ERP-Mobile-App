import React,{useContext, useEffect,useState} from 'react';
import { View,ScrollView,TouchableOpacity, Text,ProgressBarAndroid, ActivityIndicator , Button ,StyleSheet ,SafeAreaView, Image, ToastAndroid} from 'react-native';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Python_Url, getToken, removeToken } from '../../utils/constants';
import { AlertComponent } from '../../components/Alert';
import { useNavigation } from '@react-navigation/native';
import StudentGradingScreen from './StudentGradingScreen';
import { courseStyles } from './Styles';
import TeacherMarkingScreen from './Teacher_Marking';
import Students from '../ViewAttandance/student';
import CourseStudents from './Students';




export default function ResultsExamsScreen() {
const navigation = useNavigation();
const {user,logout} = useContext(AuthContext)
const {courses,setCourses,selectedCourse,setSelectedCourse} = useGlobalContext()

const [showStudents , setShowStudents] = useState(false)
const [loading, setLoading] = useState(true)




// for students

    async function getCoursesstudents(token){
        
    try {
        const url = `${Python_Url}/courses_student/${user._id.$oid}`
        console.log(url , "url")
        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: token,
          }
        });
    
        const data = await response.json();
    
        if (response.ok) {
          // Handle successful response
          // console.log('Response data:', response);
          setCourses(data)
          setLoading(false)
        } else {
          // Handle error response
          if(data.message == "Token has expired"){
            AlertComponent({
                title:'Message',
                message:'Session Expired!!',
                turnOnOkay:false,
                onOkay:()=>{},
                onCancel:()=>{
                  logout()
                }},)
          }
          console.error('Error:', data);
          setLoading(false)
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
        setLoading(false)
      }
}


// for Teacher 

async function getCoursesbyteacher(token){
        
  try {
      const url = `${Python_Url}/courses_teacher/${user._id.$oid}`
      // console.log(url , "url")
      const response = await fetch(url, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: token,
        }
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Handle successful response
        // console.log('Response data:', response);
        setCourses(data)
        setLoading(false)
      } else {
        // Handle error response
        if(data.message == "Token has expired"){
          AlertComponent({
              title:'Message',
              message:'Session Expired!!',
              turnOnOkay:false,
              onOkay:()=>{},
              onCancel:()=>{
                logout()
              }},)
        }
        console.error('Error:', data);
        setLoading(false)
      }
    } catch (error) {
      // Handle network or other errors
      console.error('Error:', error);
      setLoading(false)
    }
}



useEffect(() => {
  if(user?.role == "STUDENT"){
    console.log("Students  api call")
    getToken()
    .then((token) => {getCoursesstudents(token)})
  }else if (user?.role == "TEACHER"){
    console.log("Teacher  api call")
    getToken()
    .then((token) => {getCoursesbyteacher(token)})
  }
}, [user])

const handleCourseClick = (item) => {
  setShowStudents(true)
 setSelectedCourse(item)
};


  return (
    <>
     
{user.role=="STUDENT" && selectedCourse!=null?<StudentGradingScreen course_id={selectedCourse?.course_id} setSelected={(value)=>{setSelectedCourse(null)}}/>
:user.role=="TEACHER" && showStudents?<CourseStudents  students={selectedCourse?.students}  setShowStudents={setShowStudents} courseid={selectedCourse?.course_id} user={user} />
:


     <View 
     style={{
                  shadowColor: "#000",
                  shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.00,
                elevation: 24,


      backgroundColor:'white',display:'flex',alignSelf:'center'
      ,width:'85%'
      ,height:'91%'
      ,marginTop:30}}
      >


{loading ? (<>
        <ActivityIndicator style={courseStyles.activityIndicator} size="large" color="#0000ff" />
      
      </>):(<>



     <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {courses.map((data, index) => (
          <TouchableOpacity key={index} style={courseStyles.courseItem} onPress={() => handleCourseClick(data)}>
            <View style={courseStyles.courseHeader}>
              <View style={courseStyles.semesterBadge}>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{"SPRING 2024"}</Text>
              </View>
              <Text style={courseStyles.courseHeaderText}>{data.course_name}</Text>
              <Text style={courseStyles.courseInfo}>{"Credit Hrs: " + data.credit_hour}</Text>
            </View>
            <View style={courseStyles.attendanceContainer}>
              <View style={courseStyles.attendanceText}>
                <Text>{"Attandance: " + "92" + "%"}</Text>
              </View>
              <ProgressBarAndroid
                styleAttr="Horizontal"
                indeterminate={false}
                color={"rgba(12,184,70,255)"}
                style={{ width: '85%', position: 'relative', bottom: 5 }}
                progress={0.5}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      </>)}
    </View>

}
    
    </>
  )
}

