import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from "./Styles";


// Message Chat Screen

const ChatScreen = ({ teacher , goback , user ,   handleSendMessage , inputText ,setInputText ,messages
    , setMessages , socket
    }) => {
  


      useEffect(() => {
        if (!socket) return;
    
        // Emit event to fetch messages for the given chatId
        const chatId = teacher?._id;
        socket.emit('fetch_messages', { chatId });
    
        // Listen for fetched messages from the backend
        socket.on('fetched_messages', (fetchedMessages) => {
          setMessages(fetchedMessages);
        });
    
        return () => {
          socket.off('fetched_messages');
        };
      }, [socket, teacher]);
   
    
      return (
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => goback(null)}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerText}>{teacher.username}</Text>
          </View>
    
          <ScrollView style={styles.messagesContainer}>
          
             {messages.map((message, index) => (
            <View key={index} style={[
              styles.messageContainer,
              { alignSelf: message.sender_id == user._id.$oid ? 'flex-start' : 'flex-end' }
            ]}>
              <Text style={[
                styles.messageText,
                { backgroundColor: message.sender_id ==  user._id.$oid ? '#DCF8C6' : '#E5E5EA' }
              ]}>
                {message.message_content}
               
              </Text>
            </View>
          ))}
          </ScrollView>
    
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={() => handleSendMessage()}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    export default ChatScreen;