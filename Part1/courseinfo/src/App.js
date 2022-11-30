const App = () => {
  const course = 'Half Stack application development';
  const part1 = 'Fundamentals of React';
  const exercises1 = 10;
  const part2 = 'Using props to pass data';
  const exercises2 = 7;
  const part3 = 'State of a component';
  const exercises3 = 14;
  
  const data = [
    {name: part1, exercises: exercises1},
    {name: part2, exercises: exercises2},
    {name: part3, exercises: exercises3},
  ];
  return (
    <div>
      <Header course={course}/>
      <Content data={data}/>
      <Total data={data}/>
    </div>
  );
}

const Header = (props) => (
  <h1>{props.course}</h1>
)

const Content = (props) => (
  <div>
    <Part data={props.data[0]}/>
    <Part data={props.data[1]}/>
    <Part data={props.data[2]}/>
  </div>
)

const Part = (props) => (
  <p>{props.data.name} {props.data.exercises}</p>
)

const Total = (props) => {
  let total = 0;
  for (const el of props.data) {
    total += el.exercises;
  }
  return (
    <p>Number of exercises {total}</p>
  )
}
export default App;
