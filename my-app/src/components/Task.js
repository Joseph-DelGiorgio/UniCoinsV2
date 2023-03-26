// Task.js
import React from 'react';
import './Task.css';

const Task = ({ task, index, completeTask }) => {
  const handleComplete = () => {
    completeTask(index);
  };

  return (
    <li>
      <div>
        <span>Task Description: {task.description}</span>
        <span>Reward: {task.reward}</span>
        <span>Volunteer: {task.volunteer}</span>
        <span>Project Manager: {task.projectManager}</span>
        <span>Status: {task.completed ? 'Completed' : 'Incomplete'}</span>
      </div>
      {!task.completed && (
        <button onClick={handleComplete}>Complete</button>
      )}
    </li>
  );
};

export default Task;

