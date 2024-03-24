import React, { useEffect, useState , useRef, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator , Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from "./Styles";
const ChatsImage = require("../../assets/chat.jpg");
import { AlertComponent } from '../../components/Alert';
import { Python_Url } from '../../utils/constants';
import { AuthContext} from '../../contexts/AuthContext';



const ChatScreen = ({ teacher, goback, user, handleSendMessage, inputText, setInputText, messages, setMessages, socket }) => {
  const [isLoading, setIsLoading] = useState(true);
  const {logout} = useContext(AuthContext)

  const scrollViewRef = useRef();

  useEffect(() => {
    if (!socket) return;

    const chatId = teacher?._id;
    socket.emit('fetch_messages', { chatId });

    socket.on('fetched_messages', (fetchedMessages) => {
      setMessages(fetchedMessages);
    
      setIsLoading(false);
    });

    return () => {
      socket.off('fetched_messages');
    };
  }, [socket, teacher]);


  // console.log(messages , "messages")
// Scroll when new messages comes////

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true }); // Scroll to the end when messages update
    }
  }, [messages]);

  const [imageUri,setImageUri] = useState("")

  useEffect(() => {
    // Define the URL of your Flask API
    if(user!=null){

      fetch(`${Python_Url}/fetch_image/${user.image}`,{method: 'GET'})
      .then(response => { 
        // Check if the response was successful
        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }
        return response;
      })
      .then(response => {
        // Set the image URI from the response
        // console.log(response)
        setImageUri(response.url);
      }) 
      .catch(error => {
        console.error(error);
      });
  
    
    }
  }, [user]);
  

  return (
    <View style={styles.container}>

{/* chat header */}

<View style={styles.header}>

  <View style={{flexDirection: 'row'}} >
  <TouchableOpacity style={styles.iconButton} onPress={() => goback(null)}>
    <Ionicons name="chevron-back-outline" size={30} color="black" />
  </TouchableOpacity>

      <Image source={imageUri!=""?{uri:imageUri}:require('../../assets/logo.png')} style={styles.userImage} />
   

  <View>
  <Text style={styles.headerText}>
    {teacher.username}
    </Text>
  <Text style={styles.headersubtext}>User Typing....</Text>
  </View>
 
  </View>
 



</View>


{/* My Messages Section */}
<ScrollView
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      style={{ flex: 1, paddingHorizontal: 10 }}
    >
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        messages.map((message, index) => (
          <View key={index} style={{ alignItems: message.sender._id === user._id.$oid ? 'flex-end' : 'flex-start' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 }}>
              
              {/* for right side  sender */}
              
              {message.sender._id === user._id.$oid && (
                <Text style={{ fontSize: 10, marginRight: 5, color: '#888' }}>{message.sender.name}</Text>
              )}
             
              {message.sender._id === user._id.$oid && (
                <Image source={ChatsImage} style={{ width: 20, height: 20, borderRadius: 10 }} />
              )}


              {/* for left side reciever */}
               {message.sender._id !== user._id.$oid && (
                <Image source={ChatsImage} style={{ width: 20, height: 20, borderRadius: 10 , marginTop: 6 }} />
              )}
                 {message.sender._id !== user._id.$oid && (
                <Text style={{ fontSize: 10, marginLeft: 6, color: '#888' }}>{message.sender.name}</Text>
              )}
            </View>
            <View style={{
              maxWidth: '80%',
              padding: 10,
              marginRight: message.sender._id === user._id.$oid ? 0 : 50,
              backgroundColor: message.sender._id === user._id.$oid ? '#007AFF' : '#E5E5EA',
              borderRadius: 20,
              borderTopRightRadius: message.sender._id === user._id.$oid ? 0 : 20,
              borderTopLeftRadius: message.sender._id === user._id.$oid ? 20 : 0,
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <Text style={{ fontSize: 13, color: message.sender._id === user._id.$oid ? '#FFF' : '#000' }}>
                {message.message_content}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>



      {/* <ScrollView 
      ref={scrollViewRef}
      onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
      
      style={styles.messagesContainer}
    
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" /> // Show loading indicator while fetching messages
        ) : (
          messages.map((message, index) => (
            <View key={index} style={[
              styles.messageContainer,
              { alignSelf: message.sender._id === user._id.$oid ? 'flex-end' : 'flex-start' }
            ]}>
              <Text style={[
                styles.messageText,
                { 
                  backgroundColor: message.sender._id === user._id.$oid ? '#DCF8C6' : '#E5E5EA',
                  borderRadius: 20,
                  borderTopRightRadius: message.sender._id === user._id.$oid ? 0 : 20, // Set to 0 for right-side messages
                  borderTopLeftRadius: message.sender._id === user._id.$oid ? 20 : 0, // Set to 0 for left-side messages
                }
              ]}>
                {message.message_content}
              </Text>
            </View>
            
          ))
        )}
      </ScrollView> */}
{/* send message section */}
      <View style={styles.inputContainer}>
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      value={inputText}
      onChangeText={setInputText}
      placeholder="Type your message..."
    />
   {inputText.trim().length > 0  ? ( // Only render icon button if there's text in the input field
          <TouchableOpacity onPress={() => handleSendMessage()}>
            <Ionicons name="send" size={24} color="#007AFF" style={styles.sendIcon} />
          </TouchableOpacity>
        ) : (
<TouchableOpacity >
            <Ionicons name="send" size={24} color="#ccc" style={styles.sendIcon} />
          </TouchableOpacity>


        ) }
  </View>
</View>
    </View>
  );
};

export default ChatScreen;
