import React, { useState , useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import {
  Python_Url,
  getToken,

} from "../../utils/constants";

import { AlertComponent } from "../../components/Alert";



const TeacherMarkingScreen = ({courseid , student , setShowMarksSection}) => {
    const [midterm, setMidterm] = useState({ total_marks: null, obtained_marks: null, weightage: null });
    const [finalTerm, setFinalTerm] = useState({ total_marks: null, obtained_marks: null, weightage: null });
  
  const [quizItems, setQuizItems] = useState([]);
  const [assignmentItems, setAssignmentItems] = useState([]);
  
  
  const handleAddQuizItem = () => {
    setQuizItems([...quizItems, { total_marks: 0, obtained_marks: 0, weightage: 0 }]);
  };
  
  const handleAddAssignmentItem = () => {
    setAssignmentItems([...assignmentItems, { total_marks: 0, obtained_marks: 0, weightage: 0 }]);
  };
  const handleDeleteQuizItem = index => {
    const updatedItems = [...quizItems];
    updatedItems.splice(index, 1);
    setQuizItems(updatedItems);
  };

  const handleDeleteAssignmentItem = index => {
    const updatedItems = [...assignmentItems];
    updatedItems.splice(index, 1);
    setAssignmentItems(updatedItems);
  };



  useEffect(() => {
    // Fetch data from the API when the component mounts
    fetchMarksData();
  }, []);

  const fetchMarksData = async () => {
    try {
      let token = await getToken();
      const response = await fetch(`${Python_Url}/Get_result/${student}/${courseid}`, {
        method: 'GET',
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const marksData = await response.json();
console.log(marksData , "List fetch")
     // Set midterm and final term data
setMidterm(marksData.mid_term ? {
    total_marks: marksData.mid_term.total_marks ? marksData.mid_term.total_marks.toString() : null,
    obtained_marks: marksData.mid_term.obtained_marks ? marksData.mid_term.obtained_marks.toString() : null,
    weightage: marksData.mid_term.weightage ? marksData.mid_term.weightage.toString() : null
  } : { total_marks: null, obtained_marks: null, weightage: null });
  
  setFinalTerm(marksData.final_term ? {
    total_marks: marksData.final_term.total_marks ? marksData.final_term.total_marks.toString() : null,
    obtained_marks: marksData.final_term.obtained_marks ? marksData.final_term.obtained_marks.toString() : null,
    weightage: marksData.final_term.weightage ? marksData.final_term.weightage.toString() : null
  } : { total_marks: null, obtained_marks: null, weightage: null });
  
       // Set quiz data
const quizData = marksData.quiz || [];
setQuizItems(quizData.map(item => ({
  total_marks: item.total_marks.toString(), // Convert to string
  obtained_marks: item.obtained_marks.toString(), // Convert to string
  weightage: item.weightage.toString() // Convert to string
})));

// Set assignment data
const assignmentData = marksData.assignment || [];
console.log(assignmentData,"assign")
setAssignmentItems(assignmentData.map(item => {
  return {total_marks: item.total_marks.toString(), // Convert to string
  obtained_marks: item.obtained_marks.toString(), // Convert to string
  weightage: item.weightage.toString() // Convert to string
}
})); 
      }else{
        if (response.status === 401) {
            // Handle token expiration
            AlertComponent({
                title: "Message",
                message: "Session Expired!!",
                turnOnOkay: false,
                onOkay: () => {},
                onCancel: () => {
                    logout()
                },
            });
         
        }
        throw new Error('Failed to fetch marks data');  
    }

      
    } catch (error) {
      console.error('Error fetching marks data:', error);
    }
  };


  // Insert new Grades 


const handleSave = async () => {
    try {
     
      let token = await getToken();
      // Make API request to insert empty attendance record
      const response = await fetch(`${Python_Url}/result` , {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: token, 
      },
      body: JSON.stringify({
        student_id: student,
        course_id: courseid,
        quiz: quizItems,
        assignment: assignmentItems,
        mid_term: midterm,
        final_term: finalTerm,
        academic_year: 2024 // You may need to dynamically fetch this information based on your application logic
    })
      });
  
      if (!response.ok) {
        throw new Error('Failed to add record');
      }
  
      const responseData = await response.json();
  
  
      if (response.ok) {
     console.log(responseData)
    
       } else {
         
       // Check if token has expired
       if (response.status === 401) {
         // Handle token expiration
         AlertComponent({
             title: "Message",
             message: "Session Expired!!",
             turnOnOkay: false,
             onOkay: () => {},
             onCancel: () => {
                 logout()
             },
         });
      
     }
   
       }
  
  
  
    } catch (error) {
     // Handle error
     console.error('Error inserting  record:', error);
   
   }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity style={styles.iconButton} onPress={() => setShowMarksSection(false)}>
    <Ionicons name="chevron-back-outline" size={30} color="black" />
    <Text style={{   fontWeight: "bold", marginLeft : 10 , fontSize : 23}}>Teacher Marking:</Text>
  </TouchableOpacity>
    <Text style={styles.heading}>Midterm:</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Marks"
          value={midterm.total_marks}
          onChangeText={text => setMidterm({ ...midterm, total_marks: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Obtained Marks"
          value={midterm.obtained_marks}
          onChangeText={text => setMidterm({ ...midterm, obtained_marks: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Weightage"
          value={midterm.weightage}
          onChangeText={text => setMidterm({ ...midterm, weightage: text })}
          keyboardType="numeric"
        />
     

   
        <Text style={styles.heading}>Final Term:</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Marks"
          value={finalTerm.total_marks}
          onChangeText={text => setFinalTerm({ ...finalTerm, total_marks:text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Obtained Marks"
          value={finalTerm.obtained_marks}
          onChangeText={text => setFinalTerm({ ...finalTerm, obtained_marks: text })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Weightage"
          value={finalTerm.weightage}
          onChangeText={text => setFinalTerm({ ...finalTerm, weightage: text })}
          keyboardType="numeric"
        />
   

      {/* Quiz Section */}
     <View style={styles.section}>
  <Text style={styles.heading}>Quizzes</Text>
  {quizItems.map((item, index) => (
    <View key={index} style={styles.itemContainer}>
      <TextInput
        style={styles.input}
        placeholder={`Total Marks ${index + 1}`}
        value={item.total_marks} // Convert to string for TextInput value
        onChangeText={text => {
          const updatedItems = [...quizItems];
          updatedItems[index].total_marks = text; // Parse to float for numerical input
          setQuizItems(updatedItems);
        }}
        keyboardType="numeric" // Set keyboard type to numeric for numerical input
      />
      <TextInput
        style={styles.input}
        placeholder={`Obtained Marks ${index + 1}`}
        value={item.obtained_marks} // Convert to string for TextInput value
        onChangeText={text => {
          const updatedItems = [...quizItems];
          updatedItems[index].obtained_marks = text; // Parse to float for numerical input
          setQuizItems(updatedItems);
        }}
        keyboardType="numeric" // Set keyboard type to numeric for numerical input
      />
      <TextInput
        style={styles.input}
        placeholder={`Weightage ${index + 1}`}
        value={item.weightage} // Convert to string for TextInput value
        onChangeText={text => {
          const updatedItems = [...quizItems];
          updatedItems[index].weightage = text; // Parse to float for numerical input
          setQuizItems(updatedItems);
        }}
        keyboardType="numeric" // Set keyboard type to numeric for numerical input
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteQuizItem(index)}
      >
        <FontAwesome name="minus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  ))}
  <TouchableOpacity style={styles.addButton} onPress={handleAddQuizItem}>
    <FontAwesome name="plus" size={24} color="white" />
  </TouchableOpacity>
</View>


{/* Assignment section */}

<View style={styles.section}>
  <Text style={styles.heading}>Assignments</Text>
  {assignmentItems.map((item, index) => (
    <View key={index} style={styles.itemContainer}>
      <TextInput
        style={styles.input}
        placeholder={`Total Marks ${index + 1}`}
        value={item.total_marks} // Convert to string for TextInput value
        onChangeText={text => {
          const updatedItems = [...assignmentItems];
          updatedItems[index].total_marks = text; // Parse to float for numerical input
          setAssignmentItems(updatedItems);
        }}
        keyboardType="numeric" // Set keyboard type to numeric for numerical input
      />
      <TextInput
        style={styles.input}
        placeholder={`Obtained Marks ${index + 1}`}
        value={item.obtained_marks} // Convert to string for TextInput value
        onChangeText={text => {
          const updatedItems = [...assignmentItems];
          updatedItems[index].obtained_marks = text; // Parse to float for numerical input
          setAssignmentItems(updatedItems);
        }}
        keyboardType="numeric" // Set keyboard type to numeric for numerical input
      />
      <TextInput
        style={styles.input}
        placeholder={`Weightage ${index + 1}`}
        value={item.weightage} // Convert to string for TextInput value
        onChangeText={text => {
          const updatedItems = [...assignmentItems];
          updatedItems[index].weightage = text; // Parse to float for numerical input
          setAssignmentItems(updatedItems);
        }}
        keyboardType="numeric" // Set keyboard type to numeric for numerical input
      />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteAssignmentItem(index)}
      >
        <FontAwesome name="minus" size={20} color="white" />
      </TouchableOpacity>
    </View>
  ))}
  <TouchableOpacity style={styles.addButton} onPress={handleAddAssignmentItem}>
    <FontAwesome name="plus" size={24} color="white" />
  </TouchableOpacity>
</View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    iconButton:{
        flexDirection:'row',
        marginBottom:20

    },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TeacherMarkingScreen;
