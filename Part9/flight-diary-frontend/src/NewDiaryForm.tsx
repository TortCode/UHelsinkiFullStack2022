import { NewDiaryEntry, Visibility, Weather } from "./types"

interface NewDiaryFormProps {
  addEntry: (entry: NewDiaryEntry) => void;
}

function NewDiaryForm({ addEntry }: NewDiaryFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const target = event.target as typeof event.target & {
      date: { value: string };
      visibility: { value: string};
      weather: { value: string };
      comment: { value: string };
    };

    const entry: NewDiaryEntry = {
      date: target.date.value,
      visibility: target.visibility.value as Visibility,
      weather: target.weather.value as Weather,
      comment: target.comment.value, 
    };

    addEntry(entry);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">date:</label>
        <input type="date" name="date" id="date"></input>
      </div>
      <div>
        visibility:
        {Object.values(Visibility).map(v => (
          <label key={v} htmlFor={v}>
            <input type="radio" id={v} name="visibility" value={v} /> {v}
          </label>
        ))}
      </div>
      <div>
        weather:
        {Object.values(Weather).map(w => (
          <label key={w} htmlFor={w}>
            <input type="radio" id={w} name="weather" value={w} /> {w}
          </label>
        ))}
      </div>
      <div>
        <label htmlFor="comment">comment:</label>
        <input type="text" name="comment" id="comment"></input>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default NewDiaryForm