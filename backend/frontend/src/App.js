import React from 'react';

import UserList from './components/Users.js'
import ProjectList from './components/Projects.js'
import ToDoList from './components/ToDo.js'
import LoginForm from './components/LoginForm.js';
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
  constructor(props) {
    super(props)
    this.state = {
      'users': [],
      'projects': [],
      'todos': [],
      'token': '',
    }
  }   
  
  obtainAuthToken(username, password){
    axios
      .post(
        'http://127.0.0.1:8000/api-auth-token/', {
          'username': username,
          'password': password,
        })
      .then(response => {
        const token = response.data.token
        localStorage.setItem('token', token)
        this.setState(
          {
            'token': token,          
          }, this.getData
        )
      }).catch(error => console.log(error))  
  }

  isAuth(){
    return !!this.state.token
  }

  componentDidMount() {  
    let token = localStorage.getItem('token')
    this.setState(
      {
        'token': token,          
      }, this.getData
    )
  }

  getHeaders(){
    if (this.isAuth()){
      return {
        'Authorization': 'Token ' + this.state.token
      }
    }
    return {}
  }

  getData(){
    let headers = this.getHeaders()

    axios.get('http://127.0.0.1:8000/api/users', {'headers': headers})
    .then(response => {
      const users = response.data
      this.setState(
        {
          'users': users,          
        }
      )
    }).catch(error => {
      console.log(error)
      this.setState({
        'users': [],
      })
    })    

    axios.get('http://127.0.0.1:8000/api/projects', {'headers': headers})
    .then(response => {
      const projects = response.data.results
      this.setState(
        {
          'projects': projects,          
        }
      )
    }).catch(error => {
      console.log(error)
      this.setState({
        'projects': [],
      })
    })  

    axios.get('http://127.0.0.1:8000/api/todos', {'headers': headers})
    .then(response => {
      const todos = response.data.results
      this.setState(
        {
          'todos': todos,          
        }
      )
    }).catch(error => {
      console.log(error)
      this.setState({
        'todos': [],
      })
    })
  }

  logout(){
    localStorage.setItem('token', '')
    this.setState(
      {
        'token': '',
      }, this.getData
    )
  }

  render () {
    return (
      <div>
        <BrowserRouter>
          <ul className="mainmenu">            
            <li> <Link to='/'>Пользователи</Link> </li>
            <li> <Link to='/todos'>Задачи</Link> </li>
            <li> <Link to='/projects'>Проекты</Link> </li>
            <li> {this.isAuth() ? <button onClick={() => this.logout()}>Выйти</button> : <Link to='/login'>Вход</Link>} </li>      
          </ul>

          <div className="content">          
            <Routes>              
              <Route exact path='/' element={<UserList users={this.state.users} />} />
              <Route exact path='/projects' element={<ProjectList projects={this.state.projects} users={this.state.users}/>} />
              <Route exact path='/todos' element={<ToDoList todos={this.state.todos} users={this.state.users}/>} />
              <Route exact path='/login' element={<LoginForm obtainAuthToken={(username, password) => this.obtainAuthToken(username, password)} />} />
              <Route path='*' element={<NotFound />}/>
            </Routes>            
          </div>
        </BrowserRouter>
      </div>
    )
  }
}
export default App;
