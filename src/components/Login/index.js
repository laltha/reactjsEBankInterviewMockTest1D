import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class Login extends Component {
  state = {
    userId: '',
    pin: '',
    hasError: false, // Indicates if there was an error during login
    errorMessage: '', // Stores the error message
  }

  // Handles change for User ID input
  handleUserIdChange = event => {
    this.setState({
      userId: event.target.value,
    })
  }

  // Handles change for PIN input
  handlePinChange = event => {
    this.setState({
      pin: event.target.value,
    })
  }

  // On successful login, store the JWT token and redirect
  success = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  // On failure, set error state and message
  fail = errorMessage => {
    this.setState({
      hasError: true,
      errorMessage,
    })
  }

  // Handles login form submission
  BankLogin = async event => {
    event.preventDefault()
    const {userId, pin} = this.state
    const userDetails = {user_id: userId, pin}
    const url = 'https://apis.ccbp.in/ebank/login'
    const options = {
      method: 'POST', // Changed to POST for login

      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.success(data.jwt_token)
    } else {
      this.fail(data.error_msg)
    }
  }

  render() {
    const {userId, pin, hasError, errorMessage} = this.state // Destructure state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <div className="login-content-container">
          <div className="login-image-container">
            <p className="paragraph">user ID:142420</p>
            <p className="paragraph">PIN:231225</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
              alt="website login"
              className="login-image"
            />
          </div>
          <form className="login-form" onSubmit={this.BankLogin}>
            <h1 className="header">Welcome Back!</h1>
            <div className="input-container">
              <label htmlFor="user" className="input-label">
                User ID
              </label>
              <input
                id="user"
                placeholder="Enter User ID"
                className="input-field"
                type="text"
                value={userId}
                onChange={this.handleUserIdChange}
              />
            </div>

            <div className="input-container">
              <label htmlFor="pin" className="lab">
                PIN
              </label>
              <input
                placeholder="Enter Pin"
                id="pin"
                className="input-field"
                type="password"
                value={pin}
                onChange={this.handlePinChange}
              />
            </div>
            <button className="login-button" type="submit">
              Login
            </button>
            <div className="ct">
              {hasError && <p className="error-message">{errorMessage}</p>}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
