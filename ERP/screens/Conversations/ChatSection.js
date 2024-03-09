import React, { useEffect, useState , useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator , Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from "./Styles";
const ChatsImage = require("../../assets/chat.jpg");



const ChatScreen = ({ teacher, goback, user, handleSendMessage, inputText, setInputText, messages, setMessages, socket }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [unseenMessagesCount, setUnseenMessagesCount] = useState({});
  const scrollViewRef = useRef();

  useEffect(() => {
    if (!socket) return;

    const chatId = teacher?._id;
    socket.emit('fetch_messages', { chatId });

    socket.on('fetched_messages', (fetchedMessages, unseenCount) => {
      setMessages(fetchedMessages);
      setUnseenMessagesCount(prevCount => ({
        ...prevCount,
        [chatId]: unseenCount // Update unseen messages count for the chat
      }));
      setIsLoading(false);
    });

    return () => {
      socket.off('fetched_messages');
    };
  }, [socket, teacher]);

// Scroll when new messages comes////

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true }); // Scroll to the end when messages update
    }
  }, [messages]);



  return (
    <View style={styles.container}>

{/* chat header */}

<View style={styles.header}>

  <View style={{flexDirection: 'row'}} >
  <TouchableOpacity style={styles.iconButton} onPress={() => goback(null)}>
    <Ionicons name="chevron-back-outline" size={30} color="black" />
  </TouchableOpacity>

      <Image source={ChatsImage} style={styles.userImage} />
   

  <View>
  <Text style={styles.headerText}>
    {teacher.username}
    </Text>
  <Text style={styles.headersubtext}>User Typing....</Text>
  </View>
 
  </View>
 


  <View style={styles.iconContainer}>
    <TouchableOpacity style={styles.iconButton}>
      <Ionicons name="videocam-outline" size={24} color="black" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.iconButton}>
      <Ionicons name="call-outline" size={24} color="black" />
    </TouchableOpacity>
  </View>

</View>

{/* my messages Section */}


      <ScrollView 
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
              { alignSelf: message.sender_id === user._id.$oid ? 'flex-start' : 'flex-end' }
            ]}>
              <Text style={[
                styles.messageText,
                { 
                  backgroundColor: message.sender_id === user._id.$oid ? '#DCF8C6' : '#E5E5EA',
                  borderRadius: 20,
                  borderTopLeftRadius: message.sender_id === user._id.$oid ? 0 : 20, // Set to 0 for right-side messages
                  borderTopRightRadius: message.sender_id === user._id.$oid ? 20 : 0, // Set to 0 for left-side messages
                }
              ]}>
                {message.message_content}
              </Text>
            </View>
            
          ))
        )}
      </ScrollView>
{/* send message section */}
      <View style={styles.inputContainer}>
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.input}
      value={inputText}
      onChangeText={setInputText}
      placeholder="Type your message..."
    />
    <TouchableOpacity onPress={() => handleSendMessage()}>
      <Ionicons name="send" size={24} color="#007AFF" style={styles.sendIcon} />
    </TouchableOpacity>
  </View>
</View>
    </View>
  );
};

export default ChatScreen;
