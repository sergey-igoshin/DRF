import React from 'react';

class LoginForm extends React.Component {
  
    constructor(props) {
    super(props)

    // this.obtainAuthToken = props.obtainAuthToken
    this.state = {
      'username': '',
      'password': '',
    }
  }     

  handleChange(e){
    this.setState(
        {
            [e.target.name]: e.target.value
        }
    )
  }

  handleSubmit(e){
    this.props.obtainAuthToken(this.state.username, this.state.password)
    e.preventDefault()
  }

  render () {
    return (      
      <div>
        <form onSubmit={(event => this.handleSubmit(event))}>
            <p>
                <input type='text' name='username' placeholder='login' value={this.state.username} onChange={(event) => this.handleChange(event)} />
            </p>
            <p>
                <input type='password' name='password' placeholder='password' value={this.state.password} onChange={(event) => this.handleChange(event)} />
            </p>
            <button type='submit'>Вход</button>
        </form>     
      </div>
    )
  }
}
export default LoginForm;
