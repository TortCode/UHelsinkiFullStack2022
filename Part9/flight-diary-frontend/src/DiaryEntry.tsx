import { NonSensitiveDiaryEntry } from "./types";

interface DiaryEntryProps {
  entry: NonSensitiveDiaryEntry
}

function DiaryEntry({ entry }: DiaryEntryProps) {
  const margin = (px: number) => ({
    marginTop: `${px}px`,
    marginBottom: `${px}px` 
  })
  return (
    <div style={margin(25)}>
      <h3 style={margin(5)}>{entry.date}</h3>
      <p style={margin(5)}>visibility: {entry.visibility}</p>
      <p style={margin(5)}>weather: {entry.weather}</p>
    </div>
  )
}

export default DiaryEntry;