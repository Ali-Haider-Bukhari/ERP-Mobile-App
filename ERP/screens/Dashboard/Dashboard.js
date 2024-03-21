import { useNavigation } from '@react-navigation/native';
import { useContext,useState,useEffect } from 'react';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { Python_Url } from '../../utils/constants';
const Logo = require("../../assets/logo.png");
const picture = require(`../../assets/SirTalha.jpeg`);

export default function DashboardScreen() {
    const {user} = useContext(AuthContext)
    const navigation = useNavigation();
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
    return (
     <>
     <View style={{width:'100%',height:'100%',backgroundColor:'rgba(238,242,253,255)'}}>
     
          <View style={{backgroundColor:'white',width:'90%',height:'92%',alignSelf:'center',marginTop:28}}>
            <Text style={{fontSize:17,marginLeft:15,marginTop:15}}>Academics</Text>
            <View style={{marginLeft:15,marginTop:5,width:'90%',borderBottomColor: 'rgba(177,177,177,255)',borderBottomWidth: StyleSheet.hairlineWidth}}/>
            <Image source={{uri:imageUri}} style={{alignSelf:'center',borderColor:'rgb(24,119,218)',borderWidth:3 , width: 100, height: 100, borderRadius: 100,marginTop:35 }}/>
            <Text style={{fontSize:15,alignSelf:'center',marginTop:23,fontWeight:'200'}}>{user.username}</Text>
            <Text style={{fontSize:11,alignSelf:'center',color:'rgba(177,177,177,255)'}}>{user.roll_number}</Text>
            <Text style={{fontSize:10,alignSelf:'center',color:'rgba(177,177,177,255)'}}>Faculty of Computer Science and Information Technology GCL</Text>
            <View style={{display:'flex',flexDirection:'row',justifyContent:'center'}}><Text style={{fontSize:12,alignSelf:'center',marginTop:23}}>Academic standings:</Text><Text style={{color:'green',fontSize:12,alignSelf:'center',marginTop:23}}>Good</Text></View>
            <Text style={{fontSize:11,alignSelf:'center'}}>{user.role=="STUDENT"?`Semester: ${user.semester}`:null}</Text>
            <Text style={{fontSize:11,alignSelf:'center'}}>{user.role=="STUDENT"?`CGPA 3.52`:null}</Text>
            <Text style={{fontSize:12,alignSelf:'center',marginTop:23}}>Completed Cr./ Total Cr : 68.0 / 135</Text>
            <Text style={{fontSize:12,alignSelf:'center'}}>Inprogress Cr : 36.0</Text>
          </View>

     </View>
     </>
    );
  }