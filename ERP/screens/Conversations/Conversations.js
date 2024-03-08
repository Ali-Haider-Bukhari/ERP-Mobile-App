import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";

import styles from "./Styles";
import { AuthContext } from "../../contexts/AuthContext";
import {
  Python_Url,
  getToken,
  removeToken,
  Chat_Bot_ID,
} from "../../utils/constants";
import ChatScreen from "./ChatSection"; // Import the ChatScreen component
import { AlertComponent } from "../../components/Alert";
const ChatsImage = require("../../assets/chat.jpg");

const ConversationsScreen = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const { user } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  // chat Bot Object

  // const chatbotobj = {
  //   _id: Chat_Bot_ID,
  //   username: "Chat Assistant",
  // };
  const chatbotobj = {
    "_id": `${Chat_Bot_ID}`,
     "email": "",
      "role": "UserRoleEnum.STUDENT",
       "roll_number": "BCSM-F20-127",
        "username": "Chat Bot"}

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
      console.log([...messages, message],"check")
      setMessages([...messages, message]);
    });

    return () => {
      socket.off("message");
    };
  }, [socket, messages]);

  const handleSendMessage = () => {
    try {
      // console.log(user._id , user._id.$oid , "both _ids")

    const data = {
      sender_id: user._id.$oid,
      receiver_id: selectedChat ? selectedChat._id : '',
      message_content: inputText
    };

      socket.emit("message", data);
      setInputText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // handle Chat Click /////

  const handleChatPress = (chat) => {

    console.log(chat , "chat object")
    const receiver_id = chat._id;
    // Emit request to fetch messages for the given chat_id

    const data = { sender_id: user._id.$oid, receiver_id: receiver_id };
    console.log(data,"DATA FETCH SEND")

    socket.emit("fetch_messages", data);

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
              <Ionicons
                name="chatbubbles"
                size={30}
                color="black"
                style={styles.icon}
              />
              <Text style={styles.appBarText}>Chat</Text>
            </View>
          </View>
          {/*   Chats   */}
          <ChatListScreen
            handleChatPress={handleChatPress}
            user={user}
            chatbotobj={chatbotobj}
          />
        </>
      )}
    </View>
  );
};

// ///////////  ChatListScreen List Screen ////////////////////////

const ChatListScreen = ({ handleChatPress, user, chatbotobj }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(chatbotobj , "chat obj")
    getToken().then((token) => {
      fetchUsers(token);
    });
  }, []);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(
        `${Python_Url}/Users?searchQuery=${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        console.log(data, "response");
        setUsers(data);
        setLoading(false);
      } else {
        if (data.message == "Token has expired") {
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
        console.log(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const filteredUsers = users.filter((chat) => {
    return chat.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <View style={styles.container}>
      {/* AI Bot Component */}
      <TouchableOpacity
        style={styles.botContainer}
        onPress={() => handleChatPress(chatbotobj)}
      >
        <Image
          source={require("../../assets/195.jpg")}
          style={styles.botImage}
        />
        <Text style={styles.botText}>Our Chat Bot</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search"
          size={24}
          color="gray"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Chats"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Loading Indicator */}
      {loading ? (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
      ) : (
        <ScrollView>
          {/* Display Chat Items */}
          {filteredUsers.length === 0 ? (
            <View style={styles.noChatsContainer}>
              <Text style={styles.noChatsText}>No Chats Found</Text>
            </View>
          ) : (
            filteredUsers.map((chat, index) => (

              user.role != chat.role.split("UserRoleEnum")[1]?<TouchableOpacity
                key={index}
                onPress={() => handleChatPress(chat)}
              >
                <View style={styles.chatCard}>
                  <Image source={ChatsImage} style={styles.teacherImage} />
                  <View style={styles.chatDetails}>
                    <Text style={styles.chatName}>{chat.username}</Text>
                    <Text style={styles.chatMessage}>Not available...</Text>
                  </View>
                  <Text style={styles.messageTime}>5:06 AM</Text>
                </View>
              </TouchableOpacity>:null
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default ConversationsScreen;
