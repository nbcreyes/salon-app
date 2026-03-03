import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme";

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>NOW ACCEPTING BOOKINGS</Text>
        </View>

        <Text style={styles.title}>
          LUXE {"\n"}
          <Text style={styles.titleAccent}>SALON</Text>
        </Text>
        <Text style={styles.subtitle}>
          Premium grooming services delivered by expert stylists.
        </Text>

        <TouchableOpacity
          style={styles.buttonGold}
          onPress={() => navigation.navigate("Book")}
        >
          <Ionicons name="calendar-outline" size={18} color={colors.bg} />
          <Text style={styles.buttonGoldText}>Book Appointment</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => navigation.navigate("Services")}
        >
          <Ionicons name="list-outline" size={18} color={colors.gold} />
          <Text style={styles.buttonOutlineText}>View Services</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        {[
          { icon: "star", value: "4.9★", label: "Rating" },
          { icon: "people", value: "2,000+", label: "Clients" },
          { icon: "time", value: "5+ Yrs", label: "Experience" },
        ].map(({ icon, value, label }) => (
          <View key={label} style={styles.statCard}>
            <Ionicons
              name={icon}
              size={18}
              color={colors.gold}
              style={{ marginBottom: 6 }}
            />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 24,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.gold,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 2,
  },
  title: {
    fontSize: 48,
    fontWeight: "800",
    color: colors.white,
    textAlign: "center",
    lineHeight: 52,
    marginBottom: 16,
  },
  titleAccent: { color: colors.gold },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  buttonGold: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.gold,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 12,
    width: "100%",
    justifyContent: "center",
  },
  buttonGoldText: { color: colors.bg, fontWeight: "700", fontSize: 15 },
  buttonOutline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.gold,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
  },
  buttonOutlineText: { color: colors.gold, fontWeight: "700", fontSize: 15 },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 2,
  },
  statLabel: { fontSize: 11, color: colors.textMuted },
});