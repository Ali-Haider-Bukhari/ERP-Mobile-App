import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    backgroundColor:'rgb(233, 218, 237)',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100%',
    width:'100%'
  },
  container: {
    backgroundColor:'white',
    display:'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'start',
    width:'90%',
    height:'80%',
    borderRadius:10,


    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // Shadow properties for Android
    elevation: 20,
  },
  logo:{
    width:100,
    height:100
  },
  bannerText:{
    marginTop:10,
    fontSize:20
  },
  bannerText2:{
    marginTop:5,
    fontWeight:'bold',
    color:'grey',
    fontSize:20
  },
  bannerText3:{
    color:'red',
    width:200,
   
  },
  input1: {
    height: 40,
    borderColor: 'rgb(200, 200, 200)',
    borderWidth: 1,
    marginTop:10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    width: 200,
    borderRadius:5,
    color:'grey'
  },
  input2: {
    height: 40,
    borderColor: 'rgb(200, 200, 200)',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    width: 200,
    borderRadius:5,
    color:'grey'
  },
  button:{
    marginTop:2,
    width:200,
  },
  reset:{
    width:'60%',
    marginTop:5

  }
});

export default styles;