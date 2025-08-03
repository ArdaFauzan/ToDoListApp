import React, {
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Vibration,
} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {useSelector, useDispatch} from 'react-redux';
import {colors} from '../config/theme';
import {ThemeContext} from '../Context/ThemeContext';
import PencilDark from '../../assets/pencil-dark.svg';
import PencilLight from '../../assets/pencil-light.svg';
import TrashDark from '../../assets/trash-dark.svg';
import TrashLight from '../../assets/trash-light.svg';

const ToDoCalendar = ({onEdit}) => {
  const {theme} = useContext(ThemeContext);
  const activeColors = colors[theme.mode];
  const isDarkMode = theme.mode === 'dark';

  const dispatch = useDispatch();
  const todos = useSelector(state => state.DashboardReducer.todos);
  const isLoading = useSelector(state => state.DashboardReducer.isLoading);

  // Helper function untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [deleteModeId, setDeleteModeId] = useState(null);
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render trigger

  // Force re-render ketika todos berubah
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [todos]);

  // Gunakan useMemo untuk memproses todos dengan forceUpdate sebagai dependency
  const items = useMemo(() => {
    if (!Array.isArray(todos)) {
      return {};
    }

    const newItems = {};
    todos
      .filter(todo => todo && todo.date && todo.title)
      .forEach(todo => {
        const date = todo.date;
        if (!newItems[date]) {
          newItems[date] = [];
        }
        newItems[date].push({
          title: todo.title,
          time: todo.time || 'No time set',
          id: todo.id,
          completed: todo.completed || 0,
          // Tambahkan timestamp untuk memastikan key unik
          _timestamp: Date.now() + Math.random(),
        });
      });

    return newItems;
  }, [todos, forceUpdate]); // Tambahkan forceUpdate sebagai dependency

  useEffect(() => {
    const handleBackPress = () => {
      if (deleteModeId !== null) {
        setDeleteModeId(null);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );

    return () => backHandler.remove();
  }, [deleteModeId]);

  const toggleTodoStatus = useCallback(
    (id, isCompleted) => {
      const actionType =
        isCompleted === 1 ? 'MARK_TODO_INCOMPLETE' : 'MARK_TODO_COMPLETED';
      dispatch({type: actionType, inputValue: id});
    },
    [dispatch],
  );

  const handleDelete = useCallback(
    id => {
      Alert.alert(
        'Warning!',
        'Are you sure you want to delete this todo?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              setDeleteModeId(null);
            },
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              dispatch({type: 'DELETE_TODO', inputValue: id});
              setDeleteModeId(null);
            },
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    },
    [dispatch],
  );

  const onDayPress = useCallback(day => {
    setSelectedDate(day.dateString);
    setDeleteModeId(null);
  }, []);

  const renderItem = useCallback(
    item => {
      const completedStyle = item.completed === 1 ? styles.completedText : {};
      const completedContainerStyle =
        item.completed === 1 ? styles.completedContainer : {};

      const isDeleteMode = deleteModeId === item.id;

      return (
        <TouchableOpacity
          // Key yang lebih unik dengan timestamp
          key={`${item.id}-${item.title}-${item.time}-${
            item._timestamp || Date.now()
          }`}
          style={[styles.todoItem, {backgroundColor: activeColors.primary}]}
          onPress={() => {
            if (isDeleteMode) {
              return;
            }
            toggleTodoStatus(item.id, item.completed);
          }}
          onLongPress={() => {
            Vibration.vibrate(100);
            setDeleteModeId(isDeleteMode ? null : item.id);
          }}>
          <View style={[styles.todoContent, completedContainerStyle]}>
            <Text
              style={[
                styles.todoTitle,
                {color: activeColors.text},
                completedStyle,
              ]}>
              {item.title}
            </Text>
            <Text
              style={[
                styles.todoTime,
                {color: activeColors.text},
                completedStyle,
              ]}>
              {item.time}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (isDeleteMode) {
                handleDelete(item.id);
              } else {
                // Edit logic
                const fullTodoData = todos.find(todo => todo.id === item.id);
                if (fullTodoData) {
                  onEdit(fullTodoData);
                } else {
                  onEdit({...item, date: selectedDate});
                }
              }
            }}
            style={styles.actionIconContainer}>
            {isDeleteMode ? (
              isDarkMode ? (
                <TrashLight width={40} height={40} />
              ) : (
                <TrashDark width={40} height={40} />
              )
            ) : isDarkMode ? (
              <PencilLight width={40} height={40} />
            ) : (
              <PencilDark width={40} height={40} />
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      );
    },
    [
      toggleTodoStatus,
      deleteModeId,
      handleDelete,
      onEdit,
      todos,
      selectedDate,
      forceUpdate,
    ], // Tambahkan forceUpdate
  );

  const renderEmptyData = () => {
    return (
      <View
        style={[styles.emptyState, {backgroundColor: activeColors.primary}]}>
        <Text style={[styles.emptyText, {color: activeColors.text}]}>
          There are no todos to display yet
        </Text>
        <Text style={[styles.emptySubText, {color: activeColors.text}]}>
          Press the + button to add a new todo
        </Text>
      </View>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={[styles.emptyDate, {backgroundColor: activeColors.primary}]}>
        <Text style={{color: activeColors.text}}>No todos for this date</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.wrapper, styles.centerContent]}>
        <Text style={[styles.loadingText, {color: activeColors.text}]}>
          Loading todos...
        </Text>
      </View>
    );
  }

  // Membuat markedDates untuk menandai tanggal yang memiliki todos
  const markedDates = todos
    .filter(todo => todo && todo.date)
    .reduce(
      (acc, todo) => {
        const isSelected = todo.date === selectedDate;
        return {
          ...acc,
          [todo.date]: {
            marked: true,
            dotColor: '#50C2C9',
            // Jika tanggal ini adalah selectedDate, gunakan selectedColor
            ...(isSelected && {
              selected: true,
              selectedColor: '#50C2C9',
              selectedTextColor: '#ffffff',
            }),
          },
        };
      },
      {
        // Pastikan selectedDate selalu ditandai sebagai selected
        [selectedDate]: {
          selected: true,
          selectedColor: '#50C2C9',
          selectedTextColor: '#ffffff',
          // Jika selectedDate memiliki todos, tambahkan marked
          ...(todos.some(todo => todo.date === selectedDate) && {
            marked: true,
            dotColor: '#50C2C9',
          }),
        },
      },
    );

  // Filter items untuk hanya menampilkan todos pada tanggal yang dipilih
  const filteredItems = {};
  if (items[selectedDate]) {
    filteredItems[selectedDate] = items[selectedDate];
  }

  return (
    <View style={[styles.wrapper, {backgroundColor: activeColors.primary}]}>
      <Agenda
        key={`agenda-${forceUpdate}`} // PENTING: Force re-render Agenda component
        items={filteredItems}
        selected={selectedDate}
        renderItem={renderItem}
        renderEmptyData={renderEmptyData}
        renderEmptyDate={renderEmptyDate}
        onDayPress={onDayPress}
        markedDates={markedDates}
        showClosingKnob={true}
        refreshControl={null}
        refreshing={false}
        pastScrollRange={1}
        futureScrollRange={1}
        renderKnob={() => (
          <View
            style={{
              height: 5,
              width: 50,
              backgroundColor: '#50C2C9',
              borderRadius: 3,
              margin: 8,
            }}
          />
        )}
        hideExtraDays={true}
        showOnlySelectedDayItems={true}
        theme={{
          agendaDayTextColor: '#50C2C9',
          agendaDayNumColor: '#50C2C9',
          agendaTodayColor: '#50C2C9',
          agendaKnobColor: '#50C2C9',
          selectedDayBackgroundColor: '#50C2C9',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#50C2C9',
          dotColor: '#50C2C9',
          calendarBackground: activeColors.secondary,
          backgroundColor: activeColors.primary,
          dayTextColor: isDarkMode ? '#fff' : '#000',
          textDisabledColor: isDarkMode ? '#555' : '#aaa',
          arrowColor: '#50C2C9',
          monthTextColor: activeColors.text,
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 4,
    borderColor: '#D3E0EA',
    borderWidth: 1,
    height: 70,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  todoContent: {
    flex: 1,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textDecorationLine: 'none',
    color: '#323643',
  },
  todoTime: {
    fontSize: 14,
    textDecorationLine: 'none',
    color: '#323643',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyDate: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  completedContainer: {
    opacity: 0.6,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#D3E0EA',
  },
  editIcon: {
    fontSize: 20,
    color: '#50C2C9',
  },
  deleteIcon: {
    fontSize: 20,
    color: 'red',
  },
});

export default ToDoCalendar;
