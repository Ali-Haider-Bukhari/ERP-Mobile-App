import React from 'react';
import { FlatList, Text, View, Image, StyleSheet , TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
export default function Students({ students , showAttandence }) {
    const renderImage = (imageUrl) => {
        if (imageUrl) {
            return (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    onError={() => console.log("Error loading image")} // Log an error if image fails to load
                />
            );
        } else {
            // Return a default image if imageUrl is not available
            return (
                <Image
                    source={require('../../assets/chat.jpg')} // Provide path to default image
                    style={styles.image}
                />
            );
        }
    };

    return (

<>
<TouchableOpacity style={styles.iconButton} onPress={() => showAttandence(false)}>
    <Ionicons name="chevron-back-outline" size={30} color="black" />
    <Text style={{   fontWeight: "bold", marginLeft : 10 , fontSize : 23}}>Students</Text>
  </TouchableOpacity>
  {students.length > 0 ? (<>
               
<FlatList
            data={students}
            renderItem={({ item }) => (
              
               <View style={styles.container}>
               
                    <View style={styles.card}>
                    <View style={styles.imageContainer}>
                            {renderImage(item.image)}
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.name}>{item.name || 'Name not found'}</Text>
                            <Text style={styles.info}>{item.email || 'Email not found'}</Text>
                            {/* <Text style={styles.info}>{item.role || 'Role not found'}</Text> */}
                            {/* <Text style={styles.info}>{item.address || 'Address not found'}</Text> */}
                            {/* <Text style={styles.info}>{item.blood_group || 'Blood group not found'}</Text> */}
                            {/* <Text style={styles.info}>{item.date_of_birth || 'Date of birth not found'}</Text> */}
                            {/* <Text style={styles.info}>{item.gender || 'Gender not found'}</Text> */}
                            {/* <Text style={styles.info}>{item.program || 'Program not found'}</Text> */}
                            {/* <Text style={styles.info}>{item.contact || 'Contact not found'}</Text> */}
                            {/* <Text style={styles.info}>Attendance Status: {item.attendance_status || 'Status not found'}</Text> */}
                        </View>
                    </View>
                     
              
                </View>
            )}
            keyExtractor={(item, index) => index.toString()} // Use index as key
        />
          </>) : (
                    <>
                    <Text style={{alignItems : 'center' , alignSelf : 'center' , color : 'black'}}>
                        No Students Founds.
                    </Text>
                    
                    </>
                )}
</>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        // marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageContainer: {
        justifyContent: 'center', // Center the content vertically
        alignItems: 'center', // Center the content horizontally
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40, // Make the image rounded
        marginRight: 10,
    },
    details: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    info: {
        fontSize: 14,
        marginBottom: 3,
    },
    iconButton: {
 flexDirection: 'row',
        padding: 10,
       
      },
});
