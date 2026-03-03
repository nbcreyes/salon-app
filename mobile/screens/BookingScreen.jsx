import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function BookingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Booking coming soon</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, color: '#6b7280' },
});