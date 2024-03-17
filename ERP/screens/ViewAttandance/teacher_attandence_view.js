import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Python_Url ,  getToken} from '../../utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { AlertComponent } from "../../components/Alert";
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons from expo/vector-icons





export default function TeachersAttendanceView({ NewattendanceId , showAttandence , fetchAttendance }) {
    const [loading, setLoading] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false)
    const [loadingMap, setLoadingMap] = useState({}); // State to track loading for each item

    const [attendanceData, setAttendanceData] = useState([]);
    useEffect(() => {
        fetchAttendanceById();
      }, []);


// console.log(attendanceData , "List")



    const fetchAttendanceById = async () => {
  
  
        try {
            setLoading(true);
         
          let token = await getToken();
          const response = await fetch(`${Python_Url}/fetch_attendancebyId?_id=${NewattendanceId}` , {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              Authorization: token, 
          },
           
        });
        
          const data = await response.json();
        
          if (response.ok) {
           console.log(data ,  "data in teacher View")
          setAttendanceData(data);
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
            setError('Failed to fetch attendance data');
        } finally {
            setLoading(false);
        }
    };


// update status attandence 






      
const UpdateStatus_Attendence = async (_id , status) => {
  
  
    try {
         // Set loading to true for the clicked item
         setLoadingMap(prevLoadingMap => ({ ...prevLoadingMap, [_id]: true }));

      let token = await getToken();
      const response = await fetch(`${Python_Url}/update_student_attendance_status?attendance_id=${NewattendanceId}&student_id=${_id}&attendance_status=${status}` , {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: token, 
      },
       
    });
    
      const data = await response.json();
    
      if (response.ok) {
       console.log(data ,  " update status")

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
        console.error('Error fetching attendance:', error);
        setError('Failed to fetch attendance data');
    } finally {
          // Set loading to false for the clicked item
          setLoadingMap(prevLoadingMap => ({ ...prevLoadingMap, [_id]: false }));
    }
};


/////////////////////   when Submit Attendance ///////////////////////////////////////// 

 
const UpdateStatus_Confirm = async ( ) => {
  
  
    try {
        setSubmitLoading(true)
      let token = await getToken();
      const response = await fetch(`${Python_Url}/update_confirm_status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        body: JSON.stringify({ attendance_id: NewattendanceId, status: true }),
    });
    
      const data = await response.json();
    
      if (response.ok) {
       console.log(data ,  " update status")

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
        console.error('Error fetching attendance:', error);
        setError('Failed to fetch attendance data');
    } finally {
          // Set loading to false for the clicked item
          setSubmitLoading(false)
          showAttandence(false)
          fetchAttendance();
    }
};


// Image


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

    return (

<>
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
    <TouchableOpacity style={styles.iconButton} onPress={() => showAttandence(false)}>
        <Ionicons name="chevron-back-outline" size={30} color="black" />
        <Text style={{ fontWeight: "bold", marginLeft: 10, fontSize: 23 }}>Students</Text>
    </TouchableOpacity>

    <View style={{ flexDirection: 'row', gap: 20 }}>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchAttendanceById}>
            <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.refreshButton} onPress={() => UpdateStatus_Confirm()}>
            <Text style={styles.refreshButtonText}>{submitLoading ? 'loading..' : 'Submit'}</Text>
        </TouchableOpacity>
    </View>
</View>

 
<View style={{marginTop : 20}}>

{loading ?
        <ActivityIndicator size="large" color="#000" />
        :(
            <>
            
    

  {attendanceData?.students?.length > 0 ? (<>
               
<FlatList
            data={attendanceData?.students}
            renderItem={({ item }) => (
              
               <View style={styles.container}>
               
                    <View style={styles.card}>
                    <View style={styles.imageContainer}>
                            {renderImage(item?.image)}
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.name}>{item?.name || 'Name not found'}</Text>
                            <Text style={styles.info}>{item?.email || 'Email not found'}</Text>
                         
                        </View>
                        {loadingMap[item._id] ? (<>

    <ActivityIndicator size="large" color="#000" />


</>):(
    <>
    


                        <View style={styles.iconContainer}>
                    {/*  tick icon 'PRESENT' */}

                    <TouchableOpacity onPress={() => UpdateStatus_Attendence(item._id , 'PRESENT')} style={[styles.iconBox, { backgroundColor: 'lightgreen' }]}>
                    <MaterialIcons name="check-circle" size={24} color="green" />

                    </TouchableOpacity>
                  
                    {/*  cross icon  attendance  'ABSENT' */}

                    <TouchableOpacity onPress={() => UpdateStatus_Attendence(item._id , 'ABSENT')} style={[styles.iconBox, { backgroundColor: '#0000ff' }]}>
                    <MaterialIcons name="cancel" size={24} color="red" />
                        
                    </TouchableOpacity>
                  
                   
                  
                </View>

                </>
)}
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
        )}

</View>


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
        padding: 10,
       
      },
      refreshButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBox: {
        borderRadius: 25, // Adjust border radius for rounded corners
        padding: 6, // Adjust padding for the icon box
        margin: 6, // Adjust margin for spacing between icons
    },
    
});
