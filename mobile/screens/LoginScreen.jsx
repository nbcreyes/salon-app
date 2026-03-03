import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { colors } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const data = await api.post('/auth/login', form);
    setLoading(false);
    if (data.token) {
      await login(data.token, data.user);
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <Text style={styles.brand}>
          LUXE <Text style={styles.brandAccent}>SALON</Text>
        </Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@example.com"
          placeholderTextColor={colors.textDim}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={form.password}
          onChangeText={(v) => setForm({ ...form, password: v })}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor={colors.textDim}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.link}>
            Don't have an account? <Text style={styles.linkAccent}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  brand: { fontSize: 28, fontWeight: '800', color: colors.white, marginBottom: 4 },
  brandAccent: { color: colors.gold },
  subtitle: { fontSize: 14, color: colors.textMuted, marginBottom: 32 },
  label: { fontSize: 13, fontWeight: '500', color: colors.textMuted, marginBottom: 6 },
  input: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: colors.white,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.gold,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  buttonText: { color: colors.bg, fontWeight: '700', fontSize: 15 },
  error: {
    backgroundColor: '#1a0a0a',
    borderWidth: 1,
    borderColor: '#7f1d1d',
    color: colors.danger,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 13,
  },
  link: { color: colors.textMuted, fontSize: 14, textAlign: 'center' },
  linkAccent: { color: colors.gold, fontWeight: '600' },
});