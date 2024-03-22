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
    const {fetchUser,updateUser,user} = useContext(AuthContext)
    const [editMode,setEditMode] = useState(false) 
    const [EDITOBJECT,SETEDITOBJECT] = useState({})
    const [imageUri,setImageUri] = useState("")

    useEffect(() => {
      // Define the URL of your Flask API
      if(user!=null){
  
        fetch(`${Python_Url}/fetch_image/${user._id.$oid}`,{method: 'GET'})
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
          console.error(error);
        });
    
      
      }
    }, [user]);
 
  const uploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result,"RESULT");
    
    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const imageName = `${user._id.$oid}.jpg`; // You can use any desired filename here
  
      // Convert image to base64
      let base64Image;
      try {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        base64Image = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error converting image to base64:', error);
        return;
      }
  
      // Send image data to server
      const requestData = {
        image: base64Image.replace(/^data:image\/\w+;base64,/, ''), // Remove data URL prefix
        name: imageName,
      };
  
    getToken().then(async (token)=>{
      const response = await fetch(`${Python_Url}/uploadImage`, {
        method: 'POST',
        body: JSON.stringify(requestData),
        headers:{
          'Content-Type': 'application/json',
          Authorization: token,
        }
      });
  
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
  
      const responseData = await response.json();
      console.log(responseData);
    })
   
    // Handle success
  
    }

   

  }
    

    const handleEditProfile=()=>{
      if(editMode==false){
        setEditMode(true)
      }else{
        // fetchUser(user._id.$oid)     
        updateUser(user._id.$oid,EDITOBJECT)
        setEditMode(false)
        SETEDITOBJECT({})
      }
    }

    useEffect(() => {
     console.log(EDITOBJECT)
    }, [EDITOBJECT])
    

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ display:'flex',flexDirection:'column', height:'90%',width:'100%'}}>
        
          <View style={{backgroundColor:'#004979',width:'85%',height:550,alignSelf:'center',marginTop:28}}>
            <View style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
             
              <Image source={imageUri?{uri:imageUri}:require("../../assets/icon.png")} style={{position:'relative',left:30,alignSelf:'center',borderColor:'rgb(24,119,218)',borderWidth:3 , width:100, height: 100, borderRadius: 100,marginTop:35 }}/>
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