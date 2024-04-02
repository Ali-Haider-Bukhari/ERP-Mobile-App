import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView, Image, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6Icon from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default function BottomSheetModalComponent({ onClose }) {
  const bottomSheetModalRef = useRef(null);
  const [activeTab, setActiveTab] = useState('NOTIFICATION');
  const [currentPage, setCurrentPage] = useState(1);
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

  const totalPagesNotifications = Math.ceil(notifications.length / 4);
  const totalPagesAlerts = Math.ceil(alerts.length / 4);

  const snapPoints = useMemo(() => [ '50%'], []);

  useEffect(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    if (index === -1) onClose(false);
  }, [onClose]);

  const renderList = (data) => {
    const itemsPerPage = 4;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);
    
    
    return (
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {data.slice(startIndex, endIndex).map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <Image source={item.image} style={{ width: 50, height: 50, marginRight: 10 }} />
            <View>
              <Text style={{color:"#1e88e5",fontWeight:'bold'}}>{item.text}</Text>
              <Text style={{color:'#9f9f9f'}}>2024-02-16 05:01:59</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  // Sample data for notifications and alerts
 
  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

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
            <TouchableOpacity 
              style={activeTab === "NOTIFICATION" ? styles.activeTab : styles.tab} 
              onPress={() => {setActiveTab('NOTIFICATION');setCurrentPage(1);} }
            >
              <Text>NOTIFICATIONS</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={activeTab === "ALERT" ? styles.activeTab : styles.tab} 
              onPress={() => {setActiveTab('ALERT');setCurrentPage(1);}}
            >
              <Text>ALERTS</Text>
            </TouchableOpacity>
          </View>
          {currentPage!=1&&<TouchableOpacity style={styles.prevPageButton} onPress={prevPage}>
          <MaterialIcon name={'arrow-upward'} size={25}  color={'white'}/>
          </TouchableOpacity>}

          {activeTab === 'NOTIFICATION' && renderList(notifications)}
          {activeTab === 'ALERT' && renderList(alerts)}
         
          {currentPage != totalPagesNotifications && activeTab=="NOTIFICATION"&&<TouchableOpacity style={styles.nextPageButton} onPress={nextPage}>
          <MaterialIcon name={'arrow-downward'} size={25}  color={'white'}/>
          </TouchableOpacity>}

          {currentPage != totalPagesAlerts && activeTab!="NOTIFICATION"&&<TouchableOpacity style={styles.nextPageButton} onPress={nextPage}>
          <MaterialIcon name={'arrow-downward'} size={25}  color={'white'}/>
          </TouchableOpacity>}
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
  tab: {
    padding: '3%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  activeTab: {
    padding: '3%',
    borderBottomWidth: 2,
    borderBottomColor: '#2196f3',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
  },
  nextPageButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#2196f3',
    borderRadius: 50,
    position: 'absolute',
    bottom: 10,
    zIndex: 999,
  },
  prevPageButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#9e9e9e',
    borderRadius: 50,
    
    position: 'absolute',
    // bottom: 300,
    zIndex: 999,
    
  },
  pageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
