import React from 'react';

class ProjectForm extends React.Component {
  
    constructor(props) {
    super(props)
    
    this.state = {
      'url_repo': '',
      'title': '',
      'description': '',
      'project_is_completed': false,
      'user': [],
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
    if(!e.target.selectedOptions){
      this.setState({
        'user':[]
      })
      return;
    }

    let users = []

    for(let option of e.target.selectedOptions){
      users.push(option.value)
    }
    this.setState({
      'user': users
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

    if (this.state.user.length === 0){
      document.querySelector('select').classList.add('errors')
      return
    }
    document.querySelector('select').classList.remove('errors')

    this.props.createContent(this.state, 'projects')
    // console.log(this.state)    
  }

  render () {
    return (      
      <div>
        <form onSubmit={(event => this.handleSubmit(event))}>
          <p>
            <input type='text' name='url_repo' placeholder='ссылка на репозиторий' value={this.state.url_repo} onChange={(event) => this.handleChange(event)} />
          </p>
          <p>
            <input type='text' name='title' placeholder='проект' value={this.state.title} onChange={(event) => this.handleChange(event)} />
          </p>
          <p>
            <input type='text' name='description' placeholder='описание' value={this.state.description} onChange={(event) => this.handleChange(event)} />
          </p>
          {/* <p>
            <input type="checkbox" name='project_is_completed' onChange={(event) => this.checkboxChange(event)}/> Завершить проект
          </p> */}
          <p>
            <select multiple onChange={(event) => this.handleUsersSelecte(event)}>
              {this.props.users.map((user) => <option value={user.id}>{user.first_name} {user.last_name}</option>)}                  
            </select>
          </p>
          <button type='submit'>Создать</button>
        </form>     
      </div>
    )
  }
}
export default ProjectForm;
