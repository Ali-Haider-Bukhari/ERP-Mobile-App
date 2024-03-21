import React,{useContext, useEffect,useState} from 'react';
import { View,ScrollView,TouchableOpacity, Text,ProgressBarAndroid, Button ,StyleSheet ,SafeAreaView, Image, ToastAndroid} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome6';
import { Python_Url, getToken, removeToken } from '../../utils/constants';
import { useGlobalContext } from '../../contexts/GlobalContext';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function StudentGradingScreen({course_id,setSelected}){
    const navigation = useNavigation();
    const {user} = useContext(AuthContext)
    const [result,setResult] = useState([])
    const [flag,setFlag] = useState({})
    async function getResults(token){
        console.log({course_id:course_id,student_id:user._id.$oid},"check")
        try {
            const url = `${Python_Url}/fetch-results`
            const response = await fetch(url, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: token,
              },
              body:JSON.stringify({course_id:course_id,student_id:user._id.$oid})
            });
        
            const data = await response.json();
        
            if (response.ok) {
              // Handle successful response
              console.log('Response data:', data);
              setResult(data)

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
          getToken().then((token) => {getResults(token)})
      }, [user])
    return (
    <>
    <View style={{backgroundColor:'#ffffff',height:45,padding:10 ,display:'flex',flexDirection:'row',justifyContent:'space-around'}}>
    <FontAwesomeIcons onPress={()=>navigation.navigate('Dashboard')} style={{marginLeft:20,marginTop:5}} name={'house'} size={15} color={'#757575'}/> 
    <MaterialIcons style={{position:'relative',bottom:2}} name={'keyboard-arrow-right'} size={30} color={'#757575'}/> 
    <Text onPress={()=>{setSelected(null)}} style={{position:'relative',top:0,color:'#3795e8',fontSize:20}}>Result Classes</Text>
    <MaterialIcons style={{position:'relative',bottom:2}} name={'keyboard-arrow-right'} size={30} color={'#757575'}/> 
    <Text style={{position:'relative',bottom:0,color:'#3795e8',fontSize:20}}>Result Class</Text>
    </View>

    <View style={{marginLeft:35}}>
    <Text style={{position:'relative',top:10,fontSize:25,color:'#444444'}}>Results</Text>
    </View>
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

                overflow:'scroll',
              
               
      
      
      backgroundColor:'white',display:'flex',alignSelf:'center'
      ,width:'85%'
      ,height:'auto'
      ,maxHeight:'85%'
      ,marginTop:30}}
      >
    
     <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:30,marginLeft:35,height:25,width:'30%',borderBottomWidth:2,borderBottomColor:'#2196f3'}}>
        <Text style={{fontWeight:'bold',color:'#3b3b3b',marginLeft:20}}>LECTURE</Text>
     </View>
     <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:10,marginLeft:55,height:30,width:'80%',borderBottomWidth:1,borderBottomColor:'#e2e2e2'}}>
        <Text style={{color:'#3b3b3b',marginLeft:20}}>Assessment  Obtained Percentage</Text>
     </View>
     <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
     {result.map((listValue)=>
                Object.keys(listValue).map((data,index)=>
                (
            data=="academic_year"||data=="course_id"||data=="student_id"||data=="grade"?null
            :(<>
             <TouchableOpacity key={index} onPress={() => {
                    setFlag(prevFlag => {
                        const newFlag = { ...prevFlag };
                        newFlag[index] = !newFlag[index];
                        return newFlag;
                    });
                }}>
            <View style={{display:'flex',flexDirection:'row',justifyContent:'start',marginTop:10,marginLeft:55,height:30,width:'80%',borderBottomWidth:1,borderBottomColor:'#e2e2e2'}}>
            <MaterialIcons name={ flag[index]==true?'keyboard-arrow-down':'keyboard-arrow-right'} size={20} color={'#2196f3'}/> 
            <Text style={{color:'#3795e8'}}>{data}</Text>
           </View>
           </TouchableOpacity>

           { flag[index]==true?(<>
           <View index={index} style={{display:'flex',flexDirection:'row',justifyContent:'space-around',backgroundColor:'#37474F',fontWeight:'bold',width:'80%',marginLeft:55,height:30}}>
            <Text style={{color:'white',fontWeight:'bold',marginTop:5}}>Assessment</Text>
            <Text style={{color:'white',fontWeight:'bold',marginTop:5}}>Weightage</Text>
            </View>
            
            {data == "quiz" || data == "assignment"?
            listValue[data].map((value,index)=>(
                <View index={index} style={{display:'flex',flexDirection:'row',justifyContent:'space-around',width:'80%',marginLeft:45}}>
                    <Text>{data+" "+Number(index+1)}</Text>
                    <Text>{JSON.parse(value).total_marks}</Text>
                    <Text>{JSON.parse(value).obtained_marks}</Text>
                    <Text>{JSON.parse(value).weightage}</Text>
                </View>
            ))
            :data=="totalmarks"?
            <View style={{display:'flex',flexDirection:'row',justifyContent:'space-around',width:'80%',marginLeft:45}}>
                <Text>{"total_marks"}</Text>
                <Text>{JSON.parse(listValue[data])}</Text>
             </View>
            :<View style={{display:'flex',flexDirection:'row',justifyContent:'space-around',width:'80%',marginLeft:45}}>
                <Text>{data}</Text>
                <Text>{JSON.parse(listValue[data]).total_marks}</Text>
                <Text>{JSON.parse(listValue[data])['obtained_marks']}</Text>
                <Text>{JSON.parse(listValue[data])['weightage']}</Text>
             </View>}
            
            </>):null}
           </> )
                )))}
        
     
</ScrollView>
     
  
     <View style={{height:50}}>

     </View>
    </View>
    </>
    )
}