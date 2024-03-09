import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const GradingScreen = ({ navigation }) => {
  const [studentId, setStudentId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [quiz, setQuiz] = useState('');
  const [assignment, setAssignment] = useState('');

  const handleCreateResult = async () => {
    try {
      const response = await fetch('http://your-server-url/create_result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          teacher_id: teacherId,
          course_id: courseId,
          quiz: quiz,
          assignment: assignment,
          mid_term: null, // Add logic for mid_term and final_term if needed
          final_term: null,
          academic_year: 2024, // Example academic year
        }),
      });
      const data = await response.json();
      console.log(data); // Handle response as needed
      navigation.navigate('ResultDetails', { resultId: data.result_id });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAppendQuiz = async () => {
    try {
      const response = await fetch('http://your-server-url/append_quiz', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result_id: 'result_id_here', // Replace with actual result ID
          quiz: quiz,
        }),
      });
      const data = await response.json();
      console.log(data); // Handle response as needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAppendAssignment = async () => {
    try {
      const response = await fetch('http://your-server-url/append_assignment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          result_id: 'result_id_here', // Replace with actual result ID
          assignment: assignment,
        }),
      });
      const data = await response.json();
      console.log(data); // Handle response as needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Create Result</Text>
      <TextInput
        style={{ borderWidth: 1, width: 200, marginBottom: 10 }}
        placeholder="Student ID"
        value={studentId}
        onChangeText={setStudentId}
      />
      <TextInput
        style={{ borderWidth: 1, width: 200, marginBottom: 10 }}
        placeholder="Teacher ID"
        value={teacherId}
        onChangeText={setTeacherId}
      />
      <TextInput
        style={{ borderWidth: 1, width: 200, marginBottom: 10 }}
        placeholder="Course ID"
        value={courseId}
        onChangeText={setCourseId}
      />
      <TextInput
        style={{ borderWidth: 1, width: 200, marginBottom: 10 }}
        placeholder="Quiz"
        value={quiz}
        onChangeText={setQuiz}
      />
      <Button title="Append Quiz" onPress={handleAppendQuiz} />
      <TextInput
        style={{ borderWidth: 1, width: 200, marginBottom: 10 }}
        placeholder="Assignment"
        value={assignment}
        onChangeText={setAssignment}
      />
      <Button title="Append Assignment" onPress={handleAppendAssignment} />
      <Button title="Create Result" onPress={handleCreateResult} />
    </View>
  );
};

export default GradingScreen;
