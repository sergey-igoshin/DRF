import React from 'react';

class TodoForm extends React.Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      'comment': '',
      'todo_is_completed': false,
      'user': '',
    }    
  }   

  

  handleChange(e){
    this.setState(
        {
            [e.target.name]: e.target.value
        }
    )
  }

  handleUsersSelecte(e){
    this.setState({
      'user': e.target.value
    })
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

    if (this.state.user === ''){
      document.querySelector('select').classList.add('errors')
      return
    }

    document.querySelector('select').classList.remove('errors')

    this.props.createContent(this.state, 'todos')
    // console.log(this.state)    
  }
  
  render () {
    return (      
      <div>
        <form onSubmit={(event => this.handleSubmit(event))}>
          <p>
            <input type='text' name='comment' placeholder='Задача' value={this.state.comment} onChange={(event) => this.handleChange(event)} />
          </p>
          {/* <p>
            <input type="checkbox" name='todo_is_completed' onChange={(event) => this.checkboxChange(event)}/> Завершить задачу
          </p> */}
          <p>
            <select className='one' onChange={(event) => this.handleUsersSelecte(event)}>
              <option value='' >Укажите пользователя</option>
              {this.props.users.map((user) => <option value={user.id}>{user.first_name} {user.last_name}</option>)}                  
            </select>
          </p>
          <button type='submit'>Создать</button>
        </form>     
      </div>
    )
  }
}
export default TodoForm;
