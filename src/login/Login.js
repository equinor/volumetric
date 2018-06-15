import React from 'react';
import InputStyled from '../common/Input';
import styled from 'styled-components';

const Button = styled.button`
      width: 100px;
      height: 25px;
      font-size: 16px;
      margin-left: 5px;
    `;
const LogoutButton = styled.button`
      width: 50px;
      height: 25px;
      font-size: 14px;
      margin-left: 5px;
      background: none;
      border: none;
      color: white;
      text-decoration: underline;
    `;

const Form = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 600px;
    padding-right: 20px;
    padding-left: 20px;
    maring-right: 30px;
`;

const LogoutBox = styled.div`
  display: flex;
  align-items: flex-end;
`;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Username not set',
      password: 'Password not set',
      isLoggedIn: false
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  logInOut(loginState) {
    this.setState({isLoggedIn: loginState});
  }

  render() {
    const isLoggedIn = this.state.isLoggedIn;
    if (isLoggedIn) {
      return (
        <LogoutBox>
          <h3>User: {this.state.username}</h3>
          <LogoutButton onClick={() => this.logInOut(false)}>Logout</LogoutButton>
        </LogoutBox>
      );
    }
    return (
      <Form>
        Username:
        <InputStyled
          name="username"
          type="text"
          onChange={this.handleChange}
          autoFocus
        />
        Password:
        <InputStyled
          name="password"
          type={'password'}
          onChange={this.handleChange}
        />
        <Button onClick={() => this.logInOut(true)}>Login</Button>
      </Form>
    );

  }
}

export default Login;