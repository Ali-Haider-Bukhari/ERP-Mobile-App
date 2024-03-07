import React, { useEffect, useState ,  useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator  } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import io from 'socket.io-client';
import axios from 'axios';
import styles from "./Styles";
import {AuthContext} from "../../contexts/AuthContext";
import { Python_Url } from '../../utils/constants';
import ChatScreen from './ChatSection'; // Import the ChatScreen component
const ChatsImage = require("../../assets/chat.jpg");

const ConversationsScreen = () => {
  const [selectedChat, setSelectedChat] = useState(null);
 
  const {user} =  useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');


  useEffect(() => {
    const newSocket = io(Python_Url);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);


  useEffect(() => {
    if (!socket) return;

    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });





    return () => {
      socket.off('message');
    
    };
  }, [socket, messages]);




const handleSendMessage = () => {
  try {
 

console.log(user._id , user._id.$oid , "both _ids")

    const data = {
      sender_id: user._id,
      receiver_id: selectedChat ? selectedChat._id : '',
      message_content: inputText
    };

    socket.emit('message', data);
    setInputText('');
  } catch (error) {
    console.error('Error sending message:', error);
  }
};



// handle Chat Click /////

  const handleChatPress = (chat) => {
    const receiver_id = chat._id 
    // Emit request to fetch messages for the given chat_id

    const data = { 'sender_id' : user._id.$oid , 'receiver_id' : receiver_id}


    socket.emit('fetch_messages', data);
    setSelectedChat(chat);
  };



  return (
    <View style={styles.container}>
    
      {selectedChat ? (
        <ChatScreen
         teacher={selectedChat}
          goback={setSelectedChat} 
          user={user} 
          handleSendMessage={handleSendMessage}
          inputText={inputText}
          setInputText={setInputText}
          messages={messages}
          setMessages={setMessages}
          socket={socket}
          />
      ) : (
        <>
       {/* Appbar  */}
       <View style={styles.appBar}>
  <View style={styles.appBarContent}>
    <Ionicons name="chatbubbles" size={24} color="white" style={styles.icon} />
    <Text style={styles.appBarText}>{selectedChat ? 'Chat Screen' : 'Chat Screen'}</Text>
  </View>
</View>
      {/*   Chats   */}
     <ChatListScreen handleChatPress={handleChatPress} user={user}  />
        </>
   
      )}


    </View>
  );
};




// ///////////  ChatListScreen List Screen ////////////////////////




const ChatListScreen = ({ handleChatPress, user }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${Python_Url}/Users`, {
        params: { searchQuery } // Pass search query as a parameter
      });

      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredUsers = users.filter(chat => {
    return chat.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Chats"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
      ) : filteredUsers.length === 0 ? (
        <View style={styles.noChatsContainer}>
          <Text style={styles.noChatsText}>No Chats Found</Text>
        </View>
      ) : (
        <ScrollView>
          {filteredUsers.map((chat, index) => (
            <>
              {user?.role != chat?.role?.split('UserRoleEnum.')[1] && (
                <TouchableOpacity key={index} onPress={() => handleChatPress(chat)}>
                  <View style={styles.teacherItem}>
                    <Image source={ChatsImage} style={styles.teacherImage} />
                    <View style={styles.teacherDetails}>
                      <Text style={styles.teacherName}>{chat.username}</Text>
                      <Text style={styles.teacherMessage1}>not available...</Text>
                    </View>
                    <Text style={styles.messageTime}>5:06 AM</Text>
                  </View>
                </TouchableOpacity>
              )}
            </>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ConversationsScreen;
