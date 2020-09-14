import React, { useState } from 'react';
import { useEffect } from 'react';
import { login, getUser } from './utils/api'
function App() {

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  // challenge 2 only - uncomment
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState({})

  const onChange = (stateKey) => ({ target }) => setLoginData({ ...loginData, [stateKey]: target.value })

  const onSubmit = (event) => {
    event.preventDefault()

    login(loginData).then((data) => {

      localStorage.setItem('access_token', data.access_token)

      setUser(data)
      setIsLoggedIn(true)
    })
  }

  // challenge 3 only - uncomment
  useEffect(() => {
    const token = window.localStorage.getItem('access_token')

    if (token) {
      getUser(token)
        .then((data) => {
          setUser(data)
          setIsLoggedIn(true)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('access_token')

    setUser({})
    setIsLoggedIn(false)
  }

  // challenge 2 only - uncomment
  if (isLoggedIn) {
    return (
      <div>
        <h1>Hello {user.name}</h1>
        <button onClick={logout}>Log out</button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        placeholder="Email"
        onChange={onChange('email')}
        value={loginData.email}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        onChange={onChange('password')}
        value={loginData.password}
      />

      <button type="submit">Log in</button>
    </form>
  );
}

export default App;   