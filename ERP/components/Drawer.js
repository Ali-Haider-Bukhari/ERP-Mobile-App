import  React,{useState,useEffect} from 'react';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';
import { createDrawerNavigator,DrawerContentScrollView,
  DrawerItemList,
  DrawerItem, } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../screens/Dashboard/Dashboard';
import ProfileScreen from '../screens/Profile/Profile';
import AttandanceScreen from '../screens/Attandance/Attandance';
import ConversationsScreen from '../screens/Conversations/Conversations';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
// import Ionicons from 'react-native-vector-icons/Ionicons'
import Login from '../screens/Login/Login';
const picture = require(`../assets/SirTalha.jpeg`);
const Logo = require("../assets/logo.png");
import { AuthContext } from '../contexts/AuthContext';
import BottomSheetModalComponent from './BottomSheetModal';

const CustomSidebarMenu = (props) => {
  
const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    // resizeMode: 'center',
    marginTop:40,
    width: '30%',
    height: '50%',
    borderRadius: 100 / 2,
    alignSelf: 'center', 
  },
  iconStyle: {
    width: 15,
    height: 15,
    marginHorizontal: 5,
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

  return ( 
    <SafeAreaView style={{flex: 1}}>
      {/*Top Section*/}
      <View style={{backgroundColor:'rgba(4,28,92,255)',height:'25%'}}>
        <Image
          source={picture}
          style={styles.sideMenuProfileIcon}
        />
        <View style={{marginTop:10,display:'flex',justifyContent:'center'}}>
          <Text style={{color:'white',fontWeight:'bold',alignSelf:'center'}}>
            Sir. Talha Amjad
          </Text>
        </View>
      </View>
      
      <DrawerItemList {...props} />
      <DrawerContentScrollView {...props}>
        {/* <DrawerItem
          label="Visit Us"
          onPress={() => Linking.openURL('https://aboutreact.com/')}
        />
        <View style={styles.customItem}>
          <Text
            onPress={() => {
              Linking.openURL('https://aboutreact.com/');
            }}>
            Rate Us
          </Text>
          <Image
            source={{uri: BASE_PATH + 'star_filled.png'}}
            style={styles.iconStyle}
          />
        </View> */}
      </DrawerContentScrollView>
      {/* <Text
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'grey'
        }}>
        www.aboutreact.com
      </Text> */}
    </SafeAreaView>
  );
};
 
export default function DrawerScreen() {
  const {logout} = React.useContext(AuthContext)
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();
  const [bottomSheetModalFlag,setBottomSheetModalFlag] = useState(false)
  const [headerTitle,setHeaderTitle] = useState("Saepn Pvt.Ltd")

  const CustomHeader = ({ navigation })  => (
    <View style={{ height:80,flexDirection: 'row', justifyContent: 'start',alignItems:'center', paddingHorizontal: 16, paddingVertical: 8,backgroundColor:'rgba(4,28,92,255)' }}>
      {/* <TouchableOpacity onPress={() => navigation.toggleDrawer()}> */}
        <Ionicons style={{marginTop:15}} name="menu" size={30} color="white" onPress={() => {navigation.toggleDrawer(); setBottomSheetModalFlag(false)}} />
      {/* </TouchableOpacity> */}
      <View style={{width:'95%',display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <View style={{display:'flex',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
          <Image source={Logo} style={{ width: 50, height: 50, borderRadius: 15,marginLeft:40,marginTop:15 }}/>
          <Text style={{ fontSize: 20,color:'white',marginTop:15 }}>{headerTitle}</Text>
        </View>
       
        <MaterialIcon onPress={()=>{setBottomSheetModalFlag(!bottomSheetModalFlag)}} style={{marginTop:15}} alignSelf="end" name={"notifications"} size={35} color={"#ffd740"} />
      </View>
      
    </View>
  );
  return (
   <>
      <Drawer.Navigator 
        
        initialRouteName="Dashboard" 
        drawerContent={props => <CustomSidebarMenu {...props} />}
        screenOptions={{  header:({ navigation }) => <CustomHeader navigation={navigation} />  }}
        >
        <Drawer.Screen 
        name="Dashboard"
        listeners={()=>{setHeaderTitle("Saepn Pvt.Ltd")}}
        component={DashboardScreen}  
        options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcon name={focused?"dashboard":"dashboard"} size={size} color={color} />
            )
          }}/>
        <Drawer.Screen 
        name="Profile" 
        listeners={()=>{setHeaderTitle("Profile")}}
        component={ProfileScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome6Icon name={focused?"user":"user"} size={size} color={color} />
          )
        }} />
        <Drawer.Screen 
        name="Attandance" 
        listeners={()=>{setHeaderTitle("Attandance")}}
        component={AttandanceScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcon name={focused?"pages":"pages"} size={size} color={color} />
          )
        }} />

        <Drawer.Screen 
        name="Conversations" 
        listeners={()=>{setHeaderTitle("Conservations")}}
        component={ConversationsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={'chatbubbles-outline'} size={size} color={color} />
          )
        }} />

        <Drawer.Screen 
        name="Results & Exams" 
        listeners={()=>{setHeaderTitle("Results & Exams")}}
        component={AttandanceScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcon name={'assessment'} size={size} color={color} />
          )
        }} />
        
        <Drawer.Screen 
        children={()=>{logout();}}
        name="Logout" 
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcon name={focused?"exit-to-app":"exit-to-app"} size={size} color={color} />
          )
        }} />
      </Drawer.Navigator>
      {bottomSheetModalFlag?<BottomSheetModalComponent onClose={(value)=>setBottomSheetModalFlag(value)} />:null}
   </> 
  )
}

