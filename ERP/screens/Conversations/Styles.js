import { StyleSheet } from 'react-native';

const ChatScreenStyles = StyleSheet.create({
 
    // chat Header
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    header: {
      backgroundColor: 'rgba(4,28,92,255)',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      // paddingTop: 40,
      paddingBottom: 15,
    },
    headerText: {
      color: '#fff',
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 20,
    },
    messagesContainer: {
      flex: 1,
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    messageContainer: {
      borderRadius: 10,
      marginBottom: 10,
      padding: 10,
      maxWidth: '70%', // Limiting message width
    },
    messageText: {
      fontSize: 16,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderTopWidth: 1,
      borderTopColor: '#ccc',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 20,
      padding: 8,
      paddingHorizontal: 10,
      marginRight: 10,
      marginTop: 5,
      marginBottom: 5,
    },
    sendButton: {
      backgroundColor: 'rgba(4,28,92,255)',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      marginTop: 5,
      marginBottom: 5,
    },
    sendButtonText: {
      color: '#fff',
      fontSize: 16,
    },



// for Chats List
loadingIndicator: {
  marginTop: 20,
},
noChatsContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 50,
},
noChatsText: {
  fontSize: 18,
  fontWeight: 'bold',
},
    teacherItem: {
      padding: 20,
     
      borderBottomColor: 'white',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between', // Align items with space between them
    },
    teacherImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 20,
    },
    teacherDetails: {
      flex: 1,
    },
    teacherName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    teacherMessage1: {
      fontSize: 16,
      color: '#555',
    },
    messageTime: {
      fontSize: 14,
      color: '#777',
    },


// Appbar

appBar: {

  backgroundColor: 'rgba(4,28,92,255)',
  paddingVertical: 20,
  paddingHorizontal: 20,
  // elevation: 4,
},
appBarContent: {
  // marginTop:20,
  flexDirection: 'row',
  alignItems: 'center',
},
appBarText: {
  color: 'white',
  fontSize: 20,
  marginLeft: 2, // Adjust spacing between icon and text
  fontWeight: 'bold',
},
icon: {
  marginRight: 10, // Adjust spacing between icon and text
},
    searchBarContainer: {
      marginTop:20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2', // Background color for the search bar container
      borderRadius: 20,
      marginHorizontal: 10, // Add some margin for better spacing
      paddingHorizontal: 10, // Add some padding for better spacing
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10, // Adjust padding for better spacing
      color: 'black', // Text color
    },
    searchIcon: {
      marginRight: 10, // Adjust margin for better spacing
    },
    addButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      backgroundColor: 'white',
      borderRadius: 50,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 4,
    },
});

export default ChatScreenStyles;
