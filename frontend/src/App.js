import { useState, useEffect } from 'react';
import { useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import Url from './url.js'
 
function App() {

  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
    console.log("Вы авторизированы = ",isAuthenticated);
  }, [isAuthenticated,navigate]);


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasksByDate, setTasksByDate] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
    console.log('Selected Date:', date);
  };

  const fetchTasks = async () => {
    const apiUrl = Url+':3001/entry';

    let packet = {id:selectedDate};
    console.log(packet);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(packet),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Fetched tasks:', data);
      setTasksByDate(data || []);
    } catch (error) {
      console.error('Error fetching tasks from backend:', error);
    }
  };

  useEffect(() => {
    if(isAuthenticated)
    fetchTasks();
  }, [selectedDate]);

  const addTask = async () => {
    const newTask = { text: newTaskText, completed: false, date: selectedDate };

    const apiUrl = Url+':3001/entry_create';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Backend response:', data);

      setNewTaskText('');
      fetchTasks();
    } catch (error) {
      console.error('Error adding task to backend:', error);
    }
  };

  const toggleTask = async (taskId) => {
    const apiUrl = Url+':3001/entry_toggle';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:taskId}),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Backend response:', data);

      fetchTasks();
    } catch (error) {
      console.error('Error adding task to backend:', error);
    }
  };

  const removeTask = async (taskId) => {
    const apiUrl = Url+':3001/entry_remove';

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:taskId}),
        credentials: 'include',
      });

      const data = await response.json();
      console.log('Backend response:', data);

      fetchTasks();
    } catch (error) {
      console.error('Error adding task to backend:', error);
    }
  };

  return (
    isAuthenticated && (
      <div className="page-container">
        <h1 className="page-title">Welcome on Main Page</h1>
        <div className="date-picker-container">
          <p>This day is selected</p>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            isClearable
            placeholderText="Select a date"
          />
        </div>
        <div className="task-list">
          <h5>You can create some Tasks on the selected day!</h5>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <p>You can choose if the task is completed!</p>
          {tasksByDate.map((task) => (
            <li key={task.id} className="task-item">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span className="task-text" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.text}
                </span>
                <button className="remove-btn" onClick={() => removeTask(task.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="new-task-container">
            <input
              type="text"
              className="new-task-input"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="New task"
            />
            <button className="add-task-btn" onClick={addTask}>
              Add Task
            </button>
          </div>
        </div>
      </div>
    )
  );
}
 
export default App;