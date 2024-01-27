import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {

    display:'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%',
  },
  logo:{
    marginLeft:8,
    width:200,
    height:200
  },
  text:{
    color:'rgba(117, 0, 88,255)',
    fontSize:20,
    fontWeight:'bold',
 
    position:'relative',
    top:20
  },
  spinner:{
    position:'relative',
    top:150

  }
});

export default styles;
