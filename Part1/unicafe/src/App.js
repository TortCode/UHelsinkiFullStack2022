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

const StatisticsLine = ({name, value}) => (<tr><td>{name}</td><td>{value}</td></tr>)

const Stats = ({data}) => { 
  const num = data.good + data.neutral + data.bad;
  if (num === 0){
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>statistics</h1>
        <table>
          <tbody>
            <StatisticsLine name='good' value={data.good}/>
            <StatisticsLine name='neutral' value={data.neutral}/>
            <StatisticsLine name='bad' value={data.bad}/>
            <StatisticsLine name='average' value={data.avg}/>
            <StatisticsLine name='positive' value={data.pos_percent+'%'}/>
          </tbody>
        </table>
      </div>
    )
  }
}

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
