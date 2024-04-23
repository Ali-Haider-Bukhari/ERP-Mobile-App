import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Python_Url, getToken } from "../../utils/constants";
import { AlertComponent } from "../../components/Alert";

const AddCourseForm = () => {
  const [formData, setFormData] = useState({
    course_name: '',
    credit_hour: '',
  });
  const [displayCourses, setDisplayCourses] = useState(false);
  const [courses, setCourses] = useState([]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      let token = await getToken();
 // Prepare request data
 const requestData = {
    course_name: formData.course_name,
    credit_hour: parseFloat(formData.credit_hour), // Convert credit_hour to string
  };
      // Send POST request to the Flask API
      const response = await fetch(`${Python_Url}/add_courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(requestData),
      });
      const data = response.json();
      // Check if the request was successful
      if (response.ok) {
        fetchCourses()
        // Handle successful response
        console.log("Course Create successfully");

     
      } else {
        if (data.message == "Token has expired") {
          AlertComponent({
            title: "Message",
            message: "Session Expired!!",
            turnOnOkay: false,
            onOkay: () => {},
            onCancel: () => {},
          });
        }
        // const errorData = await response.json();
        // console.error("Update failed:", errorData.error);
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Update failed:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      let token = await getToken();

      const response = await fetch(`${Python_Url}/fetch_courses`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      });

      if (response.ok) {
        const coursesData = await response.json();
        setCourses(coursesData);
        setDisplayCourses(true);
      } else {
        // Handle error response
        if (data.message == "Token has expired") {
            AlertComponent({
              title: "Message",
              message: "Session Expired!!",
              turnOnOkay: false,
              onOkay: () => {},
              onCancel: () => {},
            });
          }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };


  const handleDeleteCourse = async (courseId) => {
    try {
      let token = await getToken();
  
      const response = await fetch(`${Python_Url}/delete_course/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });
  
      if (response.ok) {
        // Remove the deleted course from the UI
        setCourses(courses.filter(course => course.id !== courseId));
        // Handle successful deletion
        console.log("Course deleted successfully");
      } else {
        if (data.message == "Token has expired") {
            AlertComponent({
              title: "Message",
              message: "Session Expired!!",
              turnOnOkay: false,
              onOkay: () => {},
              onCancel: () => {},
            });
          }
        // Handle error response
        console.error("Failed to delete course");
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Delete failed:", error);
    }
  };
  
  const onCancel = () => {
    setDisplayCourses(false);
  };

  return (
    <View style={styles.container}>
    
   
{/*  Fetch Courses */}
      {displayCourses ? (
        <>
           <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setDisplayCourses(false)
        }}
      >
        <Text style={styles.buttonText}>
    Hide Courses
        </Text>
      </TouchableOpacity>
    
        <ScrollView>
          {courses.map((course, index) => (
           // Inside the map function for displaying courses
<View style={styles.courseContainer}>
  <Text style={styles.courseName}>{course.course_name}</Text>
  <Text style={styles.creditHour}>{course.credit_hour}</Text>
  {/* delete */}
  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => handleDeleteCourse(course.id)}
  >
    <Text style={styles.deleteButtonText}>Delete</Text>
  </TouchableOpacity>
</View>

          ))}
        </ScrollView>
        </>
      ) : (<>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          fetchCourses();
        }}
      >
        <Text style={styles.buttonText}>
    Show Courses
        </Text>
      </TouchableOpacity>
  <Text style={styles.title}>Add New Course</Text>

      <TextInput
        style={styles.input}
        value={formData.course_name}
        onChangeText={(value) => handleChange("course_name", value)}
        placeholder="Course Name"
      />
      <TextInput
        style={styles.input}
        value={formData.credit_hour}
        onChangeText={(value) => handleChange("credit_hour", value)}
        placeholder="Credit Hour"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
          
      </>) }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    marginLeft: 15,
    marginTop: 20,
    marginBottom: 20,
    fontSize: 29,
    fontWeight: "bold",
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  courseContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  creditHour: {
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddCourseForm;