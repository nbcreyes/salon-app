import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import api from "../services/api";
import { sendBookingConfirmation } from "../services/notifications";

const STEPS = ["Service", "Staff", "Date & Time", "Confirm"];

export default function BookingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState({
    service: null,
    staff: null,
    date: "",
    timeSlot: "",
    notes: "",
  });

  useEffect(() => {
    api.get("/services").then(setServices);
    api.get("/staff").then(setStaff);
  }, []);

  useEffect(() => {
    if (selected.staff && selected.date && selected.date.length === 10) {
      api
        .get(
          `/availability?staffId=${selected.staff._id}&date=${selected.date}`,
        )
        .then((data) => setSlots(data.openSlots || []));
    }
  }, [selected.staff, selected.date]);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    const data = await api.post("/bookings", {
      staff: selected.staff._id,
      service: selected.service._id,
      date: selected.date,
      timeSlot: selected.timeSlot,
      notes: selected.notes,
    });
    setLoading(false);

    if (data._id) {
      await sendBookingConfirmation({
        service: selected.service,
        date: selected.date,
        timeSlot: selected.timeSlot,
      });
      setStep(0);
      setSelected({
        service: null,
        staff: null,
        date: "",
        timeSlot: "",
        notes: "",
      });
      navigation.navigate("Account");
    } else {
      setError(data.message || "Booking failed");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.stepBar}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepDot, i <= step && styles.stepDotActive]}>
              <Text style={[styles.stepNum, i <= step && styles.stepNumActive]}>
                {i + 1}
              </Text>
            </View>
            <Text
              style={[styles.stepLabel, i === step && styles.stepLabelActive]}
            >
              {label}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {step === 0 && (
          <View>
            <Text style={styles.sectionTitle}>Select a Service</Text>
            {services.map((service) => (
              <TouchableOpacity
                key={service._id}
                style={[
                  styles.card,
                  selected.service?._id === service._id && styles.cardSelected,
                ]}
                onPress={() => {
                  setSelected({ ...selected, service });
                  setStep(1);
                }}
              >
                <View style={styles.cardRow}>
                  <View>
                    <Text style={styles.cardTitle}>{service.name}</Text>
                    <Text style={styles.cardMeta}>{service.duration} mins</Text>
                  </View>
                  <Text style={styles.cardPrice}>${service.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 1 && (
          <View>
            <Text style={styles.sectionTitle}>Select a Staff Member</Text>
            {staff.map((member) => (
              <TouchableOpacity
                key={member._id}
                style={[
                  styles.card,
                  selected.staff?._id === member._id && styles.cardSelected,
                ]}
                onPress={() => {
                  setSelected({ ...selected, staff: member });
                  setStep(2);
                }}
              >
                <Text style={styles.cardTitle}>{member.name}</Text>
                <Text style={styles.cardMeta}>
                  {member.specialties.join(", ")}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setStep(0)}>
              <Text style={styles.backLink}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.sectionTitle}>Pick a Date and Time</Text>
            <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={selected.date}
              onChangeText={(v) =>
                setSelected({ ...selected, date: v, timeSlot: "" })
              }
              placeholder="2026-03-10"
            />

            {selected.date && slots.length === 0 && (
              <Text style={styles.emptyText}>
                No available slots for this date.
              </Text>
            )}

            {slots.length > 0 && (
              <View>
                <Text style={styles.label}>Available Slots</Text>
                <View style={styles.slotsGrid}>
                  {slots.map((slot) => (
                    <TouchableOpacity
                      key={slot}
                      style={[
                        styles.slot,
                        selected.timeSlot === slot && styles.slotSelected,
                      ]}
                      onPress={() =>
                        setSelected({ ...selected, timeSlot: slot })
                      }
                    >
                      <Text
                        style={[
                          styles.slotText,
                          selected.timeSlot === slot && styles.slotTextSelected,
                        ]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <Text style={styles.label}>Notes (optional)</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={selected.notes}
              onChangeText={(v) => setSelected({ ...selected, notes: v })}
              multiline
              placeholder="Any special requests..."
            />

            <View style={styles.rowButtons}>
              <TouchableOpacity onPress={() => setStep(1)}>
                <Text style={styles.backLink}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  (!selected.date || !selected.timeSlot) &&
                    styles.buttonDisabled,
                ]}
                onPress={() => setStep(3)}
                disabled={!selected.date || !selected.timeSlot}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Text style={styles.sectionTitle}>Confirm Booking</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service</Text>
                <Text style={styles.summaryValue}>
                  {selected.service?.name}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Staff</Text>
                <Text style={styles.summaryValue}>{selected.staff?.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date</Text>
                <Text style={styles.summaryValue}>{selected.date}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time</Text>
                <Text style={styles.summaryValue}>{selected.timeSlot}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Price</Text>
                <Text style={styles.summaryValue}>
                  ${selected.service?.price}
                </Text>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.rowButtons}>
              <TouchableOpacity onPress={() => setStep(2)}>
                <Text style={styles.backLink}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={handleConfirm}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? "Booking..." : "Confirm Booking"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  stepBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  stepItem: { alignItems: "center", flex: 1 },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  stepDotActive: { backgroundColor: "#111827" },
  stepNum: { fontSize: 12, fontWeight: "600", color: "#6b7280" },
  stepNumActive: { color: "#fff" },
  stepLabel: { fontSize: 10, color: "#9ca3af" },
  stepLabelActive: { color: "#111827", fontWeight: "600" },
  content: { padding: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSelected: { borderColor: "#111827" },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  cardMeta: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  cardPrice: { fontSize: 16, fontWeight: "bold", color: "#111827" },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
  },
  slotsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  slot: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#fff",
  },
  slotSelected: { backgroundColor: "#111827", borderColor: "#111827" },
  slotText: { fontSize: 13, color: "#374151" },
  slotTextSelected: { color: "#fff" },
  rowButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 20,
  },
  button: {
    backgroundColor: "#111827",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  backLink: { color: "#6b7280", fontSize: 14 },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 14, color: "#6b7280" },
  summaryValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  emptyText: { color: "#6b7280", fontSize: 13, marginTop: 8 },
  errorText: {
    color: "#dc2626",
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 13,
  },
});
