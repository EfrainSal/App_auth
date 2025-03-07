import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('tasks.db');

export default function TaskManager() {
  const [task, setTask] = useState(''); 
  const [tasks, setTasks] = useState([]); 

  useEffect(() => {
    db.execAsync('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT);')
      .then(() => {
        console.log('Tabla de tareas creada o ya existente.');
        loadTasks(); 
      })
      .catch(error => console.log('Error creando tabla:', error));
  }, []);

  const loadTasks = () => {
    db.getAllAsync('SELECT * FROM tasks;')
      .then(rows => setTasks(rows))
      .catch(error => console.log('Error cargando tareas:', error));
  };

  const saveTask = () => {
    if (!task.trim()) {
      Alert.alert('Error', 'Por favor ingresa una tarea válida.');
      return;
    }

    db.runAsync('INSERT INTO tasks (name) VALUES (?);', [task])
      .then(() => {
        setTask(''); 
        loadTasks(); 
      })
      .catch(error => console.log('Error guardando tarea:', error));
  };

  const deleteTask = (id) => {
    db.runAsync('DELETE FROM tasks WHERE id = ?;', [id])
      .then(() => {
        Alert.alert('Tarea Eliminada', 'La tarea ha sido eliminada.');
        loadTasks(); 
      })
      .catch(error => console.log('Error eliminando tarea:', error));
  };

  return (
    
    <View style={styles.container}>
      <Text style={styles.title}> Gestor de Tareas</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe una tarea"
          value={task}
          onChangeText={setTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={saveTask}>
          <Text style={styles.addButtonText}> Agregar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.name}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
              <Text style={styles.deleteButtonText}> Eliminar </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});