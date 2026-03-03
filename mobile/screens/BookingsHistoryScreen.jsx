import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import api from '../services/api';

const statusColor = (status) => {
  switch (status) {
    case 'confirmed': return '#16a34a';
    case 'cancelled': return '#dc2626';
    case 'completed': return '#2563eb';
    default: return '#d97706';
  }
};

export default function BookingsHistoryScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my').then((data) => {
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (id) => {
    const data = await api.put(`/bookings/${id}/cancel`);
    if (data.booking) {
      setBookings(bookings.map((b) => (b._id === id ? data.booking : b)));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#111827" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>My Bookings</Text>
      </View>

      {bookings.length === 0 ? (
        <Text style={styles.empty}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardRow}>
                <View>
                  <Text style={styles.serviceName}>{item.service?.name}</Text>
                  <Text style={styles.meta}>with {item.staff?.name}</Text>
                  <Text style={styles.meta}>{item.date} at {item.timeSlot}</Text>
                </View>
                <Text style={[styles.status, { color: statusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
              {item.status === 'pending' || item.status === 'confirmed' ? (
                <TouchableOpacity
                  onPress={() => handleCancel(item._id)}
                  style={styles.cancelButton}
                >
                  <Text style={styles.cancelText}>Cancel Booking</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  back: { color: '#6b7280', fontSize: 14 },
  heading: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  empty: { textAlign: 'center', color: '#6b7280', marginTop: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  meta: { fontSize: 13, color: '#6b7280', marginTop: 2 },
  status: { fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  cancelButton: { marginTop: 12 },
  cancelText: { color: '#dc2626', fontSize: 13, fontWeight: '500' },
});