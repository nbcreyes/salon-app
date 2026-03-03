import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import { colors } from "../theme";

export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/services").then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

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

  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>WHAT WE OFFER</Text>
            <Text style={styles.heading}>Our Services</Text>
          </View>
        }
        renderItem={({ item: category }) => (
          <View style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons name="pricetag-outline" size={12} color={colors.gold} />
              <Text style={styles.categoryLabel}>{category}</Text>
              <View style={styles.categoryLine} />
            </View>
            {services
              .filter((s) => s.category === category)
              .map((service) => (
                <View key={service._id} style={styles.card}>
                  <View style={styles.cardTop}>
                    <View style={styles.iconBox}>
                      <Ionicons
                        name="cut-outline"
                        size={18}
                        color={colors.gold}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.name}>{service.name}</Text>
                      {service.description ? (
                        <Text style={styles.description}>
                          {service.description}
                        </Text>
                      ) : null}
                    </View>
                    <Text style={styles.price}>${service.price}</Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <View style={styles.metaItem}>
                      <Ionicons
                        name="time-outline"
                        size={12}
                        color={colors.textDim}
                      />
                      <Text style={styles.meta}>{service.duration} mins</Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { marginBottom: 24 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 3,
    marginBottom: 6,
  },
  heading: { fontSize: 28, fontWeight: "800", color: colors.white },
  categorySection: { marginBottom: 24 },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.gold,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  categoryLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardTop: { flexDirection: "row", gap: 12, marginBottom: 12 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 4,
  },
  description: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
  price: { fontSize: 18, fontWeight: "800", color: colors.gold, flexShrink: 0 },
  cardFooter: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  meta: { fontSize: 11, color: colors.textDim },
});