import { useState,useContext,useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View,ScrollView, Text,ProgressBarAndroid, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';
import { AuthContext } from '../../contexts/AuthContext';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { Python_Url, getToken, removeToken } from '../../utils/constants';

export default function AttandanceScreen() {
const navigation = useNavigation();
const {user} = useContext(AuthContext)
const {courses,setCourses} = useGlobalContext()

    async function getCourses(token){
        
    try {
        const url = `${Python_Url}/courses/${user._id.$oid}`
        const response = await fetch(url, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: token,
          }
        });
    
        const data = await response.json();
    
        if (response.ok) {
          // Handle successful response
          console.log('Response data:', data[0].teacher_id);
          setCourses(data)
        } else {
          // Handle error response
          if(data.message == "Token has expired"){
            AlertComponent({
                title:'Message',
                message:'Session Expired!!',
                turnOnOkay:false,
                onOkay:()=>{},
                onCancel:()=>{
                  ToastAndroid.show("Please Login to Continue",ToastAndroid.SHORT);
                  removeToken()
                  navigation.navigate("Login")
                }},)
          }
          console.error('Error:', data);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
      }
}
useEffect(() => {
  if(user.role == "STUDENT"){
    getToken()
        .then((token) => {getCourses(token)})
    
  }
}, [user])

  const [subjects , setSubjects] = useState([
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"SPRING 2024",
      attandancePercentage:"92"
    },
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"SPRING 2024",
      attandancePercentage:"92"
    },
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"SPRING 2024",
      attandancePercentage:"92"
    },
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"SPRING 2024",
      attandancePercentage:"92"
    },
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"SPRING 2024",
      attandancePercentage:"92"
    },
    
  ])
  return (
    <>
     
     <View 
     style={{
                  shadowColor: "#000",
                  shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.00,
                elevation: 24,


      backgroundColor:'white',display:'flex',alignSelf:'center'
      ,width:'85%'
      ,height:'91%'
      ,marginTop:30}}
      >
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      
      {courses.map((data,index)=>(
        <View key={index} style={{marginTop:40,display:'flex',alignSelf:'center',width:'88%',height:130,border:1,borderWidth:1,borderColor:'rgba(226,226,226,255)'}}>

            <View style={{height:'50%',backgroundColor:'rgb(0, 174, 255)'}}>
              <View style={{backgroundColor:'rgba(222,149,0,255)',alignSelf:'flex-end',padding:2,width:80,borderRadius:2,height:21,display:'flex',flexDirection:'row',justifyContent:'center'}}>
                <Text style={{color:'white',fontWeight:'bold',fontSize:12}}>{"SPRING 2024"}</Text>
              </View>
              <Text style={{color:'white',fontWeight:'bold',marginLeft:20,fontSize:16,position:'relative',bottom:4}}>{data.course_name}</Text>
            <Text style={{color:'white',fontWeight:'bold',marginLeft:20,fontSize:11,position:'relative',bottom:4}}>{"Credit Hrs: "+data.credit_hour}</Text>
            </View>
            <View style={{height:'50%',display:'flex',justifyContent:'center',alignItems:'center'}}>
            <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',width:'85%'}}><Text>{"Attandance: "+"92"+"%"}</Text></View>
            <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              color={"rgba(12,184,70,255)"}
              style={{width:'85%',position:'relative',bottom:5}}
              progress={0.5}
            />
            </View>

        </View>
      ))}

     

       </ScrollView>

    </View>

    
  
    
    </>
  )
}

