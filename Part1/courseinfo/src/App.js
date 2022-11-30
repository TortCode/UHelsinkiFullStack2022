const App = () => {
  const course = 'Half Stack application development';
  const data = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
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
  props.data.forEach(val => total += val.exercises);
  return (
    <p>Number of exercises {total}</p>
  )
}
export default App;
