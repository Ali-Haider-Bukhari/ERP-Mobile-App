import React, {  useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Styles";
import { Python_Url ,   getToken } from "../../utils/constants";
import { useNavigation } from '@react-navigation/native';
import { AlertComponent } from '../../components/Alert';



const ChatBot = ({ selectedChatBot, setSelectedChatBot, user , botMessages ,setBotMessages ,  isBotLoading }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [botInputText, setBotInputText] = useState("");
  const scrollViewRef = useRef();

  const navigation = useNavigation();




  const handleSendMessageToBot = async () => {
    try {
        // Fetch the token
        let token = await getToken();

        // Check if token is available
        if (!token) {
            console.error("Token is not available");
            return;
        }
        setIsLoading(true);
        // Update state with user message
        setBotMessages([
            ...botMessages,
            { message_content: botInputText, sender_id: user._id.$oid },
        ]);
        setBotInputText(""); // Clear input text after sending message

        // Prepare data for sending
        const data = {
            sender_id: user._id.$oid, // Replace with the actual user ID
            receiver_id: selectedChatBot._id, // Replace with the actual bot ID
            message_content: botInputText, // Replace with the actual user message
            bot_message_content: "", // Replace with the actual bot response
        };

        // Send message to server
        const response = await fetch(`${Python_Url}/SaveBotMessages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify(data),
        });

        // Check if response is ok
        if (response.ok) {
            const responseData = await response.json();
            console.log("Message saved successfully:", JSON.parse(responseData.obj));
            // Handle response if needed
             const messageid =   JSON.parse(responseData.obj)._id.$oid
            // Fetch bot response after saving user message
            fetchBotResponse(messageid);
        } else {
            // Handle error
            console.error("Failed to save message:", response.statusText);

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
        console.error("Error sending message:", error);
    }
};






  // Function to fetch bot response



// Function to fetch bot response
const fetchBotResponse = async (savedMessageId) => {
    try {
        // Fetch bot response from the server
          // Fetch the token
          let token = await getToken();

  //       const response = await fetch(`${Python_Url}/GetBotResponse`, {
  //           method: "POST",
  //           headers: {
  //               "Content-Type": "application/json",
  //               Authorization: token,
  //           },
  //           body: JSON.stringify({ savedMessageId }), // Pass the saved message ID to the server
  //       });

  
  // // Check if response is ok
  // if (response.ok) {
  //  const responseData = await response.json();
  //       const botResponse = responseData.bot_message_content;


  const response = await fetch(`${Python_Url}/AI_Reply`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: token,
    },
    body: JSON.stringify({
        content: botInputText,
        role: "user"
      }), // Pass the saved message ID to the server
});


// Check if response is ok
if (response.ok) {
const responseData = await response.json();
const botResponse = responseData.choices[0].message.content;
console.log(botResponse , "bot response from AI reply")

        // Save bot response with the corresponding message ID
        const data = {
            "messageId": savedMessageId,
            "botResponse": botResponse,
            "sender_id": selectedChatBot._id, // Replace with the actual user ID
            "receiver_id": user._id.$oid, 
        };

        const saveBotResponseResponse  = await fetch(`${Python_Url}/SaveBotResponse`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify( data ), // Pass the saved message ID to the server
        });
if(saveBotResponseResponse.ok){

console.log(botResponse , "bot response")
// Add bot response to botMessages state
setBotMessages(prevMessages => [
    ...prevMessages,
    { bot_message_content: botResponse, sender_id: selectedChatBot._id },
]);

setIsLoading(false); 
}else{

    // Check if token has expired
    if (saveBotResponseResponse.status === 401) {
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


} else {
    // Handle error


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
        console.error("Error fetching bot response:", error);
    }
};






// console.log(botMessages , "My List ")


  return (
    <View style={styles.container}>
      {/* chat header */}

      <View style={styles.header}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => { setSelectedChatBot(null); navigation.navigate("Conversations")}}
          >
            <Ionicons name="chevron-back-outline" size={30} color="black" />
          </TouchableOpacity>

          <Image
            source={require("../../assets/195.jpg")}
            style={styles.userImage}
          />

          <View>
            <Text style={styles.headerText}>{selectedChatBot.username}</Text>
            <Text style={styles.headersubtext}>Bot Typing....</Text>
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
  onContentSizeChange={() =>
    scrollViewRef.current.scrollToEnd({ animated: true })
  }
  style={styles.messagesContainer}
>

{isBotLoading ? (<>
  <ActivityIndicator
          style={styles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
</>):(<>


    {botMessages.map((message, index) => (
        <View
            key={index}
            style={[
                styles.messageContainer,
                {
                    alignSelf:
                        message.sender_id === user._id.$oid ? "flex-end" : "flex-start",
                },
            ]}
        >
            {message.message_content && ( /* Render user's message if available */
                <Text
                    style={[
                        styles.messageText,
                        {
                            backgroundColor:
                                message.sender_id === user._id.$oid
                                    ? "#DCF8C6"
                                    : "#E5E5EA",
                            borderRadius: 20,
                            borderTopLeftRadius:
                                message.sender_id === user._id.$oid ? 0 : 20,
                            borderTopRightRadius:
                                message.sender_id === user._id.$oid ? 20 : 0,
                        },
                    ]}
                >
                    {message.message_content}
                </Text>
            )}
{/* loading when get bot reply */}
{isLoading && index === botMessages.length - 1 && (
  <View style={styles.messageText}>
  <ActivityIndicator
 
 size="large"
 color="#0000ff"

/> 

  </View>

)}

            {message.bot_message_content && ( /* Render bot's response if available */
                <Text
                    style={[
                        styles.messageText,
                        {
                            backgroundColor: "#E5E5EA",
                            borderRadius: 20,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 0,
                        },
                    ]}
                >
                    {message.bot_message_content}
                </Text>
            )}


        </View>
    ))}
</>)}

</ScrollView>

      {/* send message section */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={botInputText}
            onChangeText={setBotInputText}
            placeholder="Type your message..."
          />
          <TouchableOpacity onPress={() => handleSendMessageToBot()}>
            <Ionicons
              name="send"
              size={24}
              color="#007AFF"
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatBot;
