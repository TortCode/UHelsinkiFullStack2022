import ReactDOM from 'react-dom/client'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import ancedoteReducer from './reducers/anecdoteReducer'
import filterReducer from './reducers/filterReducer'

const store = createStore(combineReducers({
  anecdotes: ancedoteReducer,
  filter: filterReducer
}))

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)