import React, { useState } from 'react';

const Calendar = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = [...Array(daysInMonth).keys()].map(i => i + 1);
  const blanks = [...Array(firstDayOfMonth).keys()];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.date);
    if (date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()) {
      const day = date.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(task);
    }
    return acc;
  }, {});

  const getTaskColor = (offboardingType) => {
    switch (offboardingType) {
      case 'Immediate':
        return 'bg-red-600';
      case 'Short':
        return 'bg-yellow-500';
      case 'Long':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded">&lt;</button>
        <h2 className="text-xl font-bold">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={nextMonth} className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded">&gt;</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {blanks.map(i => <div key={`blank-${i}`} className="h-24"></div>)}
        {days.map(day => (
          <div
            key={`day-${day}`}
            className={`h-24 p-1 border border-gray-700 overflow-y-auto
              ${new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear()
                ? 'bg-blue-900'
                : ''
              }`
            }
          >
            <div className="font-bold">{day}</div>
            {tasksByDate[day] && tasksByDate[day].map(task => (
              <div 
                key={task.id} 
                className={`text-xs p-1 mb-1 rounded ${getTaskColor(task.offboardingType)} text-white`}
                title={`${task.personToOffboard} - ${task.offboardingType}`}
              >
                {task.personToOffboard}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const Indure = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    date: '',
    category: '',
    personToOffboard: '',
    responsiblePerson: '',
    offboardingType: ''
  });
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  const offboardingTypes = ['Immediate', 'Short', 'Long'];

  const addTask = () => {
    if (newTask.date && newTask.personToOffboard && newTask.responsiblePerson && newTask.offboardingType) {
      setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
      setNewTask({
        date: '',
        category: '',
        personToOffboard: '',
        responsiblePerson: '',
        offboardingType: ''
      });
    }
  };

  const updateTask = () => {
    if (editingTask.date && editingTask.personToOffboard && editingTask.responsiblePerson && editingTask.offboardingType) {
      setTasks(tasks.map(task => task.id === editingTask.id ? editingTask : task));
      setEditingTask(null);
    }
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const sendEmailReminder = () => {
    console.log('Sending reminders for all tasks');
    tasks.forEach(task => {
      if (!task.completed) {
        console.log(`Sending reminder for offboarding: ${task.personToOffboard}`);
        console.log(`To: ${task.responsiblePerson}`);
        console.log(`Offboarding Type: ${task.offboardingType}`);
        console.log(`Due Date: ${task.date}`);
      }
    });
    setNotification("Email reminders have been sent for all incomplete tasks.");
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredTasks = tasks.filter(task => 
    task.personToOffboard.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.offboardingType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTaskColor = (offboardingType) => {
    switch (offboardingType) {
      case 'Immediate':
        return 'bg-red-600';
      case 'Short':
        return 'bg-yellow-500';
      case 'Long':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Indure Offboardings Dashboard</h1>
      {notification && (
        <div className="bg-blue-500 text-white p-2 mb-4 rounded">
          {notification}
        </div>
      )}
      <div className="flex space-x-4">
        {/* Task List and Input - Left Column */}
        <div className="w-1/3 space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Add New Offboarding Task</h2>
            <div className="space-y-2">
              <input
                placeholder="Person to offboard"
                value={newTask.personToOffboard}
                onChange={(e) => setNewTask({...newTask, personToOffboard: e.target.value})}
                className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              />
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              />
              <input
                placeholder="Category"
                value={newTask.category}
                onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              />
              <input
                placeholder="Responsible person"
                value={newTask.responsiblePerson}
                onChange={(e) => setNewTask({...newTask, responsiblePerson: e.target.value})}
                className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              />
              <select
                value={newTask.offboardingType}
                onChange={(e) => setNewTask({...newTask, offboardingType: e.target.value})}
                className="w-full p-2 bg-gray-700 text-gray-100 border border-gray-600 rounded"
              >
                <option value="">Select offboarding type</option>
                {offboardingTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <button onClick={addTask} className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded">Add Offboarding Task</button>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-4">Offboarding Task List</h2>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 text-gray-100 border border-gray-600 rounded"
            />
            <div className="space-y-2 max-h-[calc(100vh-600px)] overflow-y-auto">
              {filteredTasks.map((task) => (
                <div 
                  key={task.id}
                  className={`flex items-center p-2 rounded ${getTaskColor(task.offboardingType)}`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task.id)}
                    className="mr-2"
                  />
                  {editingTask && editingTask.id === task.id ? (
                    <div className="flex-1 flex flex-col space-y-2">
                      <input
                        value={editingTask.personToOffboard}
                        onChange={(e) => setEditingTask({...editingTask, personToOffboard: e.target.value})}
                        className="w-full p-1 bg-gray-600 text-gray-100 border border-gray-500 rounded"
                        placeholder="Person to offboard"
                      />
                      <input
                        type="date"
                        value={editingTask.date}
                        onChange={(e) => setEditingTask({...editingTask, date: e.target.value})}
                        className="w-full p-1 bg-gray-600 text-gray-100 border border-gray-500 rounded"
                      />
                      <input
                        value={editingTask.category}
                        onChange={(e) => setEditingTask({...editingTask, category: e.target.value})}
                        className="w-full p-1 bg-gray-600 text-gray-100 border border-gray-500 rounded"
                        placeholder="Category"
                      />
                      <input
                        value={editingTask.responsiblePerson}
                        onChange={(e) => setEditingTask({...editingTask, responsiblePerson: e.target.value})}
                        className="w-full p-1 bg-gray-600 text-gray-100 border border-gray-500 rounded"
                        placeholder="Responsible person"
                      />
                      <select
                        value={editingTask.offboardingType}
                        onChange={(e) => setEditingTask({...editingTask, offboardingType: e.target.value})}
                        className="w-full p-1 bg-gray-600 text-gray-100 border border-gray-500 rounded"
                      >
                        <option value="">Select offboarding type</option>
                        {offboardingTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <button onClick={updateTask} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">Save</button>
                    </div>
                  ) : (
                    <div 
                      className={`flex-1 ${task.completed ? 'line-through text-gray-300' : 'text-white'}`}
                      onClick={() => setEditingTask(task)}
                    >
                      <div>{task.personToOffboard} - {task.date}</div>
                      <div className="text-xs">
                        {task.category && `Category: ${task.category}`}
                        {task.responsiblePerson && ` | Responsible: ${task.responsiblePerson}`}
                        {task.offboardingType && ` | Type: ${task.offboardingType}`}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar View - Right Column */}
        <div className="w-2/3 space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Calendar View</h2>
              <div>
                <span className="mr-2">Tasks: {tasks.length}</span>
                <button onClick={sendEmailReminder} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">Send Reminders</button>
              </div>
            </div>
            <Calendar tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Indure;