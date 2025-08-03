import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import TimeInput from '../time/TimeInput';
import DateInput from '../date/DateInput';

const AddToDo = ({onClose, onAdd, onUpdate, isEditMode, todoToEdit}) => {
  const {theme} = useContext(ThemeContext);
  let activeColors = colors[theme.mode];
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  // Fungsi helper untuk format tanggal ke YYYY-MM-DD tanpa timezone issues
  const formatDateToString = dateObj => {
    if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
      return null;
    }

    // Gunakan getFullYear, getMonth, getDate untuk menghindari timezone issues
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Fungsi helper untuk parse string tanggal ke Date object
  const parseStringToDate = dateString => {
    if (!dateString || typeof dateString !== 'string') {
      return null;
    }

    // Jika format YYYY-MM-DD
    if (dateString.includes('-')) {
      const dateParts = dateString.split('-');
      if (
        dateParts.length === 3 &&
        dateParts.every(part => !isNaN(Number(part)))
      ) {
        const [year, month, day] = dateParts.map(Number);
        // Gunakan constructor Date yang tidak terpengaruh timezone
        return new Date(year, month - 1, day);
      }
    }

    // Fallback: coba parse langsung
    const attemptedDate = new Date(dateString);
    if (!isNaN(attemptedDate.getTime())) {
      return attemptedDate;
    }

    return null;
  };

  useEffect(() => {
    if (isEditMode && todoToEdit) {
      setTitle(todoToEdit.title || '');

      // Parse date dengan fungsi helper
      const parsedDate = parseStringToDate(todoToEdit.date);
      setDate(parsedDate);

      // Parse time
      if (
        todoToEdit.time &&
        typeof todoToEdit.time === 'string' &&
        todoToEdit.time.includes(':')
      ) {
        const timeParts = todoToEdit.time.split(':');
        if (
          timeParts.length === 2 &&
          timeParts.every(part => !isNaN(Number(part)))
        ) {
          const [hour, minute] = timeParts.map(Number);
          const tempTime = new Date();
          tempTime.setHours(hour);
          tempTime.setMinutes(minute);
          setTime(tempTime);
        } else {
          setTime(null);
        }
      } else {
        setTime(null);
      }
    } else {
      // Reset form untuk mode add
      setTitle('');
      setDate(null);
      setTime(null);
    }
  }, [isEditMode, todoToEdit]);

  const handleSave = () => {
    // Validasi input
    if (!title.trim()) {
      Alert.alert('Warning!', 'Please enter a title for your todo!');
      return;
    }

    if (!date) {
      Alert.alert('Warning!', 'Please select a date!');
      return;
    }

    if (!time) {
      Alert.alert('Warning!', 'Please select a time!');
      return;
    }

    // Format data dengan struktur yang konsisten
    const data = {
      title: title.trim(),
      date: formatDateToString(date), // Gunakan fungsi helper yang aman
      time: time
        ? `${String(time.getHours()).padStart(2, '0')}:${String(
            time.getMinutes(),
          ).padStart(2, '0')}` // Format: HH:MM
        : null,
    };

    // Panggil onUpdate jika dalam mode edit, jika tidak, panggil onAdd
    if (isEditMode) {
      onUpdate(todoToEdit.id, data);
    } else {
      onAdd(data);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <View style={styles.centeredView}>
      <View
        style={[
          styles.modalView,
          {
            backgroundColor: activeColors.secondary,
            borderColor: activeColors.border,
          },
        ]}>
        <View style={styles.headerSection}>
          <Text style={[styles.modalTitle, {color: activeColors.text}]}>
            {isEditMode ? 'Edit To-Do' : 'Add To-Do'}
          </Text>
          <Text style={[styles.modalSubtitle, {color: activeColors.text}]}>
            FILL OUT THIS FORM
          </Text>
        </View>

        {/* Title Input */}
        <View
          style={[styles.inputContainer, {borderColor: activeColors.tertiary}]}>
          <TextInput
            style={[
              styles.textInput,
              {
                color: activeColors.text,
                backgroundColor: activeColors.tertiary,
              },
            ]}
            placeholder="Enter todo title"
            placeholderTextColor={activeColors.text + '80'} // 50% opacity
            onChangeText={setTitle}
            value={title}
            maxLength={100}
            returnKeyType="next"
          />
        </View>

        {/* Date and Time Row */}
        <View style={styles.inputRow}>
          <View
            style={[
              styles.halfInputContainer,
              {borderColor: activeColors.tertiary},
            ]}>
            <DateInput date={date} setDate={setDate} />
          </View>
          <View
            style={[
              styles.halfInputContainer,
              {borderColor: activeColors.tertiary},
            ]}>
            <TimeInput time={time} setTime={setTime} />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
            <Text style={[styles.buttonText, {color: activeColors.text}]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addButton, {backgroundColor: '#50C2C9'}]}
            onPress={handleSave}>
            <Text style={styles.addButtonText}>
              {isEditMode ? 'Update Todo' : 'Add Todo'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    width: '90%',
    alignItems: 'center',
    gap: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  headerSection: {
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  inputContainer: {
    width: '100%',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: 16,
    height: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  halfInputContainer: {
    width: '48%',
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
  },
  previewContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  previewText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  previewDate: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    padding: 12,
  },
  addButton: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddToDo;
