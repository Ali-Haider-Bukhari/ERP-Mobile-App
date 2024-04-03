
import React, { useEffect, useState , useContext} from "react";
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
import { AuthContext } from "../../contexts/AuthContext";
import { useNavigation } from '@react-navigation/native';
import styles from "./style";

import {
  Python_Url,
  getToken,
  removeToken,
  Chat_Bot_ID
} from "../../utils/constants";

import { AlertComponent } from "../../components/Alert";
import EditUserForm from "./Edit_Students";


export default  function Crud_Students  ()  {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editUser, setEditUser] = useState(null);
  
    const navigation = useNavigation();

  
    useEffect(() => {
   
      getToken().then((token) => {
        fetchUsers(token);
       
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
  
  
  
  
    const handleSearch = (text) => {
      setSearchQuery(text);
    };
  
    const filteredUsers = users.filter((chat) => {
      return chat.username.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    const handleChatPress = (user) => {
        // Handle chat press action here
      };


      const handleDelete = async (user) => {
        try {
            console.log(user['_id'])
            setLoading(true);
            // let token =  getToken();
            const response = await fetch(
              `${Python_Url}/del_user_byid/${user["_id"]}`,
              {
                method: 'DELETE',
                headers: {
                  "Content-Type": "application/json",
                //   Authorization: token,
                },
              }
            );
      
            // const data = await response.json();
            if (response.ok) {
       // Remove the deleted user from the state
       setUsers(prevUsers => prevUsers.filter(u => u['_id'] !== user['_id']));
            } else {
       
            }
          } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
          } finally{
            setLoading(false)
          }
      };



      const handleSaveEdit = async (formData) => {
   
try{
        let token = await getToken();
    
        // Send POST request to the Flask API
        const response = await fetch(`${Python_Url}/update_userData`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token, 
          },
          body: JSON.stringify(formData)
        });
    const data = response.json();
        // Check if the request was successful
        if (response.ok) {
              // Handle successful response
      console.log('User updated successfully');

      // Update the user data in the state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === formData._id ? { ...user, ...formData } : user
        )
      );

          setEditMode(false);
          setEditUser(null);
    
        } else {
   
        if(data.message == "Token has expired"){
          AlertComponent({
              title:'Message',
              message:'Session Expired!!',
              turnOnOkay:false,
              onOkay:()=>{},
              onCancel:()=>{
          
              }},)
        }
          const errorData = await response.json();
          console.error('Update failed:', errorData.error);
        }
      } catch (error) {
        // Handle network errors or other exceptions
        console.error('Update failed:', error);
      }

      };
    
      const handleCancelEdit = () => {
        setEditMode(false);
        setEditUser(null);
      };
      const handleEdit = (user) => {
        setEditMode(true);
        setEditUser(user);
      };
      


      const renderUsers = () => {
        if (filteredUsers.length === 0) {
          return (
            <View style={styles.noChatsContainer}>
              <Text style={styles.noChatsText}>No Users Found</Text>
            </View>
          );
        } else {
          return (
            <ScrollView>
            {filteredUsers.map((user, index) => (
              <>
                {user._id !== Chat_Bot_ID && (
                  <TouchableOpacity key={index} onPress={() => handleChatPress(user)}>
                    <View style={styles.chatCard}>
                      <Image
                        source={require('../../assets/logo.png')}
                        style={styles.teacherImage}
                      />
                      <View style={styles.chatDetails}>
                        <View style={{ flexDirection: 'column' }}>
                          <Text style={styles.chatName}>{user.username}</Text>
                          <Text style={{ fontSize: 14 }}>{user.email}</Text>
                        </View>
                        <View style={styles.iconContainer}>
                          <TouchableOpacity onPress={() => handleEdit(user)}>
                            <Ionicons
                              name="pencil"
                              size={24}
                              color="black"
                              style={styles.icon}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDelete(user)}>
                            <Ionicons
                              name="trash"
                              size={24}
                              color="black"
                              style={styles.icon}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              </>
            ))}
          </ScrollView>
          
          );
        }
      };
    
      return (
        <View style={styles.container}>
                {editMode ? (
        <EditUserForm user={editUser} onSave={handleSaveEdit} onCancel={handleCancelEdit} />
      ) : ( <>
      
  
          <View style={styles.searchBarContainer}>
            <Ionicons name="search" size={24} color="gray" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Users"
              placeholderTextColor="gray"
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
          <Text style={styles.chattext}>ALL Users</Text>
          {loading ? (
            <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
          ) : (
            renderUsers()
          )}
              </>)}
        </View>
      );
    };