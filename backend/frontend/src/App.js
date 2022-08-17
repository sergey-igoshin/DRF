import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import MenuList from './components/Menu.js'
import UserList from './components/Users.js'
import axios from 'axios'

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
      'users': []
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
  }

  render () {
    return (      
      <div>
        <MenuList list_menu={this.state.menu} />  
        <div className="content">
          <UserList users={this.state.users} />  
        </div>          
      </div>
    )
  }
}
export default App;
