import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { colors } from "../theme";

const statusConfig = (status) => {
  switch (status) {
    case "confirmed":
      return {
        color: colors.success,
        bg: "#052e16",
        border: "#14532d",
        icon: "checkmark-circle",
      };
    case "cancelled":
      return {
        color: colors.danger,
        bg: "#1a0a0a",
        border: "#7f1d1d",
        icon: "close-circle",
      };
    case "completed":
      return {
        color: colors.info,
        bg: "#0a1628",
        border: "#1e3a5f",
        icon: "ribbon",
      };
    default:
      return {
        color: colors.gold,
        bg: "#1a1000",
        border: "#78350f",
        icon: "time",
      };
  }
};

export default function BookingsHistoryScreen({ navigation }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/bookings/my").then((data) => {
      setBookings(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const handleCancel = async (id) => {
    const data = await api.put(`/bookings/${id}/cancel`);
    if (data.booking)
      setBookings(bookings.map((b) => (b._id === id ? data.booking : b)));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color={colors.gold}
          style={{ marginTop: 40 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color={colors.textMuted} />
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.heading}>My Bookings</Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons
            name="calendar-outline"
            size={48}
            color={colors.textDim}
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Book your first appointment to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => {
            const sc = statusConfig(item.status);
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.serviceIconBox}>
                    <Ionicons
                      name="cut-outline"
                      size={20}
                      color={colors.gold}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.serviceName}>{item.service?.name}</Text>
                    <View style={styles.staffRow}>
                      <Ionicons
                        name="person-outline"
                        size={11}
                        color={colors.textDim}
                      />
                      <Text style={styles.meta}>{item.staff?.name}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: sc.bg, borderColor: sc.border },
                    ]}
                  >
                    <Ionicons name={sc.icon} size={11} color={sc.color} />
                    <Text style={[styles.badgeText, { color: sc.color }]}>
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={12}
                      color={colors.textDim}
                    />
                    <View>
                      <Text style={styles.infoLabel}>Date</Text>
                      <Text style={styles.infoValue}>{item.date}</Text>
                    </View>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="time-outline"
                      size={12}
                      color={colors.textDim}
                    />
                    <View>
                      <Text style={styles.infoLabel}>Time</Text>
                      <Text style={styles.infoValue}>{item.timeSlot}</Text>
                    </View>
                  </View>
                  <View style={styles.infoItem}>
                    <Ionicons
                      name="cash-outline"
                      size={12}
                      color={colors.textDim}
                    />
                    <View>
                      <Text style={styles.infoLabel}>Price</Text>
                      <Text style={[styles.infoValue, { color: colors.gold }]}>
                        ${item.service?.price}
                      </Text>
                    </View>
                  </View>
                </View>

                {item.status === "pending" || item.status === "confirmed" ? (
                  <TouchableOpacity
                    onPress={() => handleCancel(item._id)}
                    style={styles.cancelButton}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={14}
                      color={colors.danger}
                    />
                    <Text style={styles.cancelText}>Cancel Booking</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: colors.card,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  back: { color: colors.textMuted, fontSize: 13 },
  heading: { fontSize: 24, fontWeight: "800", color: colors.white },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 8,
  },
  emptyText: { fontSize: 13, color: colors.textMuted, textAlign: "center" },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  serviceIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  staffRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  meta: { fontSize: 12, color: colors.textMuted },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    flexShrink: 0,
  },
  badgeText: { fontSize: 10, fontWeight: "700", textTransform: "capitalize" },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    backgroundColor: colors.inputBg,
    borderRadius: 10,
    marginBottom: 12,
  },
  infoItem: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 6 },
  infoLabel: { fontSize: 10, color: colors.textDim, marginBottom: 2 },
  infoValue: { fontSize: 12, fontWeight: "600", color: colors.text },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  cancelText: { color: colors.danger, fontSize: 13, fontWeight: "600" },
});