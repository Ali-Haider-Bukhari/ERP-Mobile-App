import { useNavigation } from '@react-navigation/native';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';
const Logo = require("../../assets/logo.png");
const picture = require(`../../assets/SirTalha.jpeg`);

export default function DashboardScreen() {
    const navigation = useNavigation();
    return (
     <>
     <View style={{width:'100%',height:'100%',backgroundColor:'rgba(238,242,253,255)'}}>
     
      <View style={{backgroundColor:'white',width:'90%',height:'92%',alignSelf:'center',marginTop:28}}>
        <Text style={{fontSize:17,marginLeft:15,marginTop:15}}>Academics</Text>
        <View style={{marginLeft:15,marginTop:5,width:'90%',borderBottomColor: 'rgba(177,177,177,255)',borderBottomWidth: StyleSheet.hairlineWidth}}/>
        <Image source={Logo} style={{alignSelf:'center',borderColor:'rgb(24,119,218)',borderWidth:3 , width: 100, height: 100, borderRadius: 100,marginTop:35 }}/>
        <Text style={{fontSize:15,alignSelf:'center',marginTop:23,fontWeight:'200'}}>Ali Haider</Text>
        <Text style={{fontSize:11,alignSelf:'center',color:'rgba(177,177,177,255)'}}>BCSM-F20-139</Text>
        <Text style={{fontSize:10,alignSelf:'center',color:'rgba(177,177,177,255)'}}>Faculty of Computer Science and Information Technology GCL</Text>
        <View style={{display:'flex',flexDirection:'row',justifyContent:'center'}}><Text style={{fontSize:12,alignSelf:'center',marginTop:23}}>Academic standings:</Text><Text style={{color:'green',fontSize:12,alignSelf:'center',marginTop:23}}>Good</Text></View>
        <Text style={{fontSize:11,alignSelf:'center'}}>Semester: 8th</Text>
        <Text style={{fontSize:11,alignSelf:'center'}}>CGPA 3.52</Text>
        <Text style={{fontSize:12,alignSelf:'center',marginTop:23}}>Completed Cr./ Total Cr : 68.0 / 135</Text>
        <Text style={{fontSize:12,alignSelf:'center'}}>Inprogress Cr : 36.0</Text>
      </View>

     </View>
     </>
    );
  }