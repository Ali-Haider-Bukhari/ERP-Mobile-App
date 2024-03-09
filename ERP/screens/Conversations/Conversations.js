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
import ChatBot from "./Chat_Bot";
const ChatsImage = require("../../assets/chat.jpg");

const ConversationsScreen = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isBotLoading, setIsBotLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [botmessages, seBottMessages] = useState([]);
  const [inputText, setInputText] = useState("");

  // chat bot

  const [selectedChatBot, setSelectedChatBot] = useState(null);





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
    const receiver_id = chat._id;
    const data = { sender_id: user._id.$oid, receiver_id: receiver_id };
    socket.emit("fetch_messages", data);
    setSelectedChat(chat);
  
  };


// for Chat Bot







// handle Bot Click /////
const handleBotPress = async (bot) => {
  setIsBotLoading(true)
  setSelectedChatBot(bot);


  try {
    let token = await getToken();
    const response = await fetch(`${Python_Url}/FetchMessages`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
      },
        body: JSON.stringify({
            sender_id: user._id.$oid,
            receiver_id: bot._id
        })
    });
    const data = await response.json();
    if (response.ok) {
      seBottMessages(data.messages);
      setIsBotLoading(false)
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
      setIsBotLoading(false)
  }
  setIsBotLoading(false)
    }
} catch (error) {
    console.error('Error fetching messages:', error);
    setIsBotLoading(false)
} finally {
  setIsBotLoading(false)
}




};









  return (
    <View style={styles.container}>


{/* Chat bot */}
{selectedChatBot ? (<>

<ChatBot 
   selectedChatBot={selectedChatBot}
   setSelectedChatBot={setSelectedChatBot}
   user={user}
   botMessages={botmessages}
   setBotMessages={seBottMessages}
   isBotLoading={isBotLoading}

  
  />

</>):(<>


{/* Chats */}



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
            handleBotPress={handleBotPress}
            user={user}
            
          />

          
        </>
      )}
      
</>)}
    </View>
  );
};








// ///////////  ChatListScreen List Screen ////////////////////////

const ChatListScreen = ({ handleChatPress, user,handleBotPress }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [botData, setBotData] = useState({});
  
  const [botloading, setBotLoading] = useState(true);

  const [chatsData, setChatsData] = useState([]);






  useEffect(() => {
    // console.log(chatbotobj , "chat obj")
    getToken().then((token) => {
      fetchUsers(token);
      fetchBot(token);
    });
  }, []);

  const fetchUsers = async (token) => {
    try {
      const response = await fetch(
        `${Python_Url}/Users`,
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



// get Bot Data 


const fetchBot = async (token) => {
  try {
    const response = await fetch(
      `${Python_Url}/FetchBot?_id=${Chat_Bot_ID}`,
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
      console.log(data, "response bot");
      setBotData(data);
      setBotLoading(false);
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
    setBotLoading(false);
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

      
<Text  style={styles.chattext} >CHAT BOT</Text>
   {/* AI Bot Component */}


      {/* Loading Indicator */}
      {botloading ? (
        <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
      ) : ( <>
      



   <TouchableOpacity
 
    onPress={() => handleBotPress(botData)}
   >
      <View style={styles.botcontainer}>
        <Image 
          source={require("../../assets/195.jpg")} 
          style={styles.image}
        />
        <View style={styles.chatDetails}>
          <Text style={styles.botName}>{botData.username}</Text>
          <Text style={styles.message}>
            Chat with Our AI Bot At AnyTime
          </Text>
        </View>
      </View>
    </TouchableOpacity>

      </> )}

<Text  style={styles.chattext} >ALL MESSAGES</Text>
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
            user?.role !== chat?.role?.split("UserRoleEnum.")[1] ? (
              <TouchableOpacity key={index} onPress={() => handleChatPress(chat)}>
                <View style={styles.chatCard}>
                  <Image source={ChatsImage} style={styles.teacherImage} />
                  <View style={styles.chatDetails}>
                    <Text style={styles.chatName}>{chat.username}</Text>
                {/* Display Last Message and New Message Count */}
          <Text style={styles.chatMessage}>
            {chatsData.find(c => c._id === chat._id)?.lastMessage?.message_content || 'No messages'}
          </Text>
                  </View>
                  <Text style={styles.messageTime}>
            {/* Display last message time if available */}
            {chatsData.find(c => c._id === chat._id)?.lastMessage?.timestamp || '2:00 PM'}
          </Text>
          {/* Display new message count */}
          {chatsData.find(c => c._id === chat._id)?.newMessagesCount > 0 && (
            <View>
              <Text style={styles.chatMessage}>
                {chatsData.find(c => c._id === chat._id)?.newMessagesCount || 0}
              </Text>
            </View>
          )}
                </View>
              </TouchableOpacity>
            ) : null
          ))
        )}
      </ScrollView>
      
      )}
    </View>
  );
};

export default ConversationsScreen;
