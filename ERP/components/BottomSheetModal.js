import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

export default function BottomSheetModalComponent({ onClose }) {
  const bottomSheetModalRef = useRef(null);
  const [activeTab, setActiveTab] = useState('NOTIFICATION');

  const snapPoints = useMemo(() => [ '50%'], []);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    if (index === -1) onClose(false);
  }, [onClose]);

  const renderList = (data) => {
    return (
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {data.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <Image source={item.image} style={{ width: 60, height: 60, marginRight: 10 }} />
            <View><Text style={{color:"#1e88e5",fontWeight:'bold'}}>{item.text}</Text>
            <Text style={{color:'#9f9f9f'}}>2024-02-16 05:01:59</Text></View>
          </View>
        ))}
      </ScrollView>
    );
  };

  // Sample data for notifications and alerts
  const notifications = [
    { image: require('../assets/Notifications/pic1.jpg'), text: 'Semester Exchange Program - Fall 2024' },
    { image: require('../assets/Notifications/gif1.gif'), text: 'ERP & LMS Guidelines' },
    { image: require('../assets/Notifications/gif2.gif'), text: 'Rankings' },
    { image: require('../assets/Notifications/gif3.gif'), text: 'Students Forms' },
    // Add more notification items as needed
  ];

  const alerts = [
    { image: require('../assets/Notifications/gif4.gif'), text: 'Superior Gallery' },
    { image: require('../assets/Notifications/gif5.gif'), text: 'Policies' },
    // Add more alert items as needed
  ];

  // Renders
  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.tabContainer}>
            <View  style={activeTab=="NOTIFICATION"?{padding:'3%',borderBottomWidth:2,borderBottomColor:'#2196f3',display:'flex',flexDirection:'row',justifyContent:'center',alignContent:'center'}:{padding:'3%',display:'flex',flexDirection:'row',justifyContent:'center',alignContent:'center'}}><Text onPress={() => {setActiveTab('NOTIFICATION')}}>NOTIFICATIONS</Text></View>
            <View  style={activeTab=="ALERT"?{padding:'3%',borderBottomWidth:2,borderBottomColor:'#2196f3',display:'flex',flexDirection:'row',justifyContent:'center',alignContent:'center'}:{padding:'3%',display:'flex',flexDirection:'row',justifyContent:'center',alignContent:'center'}}><Text onPress={() => {setActiveTab('ALERT')}} >ALERTS       </Text></View>
       
          </View>
          {activeTab === 'NOTIFICATION' && renderList(notifications)}
          {activeTab === 'ALERT' && renderList(alerts)}
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tabContainer: {
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
  },
});
