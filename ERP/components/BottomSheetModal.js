import React, { useCallback, useMemo, useRef,useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

export default function BottomSheetModalComponent({onClose}){
    const bottomSheetModalRef = useRef(bottomSheetModalRef?.current?.present());
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    
    useEffect(() => {
        bottomSheetModalRef.current?.present()
    }, []) 

    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
      if(index == -1)
      onClose(false)
    }, []);
  
    // renders
    return (
      <BottomSheetModalProvider>
       
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
          >
            <BottomSheetView style={styles.contentContainer}>
              <Text>Awesome 🎉</Text>
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
  });
  