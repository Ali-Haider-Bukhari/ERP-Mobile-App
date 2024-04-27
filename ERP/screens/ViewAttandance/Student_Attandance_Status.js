import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from Expo Vector Icons
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const StudentAttendanceStatus = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { text } = route.params;

    const onPressBack = () =>{
        navigation.navigate('Drawer')
    }


  return (
    <View style={styles.container}>
      <TouchableOpacity color="white" style={styles.backButton} onPress={onPressBack}>
        <FontAwesome name="arrow-left" size={44} color="white" />
      </TouchableOpacity>
      <View style={styles.fullScreen}>
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    color:'white',
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    zIndex: 1,
  },
  fullScreen: {
    backgroundColor: 'rgba(133, 0, 99, 1)', // Use your color value
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white', // Text color
    fontSize: 24,
  },
});

export default StudentAttendanceStatus;