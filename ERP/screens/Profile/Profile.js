import { useNavigation } from '@react-navigation/native';
import { View, Text, Button ,StyleSheet ,SafeAreaView, Image} from 'react-native';

export default function ProfileScreen() {
    const navigation = useNavigation();
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Notifications Screen</Text>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
  }