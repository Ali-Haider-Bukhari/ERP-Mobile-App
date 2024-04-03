import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';


const EditUserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    _id: user._id || '',
    email: user.email || '',
    password: user.password || '',
    username: user.username || '',
    roll_number: user.roll_number || '',
    contact: user.contact || '',
    program: user.program || '',
    gender: user.gender.split("UserGender.")[1] || '',
    cnic: user.cnic || '',
    blood_group: user.blood_group || '',
    address: user.address || '',
    semester: user.semester || '',
    date_of_birth: user.date_of_birth || '',
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <View style={styles.container}>
        <Text style={styles.title} >
            Edit User
        </Text>
      <ScrollView>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          placeholder="Email"
        />
     
        <TextInput
          style={styles.input}
          value={formData.username}
          onChangeText={(value) => handleChange('username', value)}
          placeholder="Username"
        />
        <TextInput
          style={styles.input}
          value={formData.roll_number}
          onChangeText={(value) => handleChange('roll_number', value)}
          placeholder="Roll Number"
        />
        <TextInput
          style={styles.input}
          value={formData.contact}
          onChangeText={(value) => handleChange('contact', value)}
          placeholder="Contact"
        />
        <TextInput
          style={styles.input}
          value={formData.program}
          onChangeText={(value) => handleChange('program', value)}
          placeholder="Program"
        />
        <TextInput
          style={styles.input}
          value={formData.gender}
          onChangeText={(value) => handleChange('gender', value)}
          placeholder="Gender"
        />
        <TextInput
          style={styles.input}
          value={formData.cnic}
          onChangeText={(value) => handleChange('cnic', value)}
          placeholder="CNIC"
        />
        <TextInput
          style={styles.input}
          value={formData.blood_group}
          onChangeText={(value) => handleChange('blood_group', value)}
          placeholder="Blood Group"
        />
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(value) => handleChange('address', value)}
          placeholder="Address"
        />
        <TextInput
          style={styles.input}
          value={formData.semester}
          onChangeText={(value) => handleChange('semester', value)}
          placeholder="Semester"
        />
        <TextInput
          style={styles.input}
          value={formData.date_of_birth}
          onChangeText={(value) => handleChange('date_of_birth', value)}
          placeholder="Date of Birth"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onCancel}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title:{
marginLeft:15 ,
marginTop:20,
marginBottom:20,
fontSize:29,
fontWeight:'bold'
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default EditUserForm;