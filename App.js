import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TouchableOpacity, FlatList, Modal, TextInput} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const AnimatableBtn = Animatable.createAnimatableComponent(TouchableOpacity);


import TaskList from './src/components/TaskList';

export default function App() {

  const [task, setTask] = useState([]);
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);

  useEffect( () => {
    async function loadTasks() {
      const taskStorage = await AsyncStorage.getItem('@task');

      if(taskStorage){
        setTask(JSON.parse(taskStorage));
      }
    }

    loadTasks();

  }, []);

  useEffect(() => {

    async function saveTasks() {
      await AsyncStorage.setItem('@task', JSON.stringify(task));
    }

    saveTasks();

  }, [task]);

  const handleAdd = function(){
    if (input === '') return;

    const data = {
      key: input,
      task: input
    };

    setTask([...task, data]);
    setOpen(false);
    setInput('');
  };

  const handleDelete = useCallback((data) => {
    const find = task.filter(r => r.key !== data.key);
    setTask(find);
  })
    

  return (

    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor= '#171d31'
        barStyle= 'light-content'      
      />

      <View style={styles.content}>
        <Text style={styles.title}>Minhas Tarefas</Text>
      </View>

      <FlatList
        showsHorizontalScrollIndicator={false}
        marginHorizontal={10}
        data={task}
        keyExtractor={ (item) => String(item.key) }
        renderItem={ ({item}) => <TaskList data={item} handleDelete={handleDelete} />  }
      />

      <Modal animationType='slide' transparent={false} visible={open}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false) } >
              <Ionicons style={{marginLeft: 10, marginRight: 5, marginTop: 5}} name='md-arrow-back' size={40} color= '#fff' />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Nova Tarefa</Text>
          </View>

          <Animatable.View styles={styles.modalBody} animation= 'fadeInUp' useNativeDriver>
            <TextInput
            multiline={true}
              placeholder= 'O que precisa fazer Hoje? '
              placeholderTextColor= '#747474'
              autoCorrect={false}
              style={styles.input}
              value={input}
              onChangeText={ (text) => setInput(text) }
            />

            <TouchableOpacity style={styles.handleAdd} onPress={ handleAdd }>
                <Text style={styles.handleAddText}>Cadastrar</Text>
            </TouchableOpacity>

          </Animatable.View>
        </SafeAreaView>
      </Modal>

      <AnimatableBtn 
        style={styles.fab}
        useNativeDriver
        animation= 'bounceInUp'
        duration={1500}
        onPress={() => setOpen(true)}
      >
        <Ionicons name="ios-add" size={35} color= "#fff" />
      </AnimatableBtn>


    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  container: {

    flex: 1,
    backgroundColor: '#171d31'

  },
  title: {
    marginTop: 10,
    paddingBottom: 10,
    textAlign: 'center',
    color: '#fff',
    fontSize: 25
  },
  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#121212',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3
    }
  },
  modal: {
    flex: 1,
    backgroundColor: '#171d31'
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 25,
    marginLeft: 15,
    color: '#fff'
  },
  modalBody: {
    marginTop: 15
  },
  input: {
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 9,
    height: 85,
    textAlignVertical: 'top',
    color: '#121212',
    borderRadius: 5
  },
  handleAdd: {
    backgroundColor: '#fff',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    height: 40,
    borderRadius: 5
  },
  handleAddText: {
    fontSize: 20
  }

});
