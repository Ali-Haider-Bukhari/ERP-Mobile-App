import React, { useState, useRef,useEffect, useContext } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { Camera } from 'expo-camera';
import { Python_Url, getToken } from '../../utils/constants';
import { useNavigation } from '@react-navigation/native';

const StudentAttendance = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [ loading,setLoading] = useState(false)
  const {user} = useContext(AuthContext)
  const navigation = useNavigation();
  
  const cameraRef = useRef(null);
  let longPressTimer;

  const startRecording = async () => {
    setIsRecording(true)
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.recordAsync({ maxDuration: 3 });
        console.log('Video recorded:', uri);
        getToken().then((token)=>{
          sendVideoToBackend(uri,token)
        })
        // You can update attendanceData with the recorded video URI or any other relevant data
      } catch (error) {
        console.error('Failed to start recording', error);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false)
    }
  };

  const sendVideoToBackend = async (videoUri,token) => {
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'recorded_video.mp4',
    });

    try {
      setLoading(true)
      var response = await fetch(`${Python_Url}`+'/upload-video', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization':token
        },
      })

    
      if(response){
        setIsRecording(false);
        setLoading(false)
        const data = await response.json()
        console.log(data)
        if(data.person!=null && typeof(data.person) == "string"){
          if(data.person.includes(user.roll_number)){
            console.log(user.roll_number)
            navigation.navigate('Student_Attandance_Status', { text: "Successfully Marked" });
          }else{
            navigation.navigate('Student_Attandance_Status', { text: "Failed to Recognise" });
          }
      }
    }

      // if (!response.ok) {
      //   setIsRecording(false);
      //   throw new Error('Failed to upload video');
      // } 

      // Handle backend response if needed
    } catch (error) {
      setIsRecording(false);
      setLoading(false)
      console.error('Error uploading video to backend:', error.message);
    }
  };

  useEffect(() => {
    // Generate dummy attendance data (replace this with your actual data)
    const dummyAttendanceData = [];
    for (let i = 0; i < 15; i++) {
      dummyAttendanceData.push({
        id: i.toString(),
        studentName: `2024-04-04 10:54:21`,
        isPresent: Math.random() < 0.5, // Randomly generate present or absent
      });
    }
    setAttendanceData(dummyAttendanceData);
  }, []);

  const handlePressIn = () => {
    longPressTimer = setTimeout(() => {
      startRecording();
      setIsRecording(true);
    }, 500); // Adjust the delay for your preference
  };

  const handlePressOut = () => {
    clearTimeout(longPressTimer);
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    }
  };

  // Sample attendance data
  const onMarkAttendance = () => {
    // Logic to mark attendance
    // This is just a placeholder
    setAttendanceData([
      { id: '1', studentName: 'John Doe', isPresent: true },
      { id: '2', studentName: 'Jane Smith', isPresent: false },
      // Add more data as needed
    ]);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please allow access to Camera');
      }
    })();

    (async () => {
        const { status } = await Camera.requestMicrophonePermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Please allow access to Microphone');
        }
      })();
  }, [])

  const renderItem = ({ item ,index}) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      <Text>{index+1}</Text>
      <Text>{item.studentName}</Text>
      <Text>{item.isPresent ? 'Present' : 'Absent'}</Text>
    </View>
  );

  return (
    <>
    {loading==false?<View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Camera 
          style={{ flex: 1 }}
          type={Camera.Constants.Type.front}
          ref={cameraRef}
        />
        <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
          {isRecording ? (
            <Button color={'red'} title="Recording in progress" onPress={stopRecording} />
          ) : (
            <Button title={isRecording==true?"...Capturing":"Start Recording"} onPress={startRecording} />
          )}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', alignSelf: 'center', marginVertical: 10 }}>Attendance</Text>
        <FlatList
          data={attendanceData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          
        />
        {/* Button to mark attendance */}
        <Button title="Mark Attendance" onPress={() => console.log("Attendance marked")} />
      </View>
    </View>
    :<Loading/>}
    </>
  );
};

export default StudentAttendance;



import {StyleSheet} from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { AuthContext } from '../../contexts/AuthContext';
function Loading() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setInterval(() => {
      setVisible(!visible);
    }, 2000);
  }, []);
  return (
    <AnimatedLoader
   
      visible={visible}
      overlayColor="rgba(255,255,255,0.75)"
      animationStyle={styles.lottie}
      speed={1}>
      <Text>Face Checking...</Text>
    </AnimatedLoader>
  );
}
const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100,
  },
});