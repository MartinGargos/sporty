import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SportId } from '../types/sport';
import { SkillLevel } from '../types/event';
import { useEvents } from '../context/EventsContext';
import { venues } from '../data/venues';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateEvent'>;

const SPORTS: { id: SportId; label: string }[] = [
  { id: 'badminton', label: 'Badminton' },
  { id: 'padel', label: 'Padel' },
  { id: 'squash', label: 'Squash' },
];

const SKILL_LEVELS: SkillLevel[] = [1, 2, 3, 4];

export const CreateEventScreen: React.FC<Props> = ({ navigation }) => {
  const { createEvent } = useEvents();
  const scrollViewRef = useRef<ScrollView>(null);
  const descriptionInputRef = useRef<TextInput>(null);
  const [sportId, setSportId] = useState<SportId>('badminton');
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reservationType, setReservationType] = useState<'reserved' | 'to_be_arranged'>('reserved');
  
  // Time pickers - inicializace s defaultními časy
  const defaultTimeStart = new Date();
  defaultTimeStart.setHours(18, 0, 0, 0);
  const defaultTimeEnd = new Date();
  defaultTimeEnd.setHours(19, 0, 0, 0);
  
  const [timeStart, setTimeStart] = useState<Date>(defaultTimeStart);
  const [timeEnd, setTimeEnd] = useState<Date>(defaultTimeEnd);
  const [showTimeStartPicker, setShowTimeStartPicker] = useState(false);
  const [showTimeEndPicker, setShowTimeEndPicker] = useState(false);
  const [playerCountTotal, setPlayerCountTotal] = useState('4');
  const [skillMin, setSkillMin] = useState<SkillLevel>(1);
  const [skillMax, setSkillMax] = useState<SkillLevel>(3);
  const [description, setDescription] = useState('');

  const eligibleVenues = useMemo(
    () => venues.filter((v) => v.sports.includes(sportId)),
    [sportId]
  );

  const [selectedVenueId, setSelectedVenueId] = useState<string | undefined>(
    eligibleVenues[0]?.id
  );

  const selectedVenue = useMemo(
    () => eligibleVenues.find((v) => v.id === selectedVenueId),
    [eligibleVenues, selectedVenueId]
  );

  const formatDateCz = (d: Date) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (d: Date) => {
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (event: DateTimePickerEvent, selected?: Date) => {
    // On Android, the picker closes automatically when user confirms
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selected) {
      setDate(selected);
      // On iOS, keep picker open until user explicitly closes it
      if (Platform.OS === 'ios') {
        // Optionally keep it open, or close it
        // setShowDatePicker(false);
      }
    } else {
      // User cancelled on Android
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }
    }
  };

  const handleTimeStartChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimeStartPicker(false);
    }
    
    if (selected) {
      setTimeStart(selected);
    } else {
      if (Platform.OS === 'android') {
        setShowTimeStartPicker(false);
      }
    }
  };

  const handleTimeEndChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimeEndPicker(false);
    }
    
    if (selected) {
      setTimeEnd(selected);
    } else {
      if (Platform.OS === 'android') {
        setShowTimeEndPicker(false);
      }
    }
  };

  // Update selectedVenueId when eligibleVenues changes
  React.useEffect(() => {
    if (eligibleVenues.length > 0 && !eligibleVenues.find((v) => v.id === selectedVenueId)) {
      setSelectedVenueId(eligibleVenues[0]?.id);
    }
  }, [eligibleVenues, selectedVenueId]);

  const handleCreate = () => {
    const isoDate = date.toISOString().split('T')[0];

    if (!selectedVenue) {
      Alert.alert('Chyba', 'Vyber prosím sportoviště.');
      return;
    }

    if (Number(playerCountTotal) <= 0) {
      Alert.alert('Chyba', 'Počet hráčů musí být větší než 0.');
      return;
    }

    if (skillMin > skillMax) {
      Alert.alert('Chyba', 'Minimální úroveň nesmí být vyšší než maximální.');
      return;
    }

    const total = Number(playerCountTotal);

    const sportLabel =
      SPORTS.find((s) => s.id === sportId)?.label ?? 'Neznámý sport';

    createEvent({
      sportId,
      sportName: sportLabel,
      date: isoDate,
      timeStart: formatTime(timeStart),
      timeEnd: formatTime(timeEnd),
      placeName: `${selectedVenue.name} (${selectedVenue.city})`,
      reservationType,
      playerCountTotal: total,
      skillMin,
      skillMax,
      description: description.trim() || undefined,
    });

    Alert.alert('Událost vytvořena', 'Zápas byl přidán mezi události.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={true}
      >
        <Text style={styles.label}>Sport</Text>
        <View style={styles.chipsRow}>
          {SPORTS.map((sport) => {
            const isActive = sportId === sport.id;
            return (
              <TouchableOpacity
                key={sport.id}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setSportId(sport.id)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {sport.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.label}>Rezervace kurtu</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity
            style={[
              styles.chip,
              reservationType === 'reserved' && styles.chipActive,
            ]}
            onPress={() => setReservationType('reserved')}
          >
            <Text
              style={[
                styles.chipText,
                reservationType === 'reserved' && styles.chipTextActive,
              ]}
            >
              Kurt mám zarezervovaný
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.chip,
              reservationType === 'to_be_arranged' && styles.chipActive,
            ]}
            onPress={() => setReservationType('to_be_arranged')}
          >
            <Text
              style={[
                styles.chipText,
                reservationType === 'to_be_arranged' && styles.chipTextActive,
              ]}
            >
              Domluvíme se později
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Datum</Text>
        <TouchableOpacity
          onPress={() => {
            if (Platform.OS === 'android') {
              setShowDatePicker(true);
            } else {
              setShowDatePicker(!showDatePicker);
            }
          }}
          style={styles.input}
        >
          <Text style={{ color: '#e5e7eb' }}>{formatDateCz(date)}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <View style={styles.datePickerWrapper}>
            {Platform.OS === 'ios' ? (
              <View style={styles.datePickerIOSContainer}>
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={new Date()}
                  style={styles.datePickerIOS}
                  textColor="#e5e7eb"
                  themeVariant="dark"
                />
              </View>
            ) : (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
                textColor="#e5e7eb"
                accentColor="#22c55e"
              />
            )}
          </View>
        )}
        
        {Platform.OS === 'ios' && showDatePicker && (
          <TouchableOpacity
            onPress={() => setShowDatePicker(false)}
            style={styles.datePickerCloseButton}
          >
            <Text style={styles.datePickerCloseText}>Hotovo</Text>
          </TouchableOpacity>
        )}

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Čas od</Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'android') {
                  setShowTimeStartPicker(true);
                } else {
                  setShowTimeStartPicker(!showTimeStartPicker);
                }
              }}
              style={styles.input}
            >
              <Text style={{ color: '#e5e7eb' }}>{formatTime(timeStart)}</Text>
            </TouchableOpacity>

            {showTimeStartPicker && (
              <View style={styles.timePickerWrapper}>
                {Platform.OS === 'ios' ? (
                  <View style={styles.timePickerIOSContainer}>
                    <DateTimePicker
                      value={timeStart}
                      mode="time"
                      display="spinner"
                      onChange={handleTimeStartChange}
                      style={styles.timePickerIOS}
                      textColor="#e5e7eb"
                      themeVariant="dark"
                    />
                  </View>
                ) : (
                  <DateTimePicker
                    value={timeStart}
                    mode="time"
                    display="default"
                    onChange={handleTimeStartChange}
                    textColor="#e5e7eb"
                    accentColor="#22c55e"
                  />
                )}
              </View>
            )}
            
            {Platform.OS === 'ios' && showTimeStartPicker && (
              <TouchableOpacity
                onPress={() => setShowTimeStartPicker(false)}
                style={styles.datePickerCloseButton}
              >
                <Text style={styles.datePickerCloseText}>Hotovo</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.col}>
            <Text style={styles.label}>Čas do</Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'android') {
                  setShowTimeEndPicker(true);
                } else {
                  setShowTimeEndPicker(!showTimeEndPicker);
                }
              }}
              style={styles.input}
            >
              <Text style={{ color: '#e5e7eb' }}>{formatTime(timeEnd)}</Text>
            </TouchableOpacity>

            {showTimeEndPicker && (
              <View style={styles.timePickerWrapper}>
                {Platform.OS === 'ios' ? (
                  <View style={styles.timePickerIOSContainer}>
                    <DateTimePicker
                      value={timeEnd}
                      mode="time"
                      display="spinner"
                      onChange={handleTimeEndChange}
                      style={styles.timePickerIOS}
                      textColor="#e5e7eb"
                      themeVariant="dark"
                    />
                  </View>
                ) : (
                  <DateTimePicker
                    value={timeEnd}
                    mode="time"
                    display="default"
                    onChange={handleTimeEndChange}
                    textColor="#e5e7eb"
                    accentColor="#22c55e"
                  />
                )}
              </View>
            )}
            
            {Platform.OS === 'ios' && showTimeEndPicker && (
              <TouchableOpacity
                onPress={() => setShowTimeEndPicker(false)}
                style={styles.datePickerCloseButton}
              >
                <Text style={styles.datePickerCloseText}>Hotovo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.label}>Sportoviště</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedVenueId}
            onValueChange={(v) => setSelectedVenueId(v)}
            style={styles.picker}
            dropdownIconColor="#e5e7eb"
            itemStyle={Platform.OS === 'ios' ? styles.pickerItemIOS : undefined}
          >
            {eligibleVenues.map((venue) => (
              <Picker.Item
                key={venue.id}
                label={`${venue.name} (${venue.city})`}
                value={venue.id}
                color={Platform.OS === 'android' ? '#e5e7eb' : undefined}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Hledám tento počet hráčů</Text>
        <TextInput
          style={styles.input}
          value={playerCountTotal}
          onChangeText={setPlayerCountTotal}
          keyboardType="number-pad"
          placeholder="4"
          placeholderTextColor="#6b7280"
        />

        <Text style={styles.label}>Povolená úroveň (1–4)</Text>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.subLabel}>Min</Text>
            <View style={styles.chipsRow}>
              {SKILL_LEVELS.map((lvl) => {
                const isActive = skillMin === lvl;
                return (
                  <TouchableOpacity
                    key={`min-${lvl}`}
                    style={[styles.skillChip, isActive && styles.skillChipActive]}
                    onPress={() => setSkillMin(lvl)}
                  >
                    <Text
                      style={[
                        styles.skillChipText,
                        isActive && styles.skillChipTextActive,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <View style={styles.col}>
            <Text style={styles.subLabel}>Max</Text>
            <View style={styles.chipsRow}>
              {SKILL_LEVELS.map((lvl) => {
                const isActive = skillMax === lvl;
                return (
                  <TouchableOpacity
                    key={`max-${lvl}`}
                    style={[styles.skillChip, isActive && styles.skillChipActive]}
                    onPress={() => setSkillMax(lvl)}
                  >
                    <Text
                      style={[
                        styles.skillChipText,
                        isActive && styles.skillChipTextActive,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <Text style={styles.label}>Popis (volitelné)</Text>
        <TextInput
          ref={descriptionInputRef}
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Krátký popis zápasu..."
          placeholderTextColor="#6b7280"
          multiline
          onFocus={() => {
            // Scroll to the bottom where the description input is
            setTimeout(() => {
              scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 300);
          }}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleCreate}>
          <Text style={styles.submitText}>Vytvořit událost</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  label: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 6,
  },
  subLabel: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#0b1120',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#e5e7eb',
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#0b1120',
  },
  picker: {
    color: '#e5e7eb',
    backgroundColor: '#0b1120',
  },
  pickerItemIOS: {
    color: '#e5e7eb',
    backgroundColor: '#0b1120',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
  },
  chipActive: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  chipText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  chipTextActive: {
    color: '#022c22',
    fontWeight: '600',
  },
  skillChip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#1f2937',
    backgroundColor: '#020617',
  },
  skillChipActive: {
    backgroundColor: '#38bdf8',
    borderColor: '#38bdf8',
  },
  skillChipText: {
    fontSize: 13,
    color: '#9ca3af',
  },
  skillChipTextActive: {
    color: '#0f172a',
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitText: {
    color: '#022c22',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerCloseButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#22c55e',
    borderRadius: 12,
    alignItems: 'center',
  },
  datePickerCloseText: {
    color: '#022c22',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerWrapper: {
    backgroundColor: '#0b1120',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  datePickerIOSContainer: {
    backgroundColor: '#0b1120',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerIOS: {
    width: '100%',
    height: 200,
    backgroundColor: '#0b1120',
  },
  timePickerWrapper: {
    backgroundColor: '#0b1120',
    borderRadius: 12,
    marginTop: 8,
    overflow: 'hidden',
  },
  timePickerIOSContainer: {
    backgroundColor: '#0b1120',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePickerIOS: {
    width: '100%',
    height: 180,
    backgroundColor: '#0b1120',
  },
});
