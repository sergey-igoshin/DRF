import React from 'react';

class UserForm extends React.Component {
  
    constructor(props) {
    super(props)
    
    this.state = {
      'username': '',
      'first_name': '',
      'last_name': '',
      'email': '',
      'is_active': false,
      'is_superuser': false,
      'is_staff': false,
    }
  }   

  handleChange(e){
    this.setState(
        {
            [e.target.name]: e.target.value
        }
    )
  }

  checkboxChange(e){
    this.setState(
      {
          [e.target.name]: e.target.checked
      }
    )
  }

  handleSubmit(e){
    e.preventDefault()
    
    this.props.createContent(this.state, 'users')
    // console.log(this.state)    
  }

  

  render () {
    return (      
      <div>
        <form onSubmit={(event => this.handleSubmit(event))}>
          <p>
            <input type='text' name='username' placeholder='username' value={this.state.username} onChange={(event) => this.handleChange(event)} />
          </p>
          <p>
            <input type='text' name='first_name' placeholder='Имя' value={this.state.first_name} onChange={(event) => this.handleChange(event)} />
          </p>
          <p>
            <input type='text' name='last_name' placeholder='Фамилия' value={this.state.last_name} onChange={(event) => this.handleChange(event)} />
          </p>
          <p>
            <input type='text' name='email' placeholder='Email' value={this.state.email} onChange={(event) => this.handleChange(event)} />
          </p>          
          <p>
            <input type="checkbox" name='is_superuser' onChange={(event) => this.checkboxChange(event)}/> Администратор
          </p>
          <p>
            <input type="checkbox" name='is_staff' onChange={(event) => this.checkboxChange(event)}/> Персонал
          </p>
          <button type='submit'>Создать</button>
        </form>     
      </div>
    )
  }
}
export default UserForm;
