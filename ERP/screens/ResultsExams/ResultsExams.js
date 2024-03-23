import React,{useContext, useEffect,useState} from 'react';
import { View,ScrollView,TouchableOpacity, Text,ProgressBarAndroid, Button ,StyleSheet ,SafeAreaView, Image, ToastAndroid} from 'react-native';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { AuthContext } from '../../contexts/AuthContext';
import { Python_Url, getToken, removeToken } from '../../utils/constants';
import { AlertComponent } from '../../components/Alert';
import { useNavigation } from '@react-navigation/native';
import StudentGradingScreen from './StudentGradingScreen';

export default function ResultsExamsScreen() {
const navigation = useNavigation();
const {user,logout} = useContext(AuthContext)
const {courses,setCourses,selectedCourse,setSelectedCourse} = useGlobalContext()


    async function getCourses(token){
        
    try {
        const url = `${Python_Url}/courses_student/${user._id.$oid}`
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
          console.log(data,"check data")
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
                  logout()
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
    getToken().then((token) => {getCourses(token)})
  }
}, [user])

  return (
    <>
     
     {selectedCourse==null?<View 
     style={{
                  shadowColor: "#000",
                  shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.00,
                elevation: 24,

                overflow:'scroll',
              
               
      
      
      backgroundColor:'white',display:'flex',alignSelf:'center'
      ,width:'85%'
      ,height:'91%'
      ,marginTop:30}}
      >
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      
      {courses.map((data,index)=>(
         <TouchableOpacity key={index} onPress={() => {setSelectedCourse(data)}}>
        <View style={{marginTop:40,display:'flex',alignSelf:'center',width:'88%',height:130,border:1,borderWidth:1,borderColor:'rgba(226,226,226,255)'}}>

            <View style={{height:'50%',backgroundColor:'rgb(0, 174, 255)'}}>
              <View style={{backgroundColor:'rgba(222,149,0,255)',alignSelf:'flex-end',padding:2,width:80,borderRadius:2,height:21,display:'flex',flexDirection:'row',justifyContent:'center'}}>
                <Text style={{color:'white',fontWeight:'bold',fontSize:12}}>{"Spring 2024"}</Text>
              </View>
            <Text style={{color:'white',fontWeight:'bold',marginLeft:20,fontSize:16,position:'relative',bottom:4}}>{data.course_name}</Text>
            <Text style={{color:'white',fontWeight:'bold',marginLeft:20,fontSize:11,position:'relative',bottom:4}}>{"Credit Hrs: "+data.credit_hour}</Text>
            </View>
            <View style={{height:'50%',display:'flex',justifyContent:'center',alignItems:'center'}}>
            {/* <View style={{display:'flex',flexDirection:'row',justifyContent:'flex-start',width:'85%'}}><Text>{"Attandance: "+data.teacher_id+"%"}</Text></View> */}
            {/* <ProgressBarAndroid
              styleAttr="Horizontal"
              indeterminate={false}
              color={"rgba(12,184,70,255)"}
              style={{width:'85%',position:'relative',bottom:5}}
              progress={0.5}
            /> */}
            </View>

        </View>
        </TouchableOpacity>
      ))}

     

       </ScrollView>

    </View>:user.role=="STUDENT"?<StudentGradingScreen course_id={selectedCourse.course_id} setSelected={(value)=>{setSelectedCourse(null)}}/>:user.role=="TEACHER"?null:null}

    
  
    
    </>
  )
}

