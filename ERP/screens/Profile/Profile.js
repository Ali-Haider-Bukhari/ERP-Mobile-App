import React,{useEffect,useState} from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';
import { View, Text,TextInput, Button ,StyleSheet ,SafeAreaView, Image,ScrollView,DatePickerAndroid} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { Ionicons } from '@expo/vector-icons';
export default function ProfileScreen() {
    const navigation = useNavigation(); 
    const [editMode,setEditMode] = useState(false)

    const handleEditProfile=()=>{
      if(editMode==false){
        setEditMode(true)
      }else{
        setEditMode(false)
      }
    }


    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ display:'flex',flexDirection:'column', height:'90%',width:'100%'}}>
        
          <View style={{backgroundColor:'#004979',width:'85%',height:550,alignSelf:'center',marginTop:28}}>
            <View style={{display:'flex',flexDirection:'row',justifyContent:'center'}}>
             
              <Image source={require("../../assets/logo.png")} style={{position:'relative',left:30,alignSelf:'center',borderColor:'rgb(24,119,218)',borderWidth:3 , width:100, height: 100, borderRadius: 100,marginTop:35 }}/>
              <View style={{ borderRadius: 100,width:30,height:30,backgroundColor:'#7cb342',display:'flex',justifyContent:'center',alignItems:'center',alignSelf:'flex-end',marginRight:30}}><MaterialIcons name='edit' size={25} color={'white'}/></View>
            </View>

           <Text style={{fontWeight:'bold',color:'white',fontSize:15,alignSelf:'center',marginTop:23,fontWeight:'200'}}>Ali Haider</Text>
           <Text style={{color:'white',fontSize:11,alignSelf:'center'}}>BCSM-F20-139</Text>
           <Text style={{color:'white',fontSize:10,alignSelf:'center'}}>Faculty of Computer Science and Information Technology GCL</Text>
           <Text style={{fontWeight:'bold',color:'white',fontSize:15,alignSelf:'center',marginTop:23,fontWeight:'200'}}>Under Graduate</Text>
           <Text style={{color:'white',fontSize:11,alignSelf:'center'}}>career</Text>
           <Text style={{fontWeight:'bold',color:'white',fontSize:15,alignSelf:'center',marginTop:23,fontWeight:'200'}}>BS Computer Science</Text>
           <Text style={{color:'white',fontSize:11,alignSelf:'center'}}>Program</Text>
           <Text style={{color:'white',fontSize:11,alignSelf:'center'}}>6th</Text>
           <Text style={{color:'white',fontSize:11,alignSelf:'center'}}>Current Semester</Text>
           
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
              style={{marginLeft:10,marginBottom:5}}
              editable={true}
              value={""}
              placeholder="Email"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <FontAwesomeIcons name={'user'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5}}
              editable={true}
              value={""}
              placeholder="Username"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <MaterialIcons name={'contacts'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5}}
              editable={true}
              value={""}
              placeholder="Contact"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <AntDesignIcons name={'idcard'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5}}
              editable={true}
              value={""}
              placeholder="CNIC"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <MaterialIcons name={'bloodtype'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5}}
              editable={true}
              value={""}
              placeholder="Blood Group"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <MaterialIcons name={'home'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5}}
              editable={true}
              value={""}
              placeholder="Address"
              keyboardType="numeric"
            />
            </View>

            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:40,width:'80%',borderBottomWidth:1,borderBottomColor:'#2196f3'}}>
              <FontAwesomeIcons name={'birthday-cake'} size={30} color={'#2196f3'}/>
              <TextInput
              style={{marginLeft:10,marginBottom:5}}
              editable={true}
              value={""}
              // inputMode=''
              placeholder="Date of birth"
              keyboardType="numeric"
            />
            </View>


          
          </View>
          
          
        
        </View>
      </ScrollView>
    );
  }