import styles from './Styles';
import { Text, View, Image, TextInput, Button} from 'react-native';
// import MapView from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';
export default function CampusMap(){
    const markers = [
        {
          coordinate: {
            latitude: 31.3340,
            longitude: 74.2359,
          },
          title: "Main Campus",
          description: "This is the main administrative building.",
        },
        {
          coordinate: {
            latitude: 31.4190,
            longitude: 74.2303,
          },
          title: "Gold Campus",
          description: "CSIT Deparment",
        },
        // {
        //   coordinate: {
        //     latitude: 37.787,
        //     longitude: -122.434,
        //   },
        //   title: "Student Center",
        //   description: "Hang out with friends and grab a bite to eat.",
        // },
      ];
    return (<> 
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
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
          />
        ))}
      </MapView>
    </View>
  </>)
}