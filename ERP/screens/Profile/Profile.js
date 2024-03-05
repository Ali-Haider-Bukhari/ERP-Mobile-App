import React,{useEffect} from 'react';
import { useNavigation,useRoute } from '@react-navigation/native';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';

export default function ProfileScreen() {
    const navigation = useNavigation();    

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Notifications Screen</Text>
        <Button onPress={() => navigation.navigate("Attandance")} title="Go back home" />
      </View>
    );
  }