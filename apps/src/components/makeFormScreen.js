import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { showAlert } from '../utils/dialog';
import { required } from '../utils/validators';

export default function makeFormScreen({ api, fields }) {
  return function FormScreen({ route, navigation }) {
    const item = route.params?.item;           // ada = mode ubah
    const defaults = route.params?.defaults || {};
    const isEdit = !!item;

    const [values, setValues] = useState(() => {
      const v = {};
      fields.forEach((f) => {
        v[f.name] = String(item?.[f.name] ?? defaults[f.name] ?? f.default ?? '');
      });
      return v;
    });
    const [errors, setErrors] = useState({});

    const [options, setOptions] = useState({});
    const [saving, setSaving] = useState(false);

    const normalizeOption = (o) =>
  o !== null && typeof o === 'object'
    ? { value: String(o.value ?? ''), label: String(o.label ?? o.value ?? '') }
    : { value: String(o), label: String(o) };

    // Muat pilihan untuk field select yang datanya berasal dari API
    useEffect(() => {
      fields.filter((f) => f.loadOptions).forEach(async (f) => {
        try {
          const opts = await f.loadOptions();
          setOptions((o) => ({ ...o, [f.name]: opts }));
        } catch (e) {
          showAlert('Gagal memuat pilihan', e.message);
        }
      });
    }, []);

    const setField = (name, val) => setValues((v) => ({ ...v, [name]: val }));

    const validate = () => {
      const err = {};
      fields.forEach((f) => {
        if (f.type === 'hidden') return;
        const val = values[f.name].trim();
        const requiredField = f.required && (!f.requiredOnCreate || !isEdit);
        if (val === '' && !requiredField) return;
        const rules = [...(requiredField ? [required(f.label)] : []), ...(f.validate || [])];
        for (const rule of rules) {
          const msg = rule(val);
          if (msg) { err[f.name] = msg; break; }
        }
      });
      setErrors(err);
      return Object.keys(err).length === 0;
    };

    const handleSave = async () => {
      if (!validate()) return;
      setSaving(true);
      try {
        const body = {};
        fields.forEach((f) => { body[f.name] = values[f.name].trim(); });
        const res = isEdit ? await api.update(item.id, body) : await api.create(body);
        showAlert('Berhasil', res.message, () => navigation.goBack());
      } catch (e) {
        showAlert('Gagal menyimpan', e.message);
      } finally {
        setSaving(false);
      }
    };

    const renderField = (f) => {
      if (f.type === 'hidden') return null;
      const rawOpts = options[f.name] || f.options || [];
      const opts = (Array.isArray(rawOpts) ? rawOpts : []).map(normalizeOption);
      return (
        <View key={f.name}>
          <Text style={s.label}>{f.label}{f.required && (!f.requiredOnCreate || !isEdit) ? ' *' : ''}</Text>
          {f.type === 'select' ? (
            <View style={s.chipRow}>
              {opts.length === 0 && <Text style={s.hint}>Pilihan kosong / sedang dimuat...</Text>}
              {opts.map((o) => {
                const active = values[f.name] === String(o.value);
                return (
                  <TouchableOpacity
                    key={o.value}
                    style={[s.chip, active && s.chipActive]}
                    onPress={() => setField(f.name, String(o.value))}>
                    <Text style={active ? s.chipTextActive : s.chipText}>{o.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <TextInput
             style={[s.input, f.type === 'multiline' && s.multiline, errors[f.name] && s.inputError]}
              value={values[f.name]}
              onChangeText={(t) => setField(f.name, t)}
              placeholder={f.type === 'date' ? 'YYYY-MM-DD' : f.placeholder}
              keyboardType={
                f.type === 'number' ? 'numeric' : f.type === 'email' ? 'email-address' : 'default'
              }
              secureTextEntry={f.type === 'password'}
              autoCapitalize={f.type === 'email' || f.type === 'password' ? 'none' : 'sentences'}
              multiline={f.type === 'multiline'}
              maxLength={f.maxLength}
            />
          )}
          {!!errors[f.name] && <Text style={s.error}>{errors[f.name]}</Text>}
        </View>
      );
    };

    return (
      <ScrollView style={s.container} keyboardShouldPersistTaps="handled">
        {fields.map(renderField)}
        <TouchableOpacity style={s.btn} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" />
                  : <Text style={s.btnText}>{isEdit ? 'Perbarui' : 'Simpan'}</Text>}
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { fontWeight: '600', marginTop: 14, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  inputError: { borderColor: '#ef4444' },
  error: { color: '#ef4444', marginTop: 4 },
  hint: { color: '#6b7280' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12, marginRight: 6, marginBottom: 6 },
  chipActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  chipText: { color: '#111827' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  btn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, marginTop: 24, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
