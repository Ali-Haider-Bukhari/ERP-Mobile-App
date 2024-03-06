import {Alert} from 'react-native';
export function AlertComponent({title,message,onCancel,turnOnOkay,onOkay}){
    Alert.alert(
        title,
        message,
        turnOnOkay==false?[
          {
            text: 'Cancel',
            onPress: () => onCancel(),//Alert.alert('Cancel Pressed'),
            style: 'cancel',
          }
        ]:[   {
            text: 'Cancel',
            onPress: () => onCancel(),//Alert.alert('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Okay',
            onPress: () => onOkay(),//Alert.alert('Cancel Pressed'),
            style: 'cancel',
          }],
    )
}