import  React,{useState,useEffect,useContext} from 'react';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image , TouchableOpacity} from 'react-native';
import { createDrawerNavigator,DrawerContentScrollView,
  DrawerItemList,
  DrawerItem, } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import DashboardScreen from '../screens/Dashboard/Dashboard';
import ProfileScreen from '../screens/Profile/Profile';
import AttandanceScreen from '../screens/Attandance/Attandance';
import ConversationsScreen from '../screens/Conversations/Conversations';
// import Ionicons from 'react-native-vector-icons/Ionicons'
import Login from '../screens/Login/Login';
const picture = require(`../assets/SirTalha.jpeg`);
const Logo = require("../assets/logo.png");
import { AuthContext } from '../contexts/AuthContext';
import BottomSheetModalComponent from './BottomSheetModal';
import ResultsExamsScreen from '../screens/ResultsExams/ResultsExams';
import { useGlobalContext } from '../contexts/GlobalContext';
import InvoicePage from '../screens/Invoice/invoice';
import Courses_Students from '../screens/Courses_Students/courses_students';
import { Python_Url } from '../utils/constants';
import ChatButton from './ChatButton';
import CampusMap from '../screens/CampusMap/CampusMap';

const CustomSidebarMenu = (props) => {

  const {user} = useContext(AuthContext)
  const [imageUri,setImageUri] = useState("")

  useEffect(() => {
    // Define the URL of your Flask API
    if(user!=null){

      fetch(`${Python_Url}/fetch_image/${user.image}`,{method: 'GET'})
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

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    // resizeMode: 'center',
    marginTop:40,
    width: '33%',
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
          source={imageUri!=""?{uri:imageUri}:require('../assets/logo.png')}
          style={styles.sideMenuProfileIcon}
        />
        <View style={{marginTop:10,display:'flex',justifyContent:'center'}}>
          <Text style={{color:'white',fontWeight:'bold',alignSelf:'center'}}>
            {user?.role!="ADMIN"?user.username:"Admin"}
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
 

const styles = StyleSheet.create({
  headerContainer: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'rgba(4,28,92,255)',
  },
  menuIcon: {
    marginRight: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 15,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
  },
  notificationsIcon: {
    marginLeft: 20,
  },
});
export default function DrawerScreen() {
  const {logout} = React.useContext(AuthContext)
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();
  const [bottomSheetModalFlag,setBottomSheetModalFlag] = useState(false)
  const [headerTitle,setHeaderTitle] = useState("Saepn Pvt.Ltd")
  const {selectedCourse,setSelectedCourse} = useGlobalContext()
  const {user} = React.useContext(AuthContext)

  const CustomHeader = ({ navigation })  => (
    <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.menuIcon}>
      <Ionicons name="menu" size={30} color="white" />
    </TouchableOpacity>
    <View style={styles.logoContainer}>
      <Image source={Logo} style={styles.logoImage} />
      <Text style={styles.headerTitle}>{headerTitle}</Text>
    </View>
    <TouchableOpacity onPress={() => setBottomSheetModalFlag(!bottomSheetModalFlag)} style={styles.notificationsIcon}>
      <MaterialIcon  name="notifications" size={30} color="#ffd740" />
    </TouchableOpacity>
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
        listeners={()=>{setHeaderTitle("Saepn Pvt.Ltd"); setSelectedCourse(null)}}
        component={DashboardScreen}  
        options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcon name={focused?"dashboard":"dashboard"} size={size} color={color} />
            )
          }}/>
        {user?.role!="ADMIN"?<Drawer.Screen 
        name="Profile" 
        listeners={()=>{setHeaderTitle("Profile")}}
        component={ProfileScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome6Icon name={focused?"user":"user"} size={size} color={color} />
          )
        }} />:null}
        {user?.role!="ADMIN"?<Drawer.Screen 
        name="Campus Map" 
        listeners={()=>{setHeaderTitle("Campus Map")}}
        component={CampusMap}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome5Icon name={'map-marker-alt'} size={size} color={color} />
          )
        }} />:null}
    {user?.role == "STUDENT" && (<>
        <Drawer.Screen 
      name="Invoice" 
      listeners={()=>{setHeaderTitle("Invoice")}}
      component={InvoicePage}
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <FontAwesome6Icon name={'file-invoice'} size={size} color={color} />
        )
      }} />
      </>)} 
        {user?.role!="ADMIN"?<Drawer.Screen 
        name="Attandance" 
        listeners={()=>{setHeaderTitle("Attandance")}}
        component={AttandanceScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcon name={focused?"pages":"pages"} size={size} color={color} />
          )
        }} />:null}

        <Drawer.Screen 
        name="Conversations" 
        listeners={()=>{setHeaderTitle("Conversations")}}
        component={ConversationsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={'chatbubbles-outline'} size={size} color={color} />
          )
        }} />

        {user?.role!="ADMIN"?<Drawer.Screen 
        name="Results & Exams" 
        listeners={()=>{setHeaderTitle("Results & Exams")}}
        component={ResultsExamsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcon name={'assessment'} size={size} color={color} />
          )
        }} />
        :null}
       

        {user?.role == "TEACHER" && (<>
        
       
        <Drawer.Screen 
      name="Courses & Students" 
      listeners={()=>{setHeaderTitle("Courses & Students")}}
      component={Courses_Students}
      options={{
        drawerIcon: ({ focused, color, size }) => (
          <MaterialIcon name={'login'} size={size} color={color} />
        )
      }} />
      </>)} 


    


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
      {user!=null&&headerTitle!='Conversations'?<ChatButton onPress={()=>{navigation.navigate('Conversations', { key: 'bot' });}}/>:null}
   </> 
  )
}

