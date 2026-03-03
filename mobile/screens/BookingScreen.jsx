import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';
import { colors } from '../theme';
import { sendBookingConfirmation } from '../services/notifications';

const STEPS = ['Service', 'Staff', 'Date & Time', 'Confirm'];

export default function BookingScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [slots, setSlots] = useState([]);
  const [fetchingSlots, setFetchingSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({
    service: null,
    staff: null,
    date: '',
    timeSlot: '',
    notes: '',
  });

  useEffect(() => {
    api.get('/services').then(setServices);
    api.get('/staff').then(setStaff);
  }, []);

  useEffect(() => {
    if (selected.staff && selected.date && selected.date.length === 10) {
      setFetchingSlots(true);
      api
        .get(`/availability?staffId=${selected.staff._id}&date=${selected.date}`)
        .then((data) => {
          setSlots(data.openSlots || []);
          setFetchingSlots(false);
        });
    }
  }, [selected.staff, selected.date]);

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    const data = await api.post('/bookings', {
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
      setSelected({ service: null, staff: null, date: '', timeSlot: '', notes: '' });
      navigation.navigate('Account');
    } else {
      setError(data.message || 'Booking failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Step Bar */}
      <View style={styles.stepBar}>
        {STEPS.map((label, i) => (
          <View key={label} style={styles.stepItem}>
            <View style={[
              styles.stepDot,
              i < step && styles.stepDotDone,
              i === step && styles.stepDotActive,
            ]}>
              {i < step
                ? <Ionicons name="checkmark" size={14} color={colors.bg} />
                : <Text style={[styles.stepNum, i === step && styles.stepNumActive]}>{i + 1}</Text>
              }
            </View>
            {i < STEPS.length - 1 && (
              <View style={[styles.stepLine, i < step && styles.stepLineDone]} />
            )}
            <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>{label}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Step 0 — Service */}
        {step === 0 && (
          <View>
            <View style={styles.sectionHeader}>
              <Ionicons name="cut-outline" size={18} color={colors.gold} />
              <Text style={styles.sectionTitle}>Select a Service</Text>
            </View>
            {services.map((service) => (
              <TouchableOpacity
                key={service._id}
                style={[styles.card, selected.service?._id === service._id && styles.cardSelected]}
                onPress={() => { setSelected({ ...selected, service }); setStep(1); }}
                activeOpacity={0.8}
              >
                <View style={styles.cardRow}>
                  <View style={styles.cardIcon}>
                    <Ionicons name="cut-outline" size={18} color={colors.gold} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{service.name}</Text>
                    <View style={styles.cardMetaRow}>
                      <Ionicons name="time-outline" size={11} color={colors.textDim} />
                      <Text style={styles.cardMeta}>{service.duration} mins</Text>
                      <Text style={styles.cardMetaDot}>·</Text>
                      <Text style={styles.cardMeta}>{service.category}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.cardPrice}>${service.price}</Text>
                    <Ionicons name="chevron-forward" size={14} color={colors.textDim} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 1 — Staff */}
        {step === 1 && (
          <View>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-outline" size={18} color={colors.gold} />
              <Text style={styles.sectionTitle}>Select a Staff Member</Text>
            </View>
            {staff.map((member) => (
              <TouchableOpacity
                key={member._id}
                style={[styles.card, selected.staff?._id === member._id && styles.cardSelected]}
                onPress={() => { setSelected({ ...selected, staff: member }); setStep(2); }}
                activeOpacity={0.8}
              >
                <View style={styles.cardRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{member.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{member.name}</Text>
                    <Text style={styles.cardMeta}>{member.specialties.join(', ')}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color={colors.textDim} />
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setStep(0)} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={14} color={colors.textMuted} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2 — Date & Time */}
        {step === 2 && (
          <View>
            <View style={styles.sectionHeader}>
              <Ionicons name="calendar-outline" size={18} color={colors.gold} />
              <Text style={styles.sectionTitle}>Pick a Date and Time</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="calendar-outline" size={13} color={colors.gold} />
                  <Text style={styles.inputLabel}>Date (YYYY-MM-DD)</Text>
                </View>
                <TextInput
                  style={styles.input}
                  value={selected.date}
                  onChangeText={(v) => setSelected({ ...selected, date: v, timeSlot: '' })}
                  placeholder="2026-03-10"
                  placeholderTextColor={colors.textDim}
                />
              </View>

              {selected.date ? (
                fetchingSlots ? (
                  <ActivityIndicator color={colors.gold} style={{ marginVertical: 16 }} />
                ) : slots.length === 0 ? (
                  <View style={styles.emptySlots}>
                    <Ionicons name="calendar-outline" size={24} color={colors.textDim} />
                    <Text style={styles.emptyText}>No available slots for this date.</Text>
                  </View>
                ) : (
                  <View style={styles.inputGroup}>
                    <View style={styles.inputLabelRow}>
                      <Ionicons name="time-outline" size={13} color={colors.gold} />
                      <Text style={styles.inputLabel}>Available Slots</Text>
                    </View>
                    <View style={styles.slotsGrid}>
                      {slots.map((slot) => (
                        <TouchableOpacity
                          key={slot}
                          style={[styles.slot, selected.timeSlot === slot && styles.slotSelected]}
                          onPress={() => setSelected({ ...selected, timeSlot: slot })}
                        >
                          <Text style={[styles.slotText, selected.timeSlot === slot && styles.slotTextSelected]}>
                            {slot}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )
              ) : null}

              <View style={styles.inputGroup}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="chatbubble-outline" size={13} color={colors.gold} />
                  <Text style={styles.inputLabel}>Notes (optional)</Text>
                </View>
                <TextInput
                  style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                  value={selected.notes}
                  onChangeText={(v) => setSelected({ ...selected, notes: v })}
                  multiline
                  placeholder="Any special requests..."
                  placeholderTextColor={colors.textDim}
                />
              </View>
            </View>

            <View style={styles.rowButtons}>
              <TouchableOpacity onPress={() => setStep(1)} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={14} color={colors.textMuted} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, (!selected.date || !selected.timeSlot) && styles.buttonDisabled]}
                onPress={() => setStep(3)}
                disabled={!selected.date || !selected.timeSlot}
              >
                <Text style={styles.buttonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.bg} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3 — Confirm */}
        {step === 3 && (
          <View>
            <View style={styles.sectionHeader}>
              <Ionicons name="checkmark-circle-outline" size={18} color={colors.gold} />
              <Text style={styles.sectionTitle}>Confirm Booking</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.confirmHeader}>
                <View style={styles.confirmIcon}>
                  <Ionicons name="cut-outline" size={22} color={colors.gold} />
                </View>
                <View>
                  <Text style={styles.confirmService}>{selected.service?.name}</Text>
                  <Text style={styles.confirmStaff}>with {selected.staff?.name}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {[
                { icon: 'calendar-outline', label: 'Date', value: selected.date },
                { icon: 'time-outline', label: 'Time', value: selected.timeSlot },
                { icon: 'timer-outline', label: 'Duration', value: `${selected.service?.duration} mins` },
              ].map(({ icon, label, value }) => (
                <View key={label} style={styles.summaryRow}>
                  <View style={styles.summaryLabelRow}>
                    <Ionicons name={icon} size={13} color={colors.textDim} />
                    <Text style={styles.summaryLabel}>{label}</Text>
                  </View>
                  <Text style={styles.summaryValue}>{value}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.totalRow}>
                <View style={styles.summaryLabelRow}>
                  <Ionicons name="cash-outline" size={15} color={colors.gold} />
                  <Text style={styles.totalLabel}>Total</Text>
                </View>
                <Text style={styles.totalPrice}>${selected.service?.price}</Text>
              </View>
            </View>

            {selected.notes ? (
              <View style={[styles.card, { marginTop: 0 }]}>
                <View style={styles.inputLabelRow}>
                  <Ionicons name="chatbubble-outline" size={13} color={colors.textDim} />
                  <Text style={styles.inputLabel}>Notes</Text>
                </View>
                <Text style={styles.notesText}>"{selected.notes}"</Text>
              </View>
            ) : null}

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={15} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.rowButtons}>
              <TouchableOpacity onPress={() => setStep(2)} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={14} color={colors.textMuted} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleConfirm}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator size="small" color={colors.bg} />
                  : <>
                      <Ionicons name="checkmark-circle-outline" size={15} color={colors.bg} />
                      <Text style={styles.buttonText}>Confirm Booking</Text>
                    </>
                }
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },

  // Step bar
  stepBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  stepItem: { flex: 1, alignItems: 'center', flexDirection: 'row' },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { borderColor: colors.gold },
  stepDotDone: { backgroundColor: colors.gold, borderColor: colors.gold },
  stepNum: { fontSize: 12, fontWeight: '700', color: colors.textDim },
  stepNumActive: { color: colors.gold },
  stepLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder, marginHorizontal: 4 },
  stepLineDone: { backgroundColor: colors.gold },
  stepLabel: {
    position: 'absolute',
    bottom: -18,
    fontSize: 9,
    color: colors.textDim,
    width: 50,
    textAlign: 'center',
  },
  stepLabelActive: { color: colors.gold, fontWeight: '700' },

  content: { padding: 16, paddingBottom: 40 },

  // Section header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.white },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  cardSelected: { borderColor: colors.gold },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colors.white, marginBottom: 4 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMeta: { fontSize: 12, color: colors.textMuted },
  cardMetaDot: { color: colors.textDim },
  cardRight: { alignItems: 'flex-end', gap: 4 },
  cardPrice: { fontSize: 17, fontWeight: '800', color: colors.gold },

  // Avatar
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.inputBg,
    borderWidth: 2,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: colors.gold },

  // Input
  inputGroup: { marginBottom: 16 },
  inputLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  inputLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: colors.white,
  },

  // Slots
  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slot: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.inputBg,
  },
  slotSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  slotText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  slotTextSelected: { color: colors.bg, fontWeight: '800' },

  // Empty slots
  emptySlots: { alignItems: 'center', paddingVertical: 20, gap: 8 },
  emptyText: { color: colors.textMuted, fontSize: 13 },

  // Confirm
  confirmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  confirmIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmService: { fontSize: 16, fontWeight: '800', color: colors.white },
  confirmStaff: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.divider, marginVertical: 12 },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryLabel: { fontSize: 13, color: colors.textMuted },
  summaryValue: { fontSize: 13, fontWeight: '600', color: colors.white },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  totalLabel: { fontSize: 14, fontWeight: '700', color: colors.text },
  totalPrice: { fontSize: 24, fontWeight: '800', color: colors.gold },
  notesText: { fontSize: 13, color: colors.textMuted, fontStyle: 'italic', marginTop: 4 },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1a0a0a',
    borderWidth: 1,
    borderColor: '#7f1d1d',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: { color: colors.danger, fontSize: 13, flex: 1 },

  // Buttons
  rowButtons: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20 },
  button: {
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: { opacity: 0.4 },
  buttonText: { color: colors.bg, fontWeight: '800', fontSize: 14 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 4 },
  backText: { color: colors.textMuted, fontSize: 14 },
});