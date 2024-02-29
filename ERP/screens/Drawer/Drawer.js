import * as React from 'react';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';
import { createDrawerNavigator,DrawerContentScrollView,
  DrawerItemList,
  DrawerItem, } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../Dashboard/Dashboard';
import ProfileScreen from '../Profile/Profile';
import AttandanceScreen from '../Attandance/Attandance';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
// import Ionicons from 'react-native-vector-icons/Ionicons'
import Login from '../Login/Login';
const picture = require(`../../assets/SirTalha.jpeg`);
const Logo = require("../../assets/logo.png");






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
  const Drawer = createDrawerNavigator();
  const navigation = useNavigation();

  const CustomHeader = ({ navigation })  => (
    <View style={{ height:80,flexDirection: 'row', justifyContent: 'start',alignItems:'center', paddingHorizontal: 16, paddingVertical: 8,backgroundColor:'rgba(4,28,92,255)' }}>
      {/* <TouchableOpacity onPress={() => navigation.toggleDrawer()}> */}
        <Ionicons style={{marginTop:15}} name="menu" size={30} color="white" onPress={() => navigation.toggleDrawer()} />
      {/* </TouchableOpacity> */}
      <Image source={Logo} style={{ width: 50, height: 50, borderRadius: 15,marginLeft:40,marginTop:15 }}/>
      <Text style={{ fontSize: 20,color:'white',marginTop:15 }}>Saepn Pvt.Ltd</Text>
      {/* <View></View>  */}
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
        component={DashboardScreen}  
        options={{
            drawerIcon: ({ focused, color, size }) => (
              <MaterialIcon name={focused?"dashboard":"dashboard"} size={size} color={color} />
            )
          }}/>
        <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <FontAwesome6Icon name={focused?"user":"user"} size={size} color={color} />
          )
        }} />
        <Drawer.Screen 
        name="Attandance" 
        component={AttandanceScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcon name={focused?"pages":"pages"} size={size} color={color} />
          )
        }} />

        <Drawer.Screen 
        name="Conversations" 
        component={AttandanceScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons name={'chatbubbles-outline'} size={size} color={color} />
          )
        }} />

        <Drawer.Screen 
        name="Results & Exams" 
        component={AttandanceScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcon name={'assessment'} size={size} color={color} />
          )
        }} />
        
        <Drawer.Screen 
        name="Logout" 
        component={()=>{navigation.navigate('Login')}}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <MaterialIcon name={focused?"exit-to-app":"exit-to-app"} size={size} color={color} />
          )
        }} />
      </Drawer.Navigator>
   </> 
  )
}

