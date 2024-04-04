import React, { useState, useEffect, useContext } from 'react';
import { View, TextInput, Button, FlatList, Text, Alert, Image, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Python_Url, getToken } from '../../utils/constants';
import { AuthContext } from '../../contexts/AuthContext';

export default function PushNotification() {
  const [notifications, setNotifications] = useState([]);
  const [headline, setHeadline] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const {logout} = useContext(AuthContext)
  const [selectedMimeType,setSelectedMimeType] = useState(null)
  const [imageURIs,setimageURIs] = useState({}) 
  useEffect(() => {
    const fetchImagePromises = notifications.map(notification =>
      fetch(`${Python_Url}/fetch_image/${notification.image}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }
          return response;
        })
        .then(response => response.url)
        .catch(error => {
          console.error(error);
          ToastAndroid.show("Internet Issue Detected, Try Again", ToastAndroid.SHORT);
        })
    );
  
    Promise.all(fetchImagePromises)
      .then(imageUrls => {
        const updatedImageURIs = {};
        notifications.forEach((notification, index) => {
          updatedImageURIs[notification.image] = imageUrls[index];
        });
        setimageURIs(updatedImageURIs);
      })
      .catch(error => console.error('Error fetching images:', error));
  }, [notifications])

  // useEffect(() => {
  //   console.log(imageURIs,"URIs")
  // }, [imageURIs])
  


  

  useEffect(() => {
    
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Please allow access to photo library');
        }
      })();
   
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    getToken().then((token)=>{
        fetch(`${Python_Url}/notifications`,{
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization:token,
            },
          })
          .then(response => response.json())
          .then(data => {
            if(data.message == "Token has expired")
              AlertComponent({
                title:'Message',
                message:'Session Expired!!',
                turnOnOkay:false,
                onOkay:()=>{},
                onCancel:()=>{logout()}})
            else
              {setNotifications(JSON.parse(data));}})
          .catch(error => console.error('Error fetching notifications:', error));
    });
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result['assets'][0]['uri']);
      setSelectedMimeType(result.assets[0].mimeType)
    }    
  };

  const handleInsert = () => {
    if (!selectedImage || !headline) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const formData = new FormData();
        formData.append('image', {
          uri: selectedImage,
          type: selectedMimeType, 
          name: 'photo.jpg',
        });

    getToken().then((token)=>{
      fetch(`${Python_Url}/insertNotification/${headline}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token,
        },
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        if(data.message == "Token has expired")
              AlertComponent({
                title:'Message',
                message:'Session Expired!!',
                turnOnOkay:false,
                onOkay:()=>{},
                onCancel:()=>{logout()}})
        else{
        Alert.alert('Success', 'Notification inserted successfully');
        setSelectedImage(null);
        setHeadline('');
        fetchNotifications();}
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to insert notification');
      });
    })
  };

  const handleDelete = (notificationId) => {
    getToken().then((token)=>{
      fetch(`${Python_Url}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization:token
        },
      })
      .then(response => response.json())
      .then(data => {
        if(data.message == "Token has expired")
          AlertComponent({
            title:'Message',
            message:'Session Expired!!',
            turnOnOkay:false,
            onOkay:()=>{},
            onCancel:()=>{logout()}})
        else
          fetchNotifications();
      })
      .catch(error => {
        Alert.alert('Error', 'Failed to delete notification');
      });
    })
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationContainer}>
      <View style={styles.notificationContent}>
        <Text style={styles.headline}>{item.headline}</Text>
        <Image source={{uri:imageURIs[item.image]}} style={styles.image} />
        <Text style={styles.dateTime}>{item.date_time}</Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.imagePickerContainer}>
        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.selectedImage} />}
        <Button title="Pick an image from camera roll" onPress={handlePickImage} />
      </View>
      <TextInput
        placeholder="Headline"
        value={headline}
        onChangeText={text => setHeadline(text)}
        style={styles.headlineInput}
      />
      <Button
        title="Insert Notification"
        onPress={handleInsert}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.flatList}
      />
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    imagePickerContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    selectedImage: {
      width: 200,
      height: 200,
    },
    headlineInput: {
      marginBottom: 10,
    },
    flatList: {
      marginTop: 20,
    },
    notificationContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
      padding: 10,
      backgroundColor: '#ffffff', // Change background color to white
      borderRadius: 10,
      elevation: 2, // Add elevation for shadow effect (Android only)
      shadowColor: '#000', // Add shadow color (iOS only)
      shadowOffset: { width: 0, height: 2 }, // Add shadow offset (iOS only)
      shadowOpacity: 0.25, // Add shadow opacity (iOS only)
      shadowRadius: 3.84, // Add shadow radius (iOS only)
    },
    notificationContent: {
      flex: 1,
    },
    headline: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    image: {
      width: 100,
      height: 100,
      marginBottom: 5,
    },
    dateTime: {
      fontSize: 12,
      color: '#666',
    },
    deleteButton: {
      backgroundColor: 'red',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });