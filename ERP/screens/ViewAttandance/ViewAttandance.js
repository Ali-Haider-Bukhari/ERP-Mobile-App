import React, { useState, useEffect , useContext } from 'react';
import { View, Text, FlatList, ActivityIndicator , StyleSheet , TouchableOpacity ,  Table, TableHeader, TableRow, TableCell } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Python_Url ,  getToken} from '../../utils/constants';
import { AuthContext } from '../../contexts/AuthContext';
import { useRoute } from '@react-navigation/native';
import Students from './student';
import TeachersAttendanceView from './teacher_attandence_view';
import { AlertComponent } from "../../components/Alert";



export default function ViewAttendanceScreen() {


  const route = useRoute();
  const { courseId } = route.params;
  const navigation = useNavigation();
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStudents, setShowStudents] = useState(false);
  const [teachersView, setTeachersView] = useState(false);
  const [newAttendanceId, setNewAttendanceId] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(null);
  const {user} = useContext(AuthContext)

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {

  
  
    try {
      let token = await getToken();
      const response = await fetch(`${Python_Url}/fetch_attendance?course_id=${courseId}` , {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Authorization: token, 
      },
       
    });
    
      const data = await response.json();
    
      if (response.ok) {
       console.log(data ,  "data fetch")
      setAttendances(data);
      setLoading(false);
      } else {
        
      // Check if token has expired
      if (response.status === 401) {
        // Handle token expiration
        AlertComponent({
            title: "Message",
            message: "Session Expired!!",
            turnOnOkay: false,
            onOkay: () => {},
            onCancel: () => {
                ToastAndroid.show("Please Login to Continue", ToastAndroid.SHORT);
                removeToken();
                navigation.navigate("Login");
            },
        });
        setLoading(false)
    }
  
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setLoading(false);
    }
  };


// Insert new Attandence 


const handleInsertEmptyAttendance = async () => {
  try {
    setTeachersView(true)
    let token = await getToken();
    // Make API request to insert empty attendance record
    const response = await fetch(`${Python_Url}/insert_empty_attendance?course_id=${courseId}&date=${new Date().toISOString()}` , {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: token, 
    },
    
    });

    if (!response.ok) {
      throw new Error('Failed to insert empty attendance record');
    }

    const responseData = await response.json();


    if (response.ok) {
   console.log(responseData)
   setNewAttendanceId(responseData.attendance_id)
  
     } else {
       
     // Check if token has expired
     if (response.status === 401) {
       // Handle token expiration
       AlertComponent({
           title: "Message",
           message: "Session Expired!!",
           turnOnOkay: false,
           onOkay: () => {},
           onCancel: () => {
               ToastAndroid.show("Please Login to Continue", ToastAndroid.SHORT);
               removeToken();
               navigation.navigate("Login");
           },
       });
    
   }
 
     }



  } catch (error) {
   // Handle error
   console.error('Error inserting empty attendance record:', error);
   if (error.message === 'Attendance for this date already exists') {
     // Display custom message for duplicate attendance
     Alert.alert('Attendance Already Created', 'You have already created attendance for today.');
   } else {
     Alert.alert('Error', error.message || 'Failed to insert empty attendance record');
   }
 }
};


// Handle click on any item


const handleAttendancePress = (item) => {
  try {
    setSelectedStudents(item.students)
    setShowStudents(true)
  } catch (error) {
    console.error('Error parsing students list:', error);
  }
};


// Attendance items


  const renderAttendanceItem = ({ item }) => {

    const date = item.date.substring(0, 10); // Extracts only the date part (YYYY-MM-DD)
    if (item.confirm_status) {
    return(
      <TouchableOpacity style={styles.card} onPress={() => handleAttendancePress(item)}>
      <View style={styles.iconContainer}>
     
        <Ionicons name="snow-outline" size={30} color="black" />
      
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.cardText}>Course Name: {item.course.name}</Text>
        <Text style={styles.cardText}>Course ID: {item.course.id}</Text>
        <Text style={styles.cardText}>Date: {date}</Text>
      </View>
    </TouchableOpacity>
    )
    }else{
      return null;
    }
    }

// main section

  return (
    <View style={styles.container}>


{/* Teachers section when click to Create new Attendance */}

{teachersView ?
  <TeachersAttendanceView
    NewattendanceId= {newAttendanceId} 
    showAttandence={setTeachersView}
    fetchAttendance={fetchAttendance}
  />
:
<>




{showStudents ? (<>


{/* display Student when click  on any item */}

<Students  students={selectedStudents}  showAttandence={setShowStudents} />
</>):(
  <>
  

{/* display Attandances by course _id */}

       <View style={styles.header}>
        
       <View style={styles.iconContainer}>
        <Ionicons name="snow-outline" size={30} color="black" />
        <Text style={{   fontWeight: "bold", marginLeft : 10 , fontSize : 23}}>Attendance</Text>
      </View> 
       

{/* Create New Attendeance */}
{user?.role == "TEACHER" && (
        <TouchableOpacity style={styles.createButton} onPress={() => handleInsertEmptyAttendance()}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
)}

      </View>

      {loading ? (<>
        <ActivityIndicator style={styles.activityIndicator} size="large" color="#0000ff" />
      
      </>):(<>
        <FlatList
        data={attendances}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={() => <Text>No attendance records available</Text>}
      />

      </>)
    
 
     }
    
      </>
)} 

</>
}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: "space-between",
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  cardText: {
    fontSize: 13,
 
    marginBottom: 5,
  },
  createButton: {
    backgroundColor: '#007bff',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
