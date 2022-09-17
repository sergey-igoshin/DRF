import React from 'react';

import UserList from './components/Users.js'
import MainList from './components/Main.js'
import ProjectList from './components/Projects.js'
import ToDoList from './components/ToDo.js'
import LoginForm from './components/LoginForm.js';
import ProjectForm from './components/ProjectForm.js';
import UserForm from './components/UserForm.js';
import TodoForm from './components/TodoForm.js';
import axios from 'axios'
import { BrowserRouter, Route, Routes, Link, useLocation} from 'react-router-dom'


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

  url = '/api/'

  deleteUser(userId){
    let headers = this.getHeaders();    

    axios.delete(this.url + `users/${userId}/`, {'headers': headers})
    .then(response => {
      this.setState(
        {
          'users': this.state.users.filter((user) => user.id !== userId)
        }
      )
    }).catch(error => {
      console.log(error)
    })  
  }

  completedChange(el, id, e){
    let headers = this.getHeaders();
    let body = this.state[el].filter((obj) => obj.id === id);
    body[0][e.target.name] = e.target.checked;

    axios.put(this.url + el + `/${id}/`, body[0], {'headers': headers})
    .then(response => {
      this.getData()
    }).catch(error => {
      console.log(error)
    }) 
  }  

  createContent(body, el){
    let headers = this.getHeaders();
    axios.post(this.url + el + '/', body, {'headers': headers})
    .then(response => {
      this.getData()
    }).catch(error => {
      console.log(error)
    })  
  }  
  
  obtainAuthToken(username, password){
    axios
      .post(
        '/api-auth-token/', {
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
        'Authorization': 'Token ' + this.state.token,
        'Accept': 'application/json; version=v2',
      }
    }
    return {}
  }

  getData(){
    let headers = this.getHeaders()

    axios.get('/api/users', {'headers': headers})
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

    axios.get('/api/projects', {'headers': headers})
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

    axios.get('/api/todos', {'headers': headers})
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
        <nav>
          <ul className="mainmenu topmenu">
            <li> <Link to='/'>Главная</Link> </li>                 
            {this.isAuth() ?<li> <Link to='/users'>Пользователи</Link> </li> : ''}
            {this.isAuth() ?<li> <Link to='/todos'>Задачи</Link> </li> : ''}
            {this.isAuth() ?<li> <Link to='/projects'>Проекты</Link> </li> : ''}
            {this.isAuth() ?<li><a href="" className="active">Создать</a>
              <ul class="submenu">
                <li><Link to='/create_users'>Создать пользователя</Link></li>
                <li><Link to='/create_projects'>Создать проект</Link></li>
                <li><Link to='/create_todos'>Создать задачу</Link></li>
              </ul>
            </li> : ''}
            <li class="right"> {this.isAuth() ? <Link to='/login' onClick={() => this.logout()}>Выйти</Link> : <Link to='/login'>Вход</Link>} </li>
          </ul>
          </nav>
          
          <div className="content">
          {this.isAuth() ?
            <Routes>           
              <Route exact path='/' element={<MainList/>} />
              <Route exact path='/login' element={<LoginForm obtainAuthToken={(username, password) => this.obtainAuthToken(username, password)} />} />
              <Route path='*' element={<NotFound />}/>
              <Route exact path='/users' element={<UserList users={this.state.users} deleteUser={(userId) => this.deleteUser(userId)} completedChange={(el, userId, e) => this.completedChange(el, userId, e)}/>} />
              <Route exact path='/projects' element={<ProjectList projects={this.state.projects} users={this.state.users} completedChange={(el, projectId, e) => this.completedChange(el, projectId, e)}/>} />
              <Route exact path='/todos' element={<ToDoList todos={this.state.todos} users={this.state.users} completedChange={(el, todoId, e) => this.completedChange(el, todoId, e)}/>} />
              <Route exact path='/create_users' element={<UserForm createContent={(body, el) => this.createContent(body, el)}/>} />
              <Route exact path='/create_projects' element={<ProjectForm users={this.state.users} createContent={(body, el) => this.createContent(body, el)}/>} />
              <Route exact path='/create_todos' element={<TodoForm users={this.state.users} createContent={(body, el) => this.createContent(body, el)}/>} />
            </Routes>
          :
            <Routes>           
              <Route exact path='/' element={<MainList to='/' />} />
              <Route exact path='/login' element={<LoginForm obtainAuthToken={(username, password) => this.obtainAuthToken(username, password)} />} />
              <Route path='*' element={<NotFound />}/>
            </Routes>
          } 
          </div>
        </BrowserRouter>
      </div>
    )
  }
}
export default App;
