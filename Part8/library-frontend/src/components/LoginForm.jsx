import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'

import { LOGIN } from '../queries'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const [ login, loginResult ] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors.map(e => e.message).join('\n'))
    }
  })

  useEffect(() => {
    if ( loginResult.data ) {
      const token = loginResult.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)
      navigate('/')
    }
  }, [loginResult.data, setToken])

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <form onSubmit={submit}>
      <div>
        username
        <input type="text" value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input type="password" value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type='submit'>login</button>
    </form>
  )
}

export default LoginForm