import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import your icon library
import { Python_Url , getToken } from '../../utils/constants';
import { AlertComponent } from "../../components/Alert";
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../contexts/AuthContext';


 
// Function to generate random invoice data
const generateRandomInvoiceData = () => {
    
    // Helper function to generate random invoice number
    const generateRandomInvoiceNumber = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let invoiceNo = '';
        for (let i = 0; i < 8; i++) {
            invoiceNo += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return invoiceNo; 
    };

    // Helper function to generate random date within a range
    const generateRandomDate = (start, end) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    };

    // Generate random invoice data
    const randomDate = generateRandomDate(new Date(2023, 0, 1), new Date()); // Random past date within the last year
    const randomDueDate = generateRandomDate(new Date(), new Date(new Date().getFullYear(), 11, 31)); // Random due date within this year
    return {
        invoiceNo: generateRandomInvoiceNumber(),
        invoiceDate: randomDate.toLocaleDateString(),
        dueDate: randomDueDate.toLocaleDateString(),
        term: `${Math.floor(Math.random() * 24) + 7} days`, // Random payment term between 7 and 30 days
        receiptFor: `Item ${Math.floor(Math.random() * 100)}`, // Random product name
        barcode: generateRandomInvoiceNumber(), // Random barcode
        totalAmount: Math.floor(Math.random() * 901) + 100, // Random total amount between 100 and 1000
        paid: Math.floor(Math.random() * 101), // Random amount paid between 0 and 100
        balance: function() { return this.totalAmount - this.paid; }, // Calculate balance
        status: ['Pending', 'Paid', 'Overdue'][Math.floor(Math.random() * 3)], // Random status
        printSave: 'Print/Save', // Static value
        downloaded: Math.random() < 0.5, // Random boolean value
        downloadedDate: generateRandomDate(new Date(new Date().getFullYear(), 0, 1), new Date()).toLocaleDateString() // Random recent date for downloaded date within this year
    };
};

// Generate 10 random invoice data entries
const invoiceList = Array.from({ length: 10 }, generateRandomInvoiceData);

const InvoicePage = () => {
  const {logout} = useContext(AuthContext)
    const navigation = useNavigation();
    const handleDownloadPDF = async (invoiceData) => {
        try {
            let token = await getToken();
            const response = await fetch(`${Python_Url}/api/invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token,
                },
                body: JSON.stringify(invoiceData),
            });
    
            // Check for successful response
            if (response.ok) {
                const blob = await response.blob();
              // Log the content of the Blob
            console.log('Blob content:', blob);

            
            } else if (response.status === 401) {
                // Handle token expiration
                AlertComponent({
                    title: "Message",
                    message: "Session Expired!!",
                    turnOnOkay: false,
                    onOkay: () => { },
                    onCancel: () => {
                        logout()
                    },
                });
            } else {
                // Handle other errors
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice No:</Text>
            <Text style={styles.value}>{item.invoiceNo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Invoice Date:</Text>
            <Text style={styles.value}>{item.invoiceDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Due Date:</Text>
            <Text style={styles.value}>{item.dueDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Term:</Text>
            <Text style={styles.value}>{item.term}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Receipt For:</Text>
            <Text style={styles.value}>{item.receiptFor}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Barcode:</Text>
            <Text style={styles.value}>{item.barcode}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount:</Text>
            <Text style={styles.value}>${item.totalAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Paid:</Text>
            <Text style={styles.value}>${item.paid}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Balance:</Text>
            <Text style={styles.value}>${item.balance()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, { color: item.status === 'Overdue' ? 'red' : 'green' }]}>{item.status}</Text>
          </View>
          <TouchableOpacity style={styles.printSaveButton}>
            <Text style={styles.printSaveText}>{item.printSave}</Text>
          </TouchableOpacity>

          {/* downalod  */}
          <TouchableOpacity style={styles.downloadButton}  onPress={() => handleDownloadPDF(item)}>
            <Icon name="download" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      );
      

  return (
    <View style={styles.container}>
      <FlatList
        data={invoiceList}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  itemContainer: {
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  value: {
    flex: 1,
  },
  invoiceNo: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  date: {
    fontSize: 14,
  },
  term: {
    fontSize: 14,
  },
  receiptFor: {
    fontSize: 14,
  },
  barcode: {
    fontSize: 14,
  },
  amount: {
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  printSaveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  printSaveText: {
    color: '#fff',
  },
  downloadButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#007bff',
    padding: 5,
    borderRadius: 5,
  },
});

export default InvoicePage;
