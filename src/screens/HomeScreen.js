import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TaskItem from "../components/TaskItem";
import { Feather } from "@expo/vector-icons";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskText, setEditTaskText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Load tasks from AsyncStorage when component mounts
  useEffect(() => {
    loadTasks();
  }, []);

  // Function to load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to save tasks to AsyncStorage
  const saveTasks = async (tasks) => {
    try {
      await AsyncStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error(error);
    }
  };

  // Function to add a new task
  const addTask = () => {
    if (taskText.trim()) {
      const newTasks = [
        ...tasks,
        { id: Date.now().toString(), text: taskText, completed: false },
      ];
      setTasks(newTasks);
      setTaskText("");
      saveTasks(newTasks);
    } else {
      Alert.alert("Error", "Task description cannot be empty.");
    }
  };

  // Function to edit an existing task
  const editTask = (id, newText) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, text: newText } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Function to delete a task
  const deleteTask = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            const newTasks = tasks.filter((task) => task.id !== id);
            setTasks(newTasks);
            saveTasks(newTasks);
          },
          style: "destructive",
        },
      ]
    );
  };

  // Function to change the completion status of a task
  const changeComplete = (id) => {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Function to open the edit modal
  const openEditModal = (id, text) => {
    setEditTaskId(id);
    setEditTaskText(text);
    setModalVisible(true);
  };

  // Function to handle the task editing process
  const handleEditTask = () => {
    editTask(editTaskId, editTaskText);
    setModalVisible(false);
    setEditTaskId(null);
    setEditTaskText("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App</Text>
      <TextInput
        style={styles.input}
        placeholder="New task..."
        value={taskText}
        onChangeText={setTaskText}
      />
      <Button title="Add Task" onPress={addTask} />
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onEdit={() => openEditModal(item.id, item.text)}
            onDelete={() => deleteTask(item.id)}
            onComplete={() => changeComplete(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Task</Text>
            <TextInput
              style={styles.modalInput}
              value={editTaskText}
              onChangeText={setEditTaskText}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={handleEditTask}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    width: "100%",
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#2196F3",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  modalButtonText: {
    color: "white",
  },
});

export default HomeScreen;
