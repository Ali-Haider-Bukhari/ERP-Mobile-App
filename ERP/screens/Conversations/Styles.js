import { StyleSheet } from 'react-native';

const ChatScreenStyles = StyleSheet.create({




  botcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10, // Rounded border
    backgroundColor: '#f0f0f0', // Background color
    marginHorizontal: 10,
    marginBottom: 10,
    marginTop:6
 
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 40, // Rounded image
  },
  chatDetails: {
    marginLeft: 10,
  },
  botName: {
    fontSize: 15,
    marginLeft:10,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 10,
    marginLeft:10

    // marginTop: 5,
  },




  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
 

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding:15,
    // paddingHorizontal: 20,
    // paddingBottom: 15,
    // marginTop: 15,
    // elevation: 2,
    borderBottomWidth: 1, // Add bottom border width
    borderBottomColor: '#ccc', // Specify border color
  },
  
  headerText: {
    color: 'black',
    fontSize: 16,
  marginTop:5,
    marginLeft: 5,
  },
  headersubtext :{
    color: 'black',
    fontSize: 10,
  
    marginLeft: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
  
  
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
 
    padding: 10,
   
  },




  messagesContainer: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
  
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    marginRight: 50
  },
  messageText: {
    fontSize: 13,
  
  },
  senderName: {
    
    fontSize : 10,
    fontWeight: 'bold',
 
    color: '#000',
  },
  senderInfo : {
    flexDirection : 'column',
    alignItems: 'flex-end',
      },






  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  inputWrapper: {
    backgroundColor:"#E5E5EA",
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
    borderColor: '#ccc',
    // borderRadius: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  sendIcon: {
    marginLeft: 10,
  },
// for Chats List



// Appbar

appBar: {

  paddingVertical: 10,
  paddingHorizontal: 20,

},
appBarContent: {

  flexDirection: 'row',
  alignItems: 'center',
},
appBarText: {
  color: 'black',
  fontSize: 30,
  marginLeft: 2, // Adjust spacing between icon and text
  fontWeight: 'bold',
},
icon: {
  marginRight: 10, // Adjust spacing between icon and text
},
   



container: {
  flex: 1,
  backgroundColor: '#fff',
},
botContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 10,
  backgroundColor: '#f0f0f0',
  marginBottom: 10,
},
botImage: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 10,
},
botText: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
},
searchBarContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
  marginHorizontal: 10,
  marginBottom: 10,
},
searchIcon: {
  marginRight: 8,
},
searchInput: {
  flex: 1,
  fontSize: 16,
  color: '#333',
},
chattext:{
marginLeft:20,
marginBottom:3,
color :'#0000ff'
},
loadingIndicator: {
  marginTop: 20,
},
noChatsContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
noChatsText: {
  fontSize: 18,
  color: '#333',
},
chatCard: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  marginLeft:10,
  marginRight:10,
  // borderBottomWidth: 1,
  // borderBottomColor: '#ccc',
},
teacherImage: {
  width: 50,
  height: 50,
  borderRadius: 25,
  marginRight: 10,
  
  borderWidth: 2, // Add border width
    borderColor: '#4e7fff',
},
senderImage : {
  width: 30,
  height: 30,
  borderRadius: 25,
  marginRight: 10,
  
  borderWidth: 2, // Add border width
    borderColor: '#4e7fff',

},
chatDetails: {
  flex: 1,
},
chatName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 4,
},
chatMessage: {
  fontSize: 14,
  color: '#666',
},
messageTime: {
  fontSize: 12,
  color: '#999',
},
});

export default ChatScreenStyles;
