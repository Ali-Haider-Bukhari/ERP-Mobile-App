import AsyncStorage from '@react-native-async-storage/async-storage';

export const DB_URL = `mongodb+srv://haidermubeendoctornow:haidermubeendoctornow@doctornow.njbjumi.mongodb.net/UMS`
export const Python_Url = 'http://192.168.1.109:5000'
export const Chat_Bot_ID="65eb07b9fd5eaffecaa37729"
export const storeToken = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      console.log('Token stored successfully');
    } catch (error) {
      console.error('Error storing token:', error);
    }
  };
  
export const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };
  
export const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      console.log('Token removed successfully');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  };

export async function verifyTokenRequest(token) {
  const url = `${Python_Url}/verify-token`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    const responseData = await response.json();

    if (response.status === 200) {
      return { data: responseData.user, message: responseData.message };
    } else if (response.status === 401) {
      return { data: null, message: responseData.message};
    } else {
      return { data: null, message: 'Request failed' };
    }
  } catch (error) {
    console.error('Error:', error.message);
    return { data: null, error: 'Request failed' };
  }
  };
  


  export async function fetchByUserId(token,userid) {
    const url = `${Python_Url}/users/${userid}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
  
      const responseData = await response.json();
  
      if (response.status === 200) {
        return { data: responseData, message: "success" };
      } else if (response.status === 401) {
        return { data: null, message: responseData.message};
      } else {
        return { data: null, message: 'Request failed' };
      }
    } catch (error) {
      console.error('Error:', error.message);
      return { data: null, error: 'Request failed' };
    }
    };
    

    export async function update(token,userid,object) {
      const url = `${Python_Url}/users/update/${userid}`;
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body:JSON.stringify(object)
        });
    
        const responseData = await response.json();
    
        if (response.status === 200) {
          return { data: responseData.user, message: "Edit Successful!" };
        } else if (response.status === 401) {
          return { data: null, message: responseData.message};
        } else {
          return { data: null, message: 'Request failed' };
        }
      } catch (error) {
        console.error('Error:', error.message);
        return { data: null, error: 'Request failed' };
      }
      };
      