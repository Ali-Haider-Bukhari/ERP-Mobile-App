import React, { useState, useRef,useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { Camera } from 'expo-camera';

const StudentAttendance = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const cameraRef = useRef(null);

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.recordAsync({ maxDuration: 5 });
        console.log('Video recorded:', uri);
        // You can update attendanceData with the recorded video URI or any other relevant data
      } catch (error) {
        console.error('Failed to start recording', error);
      }
    }
  };

  const stopRecording = async () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
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

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
      <Text>{item.studentName}</Text>
      <Text>{item.isPresent ? 'Present' : 'Absent'}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Camera
          style={{ flex: 1 }}
          type={Camera.Constants.Type.back}
          ref={cameraRef}
        />
        <View style={{ position: 'absolute', bottom: 20, alignSelf: 'center' }}>
          {isRecording ? (
            <Button title="Stop Recording" onPress={stopRecording} />
          ) : (
            <Button title="Start Recording" onPress={startRecording} />
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
        <Button title="Mark Attendance" onPress={onMarkAttendance} />
      </View>
    </View>
  );
};

export default StudentAttendance;
