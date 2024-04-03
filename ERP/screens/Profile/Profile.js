import React,{useContext, useEffect,useState} from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';
import { View, Text,TextInput, Button ,StyleSheet ,SafeAreaView, Image,ScrollView,DatePickerAndroid, ToastAndroid} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Python_Url, getToken, removeToken } from '../../utils/constants';
import { AlertComponent } from '../../components/Alert';
import picture from '../../assets/logo.png'

export default function ProfileScreen() { 
    const navigation = useNavigation(); 
    const {fetchUser,updateUser,user,logout,setUser} = useContext(AuthContext)
    const [editMode,setEditMode] = useState(false) 
    const [EDITOBJECT,SETEDITOBJECT] = useState({})
    const [imageUri,setImageUri] = useState("")

    useEffect(() => {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Please allow access to photo library');
        }
      })();
    }, [])
    

    useEffect(() => {
      // Define the URL of your Flask API
      if(user!=null){
  
        fetch(`${Python_Url}/fetch_image/${user.image}`,{method: 'GET'})
        .then(response => { 
          // Check if the response was successful
          if (!response.ok) {
            throw new Error('Failed to fetch image');
          }
          return response;
        })
        .then(response => {
          // Set the image URI from the response
          // console.log(response)
          setImageUri(response.url);
        }) 
        .catch(error => {
          // console.error(error);
          // console.log(error)
          ToastAndroid.show("Internet Issue Detected, Try Again",ToastAndroid.SHORT);
        });
    
      
      }
    }, [user]);
 
    const uploadImage = async () => {

      try {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (result.cancelled) {
          console.log('Image selection cancelled');
          return; // Exit if image selection is cancelled
        }
    
        const imageUri = result.assets[0].uri;
        const mimeType = result.assets[0].mimeType;
        if(!mimeType.toString().toLowerCase().includes("jpeg")){
          console.log("File Type Must Be JPG!!")
          ToastAndroid.show("File Type Must Be JPG!!",ToastAndroid.SHORT);
          return
        }

        const formData = new FormData();
        formData.append('image', {
          uri: imageUri,
          type: mimeType, 
          name: 'photo.jpg',
        });
    
        getToken().then(async (token) => {
          const response = await fetch(`${Python_Url}/uploadImage/${user._id.$oid}`, {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: token,
            },
          });
    
          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
    
          const responseData = await response.json();
          console.log('Image uploaded successfully:', responseData);

          if (response.status === 200) {
            ToastAndroid.show(responseData.message,ToastAndroid.SHORT);
            setUser({...user,image:responseData.image})
            
          } else if (response.status === 401) {
            AlertComponent({
              title:'Message',
              message:'Session Expired!!',
              turnOnOkay:false,
              onOkay:()=>{},
              onCancel:()=>{
                logout()
              }},)
          } else {
            ToastAndroid.show("Internet Issue Detected!!",ToastAndroid.SHORT);
          }

        });
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
    

   

  
    

    const handleEditProfile=()=>{
      if(editMode==false){
        setEditMode(true)
      }else{
        updateUser(user._id.$oid,EDITOBJECT)
        setEditMode(false)
        SETEDITOBJECT({})
      }
    }

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ display:'flex',flexDirection:'column', height:'90%',width:'100%'}}>
        
          <View style={{backgroundColor:'#004979',width:'85%',height:550,alignSelf:'center',marginTop:28}}>
            <View style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
             
              <Image source={imageUri!=""?{uri:imageUri}:require('../../assets/logo.png')} style={{position:'relative',left:30,alignSelf:'center',borderColor:'rgb(24,119,218)',borderWidth:3 , width:100, height: 100, borderRadius: 100,marginTop:35 }}/>
              <View style={{ borderRadius: 100,width:30,height:30,backgroundColor:'#7cb342',display:'flex',justifyContent:'center',alignItems:'center',alignSelf:'flex-end',marginRight:30}}><MaterialIcons onPress={uploadImage} name='edit' size={25} color={'white'}/></View>
            </View>  

           <Text style={{fontWeight:'bold',color:'white',fontSize:15,alignSelf:'center',marginTop:23,fontWeight:'200'}}>{user.username}</Text>
           {user.role=="STUDENT"?<Text style={{color:'white',fontSize:11,alignSelf:'center'}}>{user.roll_number}</Text>:null}
           <Text style={{color:'white',fontSize:10,alignSelf:'center'}}>Faculty of Computer Science and Information Technology GCL</Text>
           <Text style={{fontWeight:'bold',color:'white',fontSize:15,alignSelf:'center',marginTop:23,fontWeight:'200'}}>Under Graduate</Text>
           <Text style={{color:'white',fontSize:11,alignSelf:'center'}}>career</Text>
           <Text style={{fontWeight:'bold',color:'white',fontSize:15,alignSelf:'center',marginTop:23,fontWeight:'200'}}>{user.program}</Text>
           <Text style={{color:'white',fontSize:11,alignSelf:'center'}}>Program</Text>
           {user.role=="STUDENT"?(<><Text style={{color:'white',fontSize:11,alignSelf:'center'}}>6th</Text>
           <Text style={{color:'white',fontSize:11,alignSelf:'center'}}>Current Semester</Text></>):null}
           
           <View  style={{ borderRadius: 100,width:40,height:40,backgroundColor:'#7cb342',display:'flex',justifyContent:'center',alignItems:'center',alignSelf:'flex-end',marginRight:20,marginTop:150}}>{editMode==false?<MaterialIcons onPress={handleEditProfile} name='edit' size={30} color={'white'}/>:<Ionicons onPress={handleEditProfile}  name='checkmark-sharp' size={30} color={'white'}/>}</View>
          </View>
          {/* WHITE CONTAINER */}
          <View style={{backgroundColor:'white',width:'85%',height:700,alignSelf:'center'}}>
            <View style={{alignSelf:'center',marginTop:10,padding:'3%',borderBottomWidth:1,borderBottomColor:'grey',display:'flex',flexDirection:'row',justifyContent:'center',alignContent:'center',width:'80%'}}><Text>About</Text></View>
          
            <View style={{marginTop:50,marginLeft:35}}>
            <Text>User Information</Text>
            </View>
            
            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <MaterialIcons name={'email'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5,width:'85%'}}
              editable={false}
              value={user.email}
              placeholder="Email"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <FontAwesomeIcons name={'user'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5,width:'85%'}}
              editable={false}
              value={user.username}
              placeholder="Username"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <MaterialIcons name={'contacts'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5,width:'85%'}}
              editable={editMode?true:false}
              value={EDITOBJECT.hasOwnProperty("contact")?EDITOBJECT.contact:user.contact}
              onChange={(value)=>{
                SETEDITOBJECT({...EDITOBJECT,contact:value.nativeEvent.text})
              }}
              placeholder="Contact"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <AntDesignIcons name={'idcard'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5,width:'85%'}}
              editable={editMode?true:false}
              value={EDITOBJECT.hasOwnProperty("cnic")?EDITOBJECT.cnic:user.cnic}
              placeholder="CNIC"
              onChange={(value)=>{SETEDITOBJECT({...EDITOBJECT,cnic:value.nativeEvent.text})}}
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <MaterialIcons name={'bloodtype'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5,width:'85%'}}
              editable={editMode?true:false}
              value={EDITOBJECT.hasOwnProperty("blood_group")?EDITOBJECT.blood_group:user.blood_group}
              onChange={(value)=>{SETEDITOBJECT({...EDITOBJECT,blood_group:value.nativeEvent.text})}}
              placeholder="Blood Group"
              keyboardType="default"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <MaterialIcons name={'home'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5,width:'85%'}}
              editable={editMode?true:false}
              value={EDITOBJECT.hasOwnProperty("address")?EDITOBJECT.address:user.address}
              onChange={(value)=>{SETEDITOBJECT({...EDITOBJECT,address:value.nativeEvent.text})}}
              placeholder="Address"
              keyboardType="default"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <FontAwesomeIcons name={'birthday-cake'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5,width:'85%'}}
              editable={editMode?true:false}
              value={EDITOBJECT.hasOwnProperty("date_of_birth")?EDITOBJECT.date_of_birth:user.date_of_birth}
              onChange={(value)=>{SETEDITOBJECT({...EDITOBJECT,date_of_birth:value.nativeEvent.text})}}
              placeholder="Date of birth"
              keyboardType="default"
            />
            </View>


          
          </View>
          
          
        
        </View>
      </ScrollView>
    );
  }