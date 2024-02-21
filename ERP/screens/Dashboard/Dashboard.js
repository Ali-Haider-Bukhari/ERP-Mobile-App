import { useNavigation } from '@react-navigation/native';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';

export default function DashboardScreen() {
    const navigation = useNavigation();
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          onPress={() => navigation.navigate('Notifications')}
          title="Go to Notifications"
        /> 
      </View>
    );
  }