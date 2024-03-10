import React,{useEffect,useState} from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image,ScrollView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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
            <Text>Information</Text>
            </View>

            <View>
              
            </View>
          
          </View>
          
          
        
        </View>
      </ScrollView>
    );
  }