import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import MenuList from './components/Menu.js'
import UserList from './components/Users.js'
import ProjectList from './components/Projects.js'
import ToDoList from './components/ToDo.js'
import axios from 'axios'
import {HashRouter, BrowserRouter, Route, Routes, Navigate, Link, Switch, Redirect, useLocation} from 'react-router-dom'


const NotFound = () => {
  var {pathname} = useLocation()
  return (
    <div>
      Страница "{pathname}" не найдена
      <p>
        <a href='/'>Вернуться на главную</a>
      </p>

    </div>    
  )
}

class App extends React.Component {
  menu = [
    {
      'name': 'Главная',
      'url': '/'
    },
    {
      'name': 'Контакты',
      'url': '/contact'
    },
  ]

  constructor(props) {
    super(props)
    this.state = {
      'menu': this.menu,
      'users': [],
      'projects': [],
      'todos': [],
    }
  }    

  componentDidMount() {    
    axios.get('http://127.0.0.1:8000/api/users')
    .then(response => {
      const users = response.data
      this.setState(
        {
          'users': users,          
        }
      )
    }).catch(error => console.log(error))    

    axios.get('http://127.0.0.1:8000/api/projects')
    .then(response => {
      const projects = response.data.results
      this.setState(
        {
          'projects': projects,          
        }
      )
    }).catch(error => console.log(error))  

    axios.get('http://127.0.0.1:8000/api/todos')
    .then(response => {
      const todos = response.data.results
      this.setState(
        {
          'todos': todos,          
        }
      )
    }).catch(error => console.log(error)) 
  }

  render () {
    return (      
      <div>
        <BrowserRouter>
          <ul className="mainmenu">
            <li> <Link to='/'>Пользователи</Link></li>
            <li> <Link to='/todos'>Задачи</Link></li>   
            <li> <Link to='/projects'>Проекты</Link></li>            
          </ul>
          <div className="content">
          <Routes>    
            <Route exact path='/' element={<UserList users={this.state.users} />} />
            <Route exact path='/projects' element={<ProjectList projects={this.state.projects} users={this.state.users}/>} /> 
            <Route exact path='/todos' element={<ToDoList todos={this.state.todos} users={this.state.users}/>} /> 
            <Route path='*' element={<NotFound />}/>              
          </Routes>
          </div>  
        </BrowserRouter>        
      </div>
    )
  }
}
export default App;
