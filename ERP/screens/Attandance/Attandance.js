import { useState } from 'react';
import { View,ScrollView, Text, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';

export default function AttandanceScreen() {
  const [subjects , setSubjects] = useState([
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"Spring 2024",
      attandancePercentage:"92"
    },
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"Spring 2024",
      attandancePercentage:"92"
    },
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"Spring 2024",
      attandancePercentage:"92"
    },
    {
      subjectName:"Technopreneurship",
      creditHrs:"3.00",
      season:"Spring 2024",
      attandancePercentage:"92"
    }
  ])
  return (
    <>
     <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
     <View style={{
                  shadowColor: "#000",
                  shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.58,
                shadowRadius: 16.00,
                elevation: 24,

                overflow:'scroll',
                // flex: 1,
      
      
      backgroundColor:'white',display:'flex',alignSelf:'center',width:'85%',height:'91%',marginTop:30}}>
      {subjects.map((data,index)=>(
        <View key={index} style={{marginTop:45,display:'flex',alignSelf:'center',width:'88%',height:'20%',border:1,borderWidth:1,borderColor:'grey'}}>

            <View style={{height:'50%',backgroundColor:'rgb(0, 174, 255)'}}></View>
            <View style={{height:'50%'}}></View>

        </View>
      ))}
    </View>
     </ScrollView>
    
    </>
  )
}

