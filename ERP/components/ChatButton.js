import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../contexts/AuthContext';

const chatbot = require(`../assets/chatbot.png`);

const ChatButton = ({ onPress }) => {
    const [showPopover, setShowPopover] = useState(true);
    const {user} = useContext(AuthContext)
      
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowPopover(false);
      }, 10000); // Hide popover after 10 seconds
  
      return () => clearTimeout(timer);
    }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Image source={chatbot} style={styles.button}/>
        {/* showPopover &&  */}
        { showPopover && (
          <View style={styles.popover}>
            <Text style={styles.popoverText}>{`Hey ${user.username}, Wanna talk...?`}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  ); 
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 999,
  },
  button: {
    backgroundColor: 'rgba(4, 28, 92, 255)',
    padding: 10,
    borderRadius: 100,
    height: 50,
    width: 50,
  },
  popover: {
    width:180,
    position: 'absolute',
    zIndex: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Change the background color
    borderRadius: 20,
    borderTopRightRadius: 20,
  
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 50,
    bottom: 2,
    right: 35,
    shadowColor: '#000', // Add shadow for depth
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  popoverText: {
    color: 'white',
    fontSize: 16,
    width: 165,
  },
});

export default ChatButton;
