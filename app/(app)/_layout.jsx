import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useSession } from '../../ctx';

export default function AppLayout() {
  const { session, isLoading, signOut } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack>
      <Stack.Screen
        name="index" 
        options={{
          title: "ToDo App", 
          headerRight: () => (
            <TouchableOpacity onPress={signOut} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Stack>
  );

}
  const styles = {
    logoutButton: {
      marginRight: 9, 
      padding: 10, 
      backgroundColor: '#0000FF', 
      borderRadius: 5, 
      
    },
    logoutText: {
      color: '#fff', 
      fontWeight: 'bold',
    },
  };