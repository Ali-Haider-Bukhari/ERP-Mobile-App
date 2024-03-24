



import { Ionicons } from '@expo/vector-icons';
import { useState,useContext,useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View,ScrollView, Text,ProgressBarAndroid, TouchableOpacity , ActivityIndicator , StyleSheet , FlatList ,Image } from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { Python_Url, getToken, removeToken } from '../../utils/constants';
import { courseStyles } from './Styles'; // Import styles
import { AlertComponent } from '../../components/Alert';
import {ToastAndroid } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'; // Import your icon library

export default function Courses_Students() {
const navigation = useNavigation();
const {user} = useContext(AuthContext)
const {courses,setCourses} = useGlobalContext()
const [loading, setLoading] = useState(true);

const [showStudents, setShowStudents] = useState(false);
const [students , setStudents] = useState([])


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
                ToastAndroid.show("Please Login to Continue",ToastAndroid.SHORT);
                removeToken()
                navigation.navigate("Login")
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
 if (user?.role == "TEACHER"){
    console.log("Teacher  api call")
    getToken()
    .then((token) => {getCoursesbyteacher(token)})

  }
}, [user])

const handleCourseClick = (item) => {
setShowStudents(true)
setStudents(item?.students)
console.log(item?.students , "students List")
};


  return (
    <>

{showStudents ?
 (<>
 
 <Course_Student students={students} showStudents={setShowStudents}  />
 
 </>) : (<>



  
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
    </>)}   
    
  
    
    </>
  )
}




// Students



function Course_Student({ students , showStudents }) {
    const renderImage = (imageUrl) => {
        if (imageUrl) {
            return (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    onError={() => console.log("Error loading image")} // Log an error if image fails to load
                />
            );
        } else {
            // Return a default image if imageUrl is not available
            return (
                <Image
                    source={require('../../assets/chat.jpg')} // Provide path to default image
                    style={styles.image}
                />
            );
        }
    };
    // Function to handle export action
    const handleExport = async () => {
      try {
        // Prepare the student data
        const studentsData = {
          students: students.map(student => ({
            name: student.name,
            email: student.email
          }))
        };
     
          let token = await getToken();
    
        // Send POST request to the Flask API
        const response = await fetch(`${Python_Url}/export_students`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, 
          },
          body: JSON.stringify(studentsData)
        });
    const data = response.json();
        // Check if the request was successful
        if (response.ok) {
          
          // Handle successful response (e.g., show success message)
          console.log('Excel file generated successfully');
        } else {
          // Handle error response (e.g., show error message)
           // Handle error response
        if(data.message == "Token has expired"){
          AlertComponent({
              title:'Message',
              message:'Session Expired!!',
              turnOnOkay:false,
              onOkay:()=>{},
              onCancel:()=>{
                ToastAndroid.show("Please Login to Continue",ToastAndroid.SHORT);
                removeToken()
                navigation.navigate("Login")
              }},)
        }
          const errorData = await response.json();
          console.error('Export failed:', errorData.error);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error('Export failed:', error);
      }
    };
    
    return (

<>
<TouchableOpacity style={styles.iconButton} onPress={() => showStudents(false)}>
    <Ionicons name="chevron-back-outline" size={30} color="black" />
    <Text style={{   fontWeight: "bold", marginLeft : 10 , fontSize : 23}}>Students</Text>
  </TouchableOpacity>

{/* Export Students in Xlxs */}

  <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
  <Icon name="download" size={20} color="#fff" />
                <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 10 }}>Export</Text>
            </TouchableOpacity>
  
  {students?.length > 0 ? (<>
               
<FlatList
            data={students}
            renderItem={({ item }) => (
              
               <View style={styles.container}>
               
                    <View style={styles.card}>
                    <View style={styles.imageContainer}>
                            {renderImage(item.image)}
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.name}>{item.name || 'Name not found'}</Text>
                            <Text style={styles.info}>{item.email || 'Email not found'}</Text>
                        </View>
                    </View>
                     
              
                </View>
            )}
            keyExtractor={(item, index) => index.toString()} // Use index as key
        />
          </>) : (
                    <>
                    <Text style={{alignItems : 'center' , alignSelf : 'center' , color : 'black'}}>
                        No Students Founds.
                    </Text>
                    
                    </>
                )}
</>

    );
}







const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        // marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageContainer: {
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40, // Make the image rounded
        marginRight: 10,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 14,
        marginBottom: 3,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 20,
    },
    exportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50', // Green color for export button
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginTop: 20,
        marginRight: 20,
        alignSelf: 'flex-end',
    },


});
