import styles from './Styles';
import { Text, View, Image, TextInput, Button} from 'react-native';
// import MapView from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';
import { Python_Url, getToken } from '../../utils/constants';
import { AlertComponent } from '../../components/Alert';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
export default function CampusMap(){
  const {logout,user} = useContext(AuthContext)
  const [markers,setMarkers] = useState([])
  const [latitude,setLatitude] = useState(0)
  const [longitude,setLongitude] = useState(0)

  useEffect(() => {
    getToken().then(async (token)=>{
      try {
        const url = `${Python_Url}/getLocations`
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
          console.log('Response data:', data);
          setMarkers(data.map((value)=>{
            return {"description":value.description,
                    "title":value.title,
                    "coordinate":{
                      "latitude":value.latitude,
                      "longitude":value.longitude
                    }                           
                  }
      }))
        } else {
          // Handle error response
          if(data.message == "Token has expired"){
            AlertComponent({
                title:'Message',
                message:'Session Expired!!',
                turnOnOkay:false,
                onOkay:()=>{},
                onCancel:()=>{logout()}},)
          }
          console.error('Error:', data);
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error:', error);
      }
    })
  }, [])

  useEffect(() => {
    if(markers.length>0){
      setLatitude(markers[0].coordinate.latitude.toString())
      setLongitude(markers[0].coordinate.longitude.toString())
    }
  }, [markers])
  

  const handleLatitude = (latitude) =>{
    setLatitude(latitude)
  }
  
  const handleLongitude = (longitude) =>{
    setLongitude(longitude)
  }
    
    return (<> 
    
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1}}
        initialRegion={{
          latitude: 31.3340,
          longitude: 74.2359,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            draggable={true}
            accessible={true}
          >
            {/* <Image source={require('../../assets/logo.png')} style={{height:50,width:50}} /> */}
         </Marker>
        ))}
      </MapView>
    </View>

    {user.role=="ADMIN"&&
    <View style={{ flex:1 ,alignSelf:'center',alignItems:'center',justifyContent:'center'}}>
      
              <TextInput

                style={{
                  height: 40,
                  borderColor: 'rgb(200, 200, 200)',
                  borderWidth: 1,
                  marginTop:10,
                  marginBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  width: 200,
                  borderRadius:5,
                  color:'black',
                  borderColor:'black'}}
                
                placeholder="Latitude"
                onChangeText={handleLatitude}
                value={latitude}
                keyboardType="numeric"
              />
              <TextInput
                style={{
                  height: 40,
                  borderColor: 'rgb(200, 200, 200)',
                  borderWidth: 1,
                  marginTop:10,
                  marginBottom: 10,
                  paddingLeft: 10,
                  paddingRight: 10,
                  width: 200,
                  borderRadius:5,
                  color:'black',
                  borderColor:'black'}}
                
                placeholder="Longitude"
                onChangeText={handleLongitude}
                value={longitude}
                keyboardType="numeric"
              />

    </View>}
  </>)
}