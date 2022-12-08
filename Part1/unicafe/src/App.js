import { useState } from 'react'

const Button = ({onClick, text}) => (<button onClick={onClick}>{text}</button>)

const Feedback = ({handlers}) => (
  <div>
    <h1>give feedback</h1>
    <Button onClick={handlers.good} text='good'/>
    <Button onClick={handlers.neutral} text='neutral'/>
    <Button onClick={handlers.bad} text='bad'/>
  </div>
)

const Display = ({name, value}) => (<p>{name} {value}</p>)

const Stats = ({data}) => (
  <div>
    <h1>statistics</h1>
    <Display name='good' value={data.good}/>
    <Display name='neutral' value={data.neutral}/>
    <Display name='bad' value={data.bad}/>
    <Display name='average' value={data.avg}/>
    <Display name='positive' value={data.pos_percent+'%'}/>
  </div>
)

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodClick = () => setGood(good+1);
  const neutralClick = () => setNeutral(neutral+1);
  const badClick = () => setBad(bad+1);

  const reviews = good + neutral + bad
  const avg = (good - bad) / reviews
  const pos_percent = good * 100 / reviews

  return (
    <div>
      <Feedback handlers={{good:goodClick,neutral:neutralClick,bad:badClick}}/>
      <Stats data={{ good,neutral,bad,avg,pos_percent }}/>
    </div>
  );
}

export default App;