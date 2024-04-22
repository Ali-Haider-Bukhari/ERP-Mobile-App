import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#eee',
    borderRadius: 20, // Adjust the border radius as needed
    overflow: 'hidden',
    marginVertical: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: '#fff', // Change the background color of the selected tab
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: 'black',
  },
  chattext: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noChatsText: {
    fontSize: 18,
    color: 'gray',
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  teacherImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight:'bold'
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 10,
  },
  loadingIndicator: {
    marginTop: 20,
  },
    // Other styles...
    plusButton: {
      position: 'absolute',
      bottom: 100,
      right: 20,
    },
});

export default styles;
