import React, { useState, useEffect } from "react";
import { api } from "./api";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", age: "" });
  const [editingId, setEditingId] = useState(null);
  const [serverInfo, setServerInfo] = useState(null);

  useEffect(() => {
    loadUsers();
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const data = await api.checkHealth();
      setServerInfo(data);
    } catch (error) {
      console.error("Server health check failed:", error);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Ошибка загрузки:", error);
      alert("Ошибка загрузки пользователей");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const updated = await api.updateUser(editingId, formData);
        setUsers(users.map(u => u.id === editingId ? updated : u));
        setEditingId(null);
      } else {
        const created = await api.createUser(formData);
        setUsers([...users, created]);
      }
      setFormData({ name: "", age: "" });
    } catch (error) {
      console.error("Ошибка сохранения:", error);
      alert("Ошибка сохранения пользователя");
    }
  };

  const handleEdit = (user) => {
    setFormData({ name: user.name, age: user.age.toString() });
    setEditingId(user.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить пользователя?")) return;
    
    try {
      await api.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка удаления пользователя");
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", age: "" });
    setEditingId(null);
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>👥 Управление пользователями</h1>
      
      {serverInfo && (
        <div style={{ 
          padding: '10px', 
          background: '#e8f5e9', 
          borderRadius: '4px',
          marginBottom: '20px',
          fontSize: '14px'
        }}>
          ✅ Сервер работает | Пользователей: {serverInfo.usersCount} | 
          Последнее обновление: {new Date(serverInfo.timestamp).toLocaleTimeString()}
        </div>
      )}
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <a 
          href="http://localhost:3000/api-docs" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          📚 Открыть Swagger документацию
        </a>
        <a 
          href="http://localhost:3000/api-docs.json" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            display: 'inline-block',
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          📄 Скачать JSON спецификацию
        </a>
      </div>

      <form onSubmit={handleSubmit} style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '4px',
        background: '#f9f9f9'
      }}>
        <h2 style={{ marginTop: 0 }}>{editingId ? '✏️ Редактировать пользователя' : '➕ Добавить пользователя'}</h2>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Имя"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input
            type="number"
            placeholder="Возраст"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
            min="0"
            max="150"
            style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <button 
            type="submit" 
            style={{ 
              padding: '10px 20px', 
              marginRight: '10px',
              background: editingId ? '#2196F3' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {editingId ? 'Сохранить' : 'Создать'}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={handleCancel}
              style={{ 
                padding: '10px 20px',
                background: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Отмена
            </button>
          )}
        </div>
      </form>

      <div>
        <h2>📋 Список пользователей</h2>
        {loading ? (
          <p>Загрузка...</p>
        ) : users.length === 0 ? (
          <p>Пользователей пока нет</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(user => (
              <li key={user.id} style={{ 
                padding: '15px', 
                border: '1px solid #ddd', 
                borderRadius: '4px', 
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'white'
              }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>{user.name}</strong>, {user.age} лет
                  <div style={{ fontSize: '12px', color: '#666' }}>ID: {user.id}</div>
                </div>
                <div>
                  <button 
                    onClick={() => handleEdit(user)} 
                    style={{ 
                      marginRight: '5px', 
                      padding: '5px 10px',
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Редактировать
                  </button>
                  <button 
                    onClick={() => handleDelete(user.id)} 
                    style={{ 
                      padding: '5px 10px', 
                      background: '#f44336', 
                      color: 'white', 
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️ Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;