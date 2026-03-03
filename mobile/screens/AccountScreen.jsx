import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme";

export default function AccountScreen({ navigation }) {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      icon: "calendar-outline",
      label: "My Bookings",
      onPress: () => navigation.navigate("BookingsHistory"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>YOUR PROFILE</Text>
        <Text style={styles.heading}>Account</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.name}</Text>
            <View style={styles.emailRow}>
              <Ionicons name="mail-outline" size={12} color={colors.textDim} />
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
        </View>
        <View style={styles.roleBadge}>
          <Ionicons
            name="shield-checkmark-outline"
            size={12}
            color={colors.gold}
          />
          <Text style={styles.roleText}>{user?.role?.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
        <View style={styles.menu}>
          {menuItems.map(({ icon, label, onPress }) => (
            <TouchableOpacity
              key={label}
              style={styles.menuItem}
              onPress={onPress}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBox}>
                  <Ionicons name={icon} size={18} color={colors.gold} />
                </View>
                <Text style={styles.menuText}>{label}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.textDim}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24 },
  header: { marginBottom: 24 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 3,
    marginBottom: 4,
  },
  heading: { fontSize: 28, fontWeight: "800", color: colors.white },
  profileCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.inputBg,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 24, fontWeight: "800", color: colors.gold },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  emailRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  email: { fontSize: 12, color: colors.textMuted },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 11,
    color: colors.gold,
    fontWeight: "700",
    letterSpacing: 1,
  },
  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textDim,
    letterSpacing: 2,
    marginBottom: 10,
  },
  menu: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
  },
  menuText: { fontSize: 15, color: colors.text, fontWeight: "500" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#1a0a0a",
    borderWidth: 1,
    borderColor: "#7f1d1d",
    padding: 15,
    borderRadius: 12,
  },
  logoutText: { color: colors.danger, fontWeight: "700", fontSize: 15 },
});