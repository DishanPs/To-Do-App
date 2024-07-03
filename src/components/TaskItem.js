import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  return (
    <View style={[styles.taskContainer, task.completed && styles.completed]}>
      <Text style={styles.taskText}>{task.text}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onToggleComplete}>
          <Text>{task.completed ? "Undo" : "Complete"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onEdit}>
          <Text>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <Text>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  completed: {
    backgroundColor: "#d3ffd3",
  },
  taskText: {
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});

export default TaskItem;
