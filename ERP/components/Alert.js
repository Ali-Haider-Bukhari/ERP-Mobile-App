import {Alert} from 'react-native';
export function AlertComponent({title,message,onCancel,turnOnOkay,onOkay}){
    Alert.alert(
        title,
        message,
        [
            !turnOnOkay?
          {
            text: 'Cancel',
            onPress: () => onCancel(),//Alert.alert('Cancel Pressed'),
            style: 'cancel',
          }:
          {
            text: 'Cancel',
            onPress: () => onCancel(),//Alert.alert('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Okay',
            onPress: () => onOkay(),//Alert.alert('Cancel Pressed'),
            style: 'cancel',
          }
        ],
        // {
        //   cancelable: true,
        //   onDismiss: () =>
        //     Alert.alert(
        //       'This alert was dismissed by tapping outside of the alert dialog.',
        //     ),
        // },
    )
}