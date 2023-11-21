import { useEffect, useState } from 'react'
import { NewDiaryEntry, NonSensitiveDiaryEntry } from './types';

import DiaryEntry from './DiaryEntry';
import NewDiaryForm from './NewDiaryForm';
import './App.css'
import axios from 'axios';

function App() {
  const [diary, setDiary] = useState<NonSensitiveDiaryEntry[]>([]);
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    const runEffect = async () => {
      const response = await axios.get<NonSensitiveDiaryEntry[]>('http://localhost:3000/api/diaries')
      setDiary(response.data);
    }
    runEffect();
  }, [])

  const addEntry = async (entry: NewDiaryEntry) => {
    try {
      const response = await axios.post<NonSensitiveDiaryEntry>('http://localhost:3000/api/diaries', entry);
      setDiary([...diary, response.data]);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        setNotif("Error: " + e.response?.data);
        setTimeout(() => {
          setNotif(null);
        }, 5000);
      }
      console.log(e);
    }
  }

  return (
    <>
      <h1>Add New Entry</h1>
      {notif && (<p style={{ color: 'red'}}>{notif}</p>)}
      <NewDiaryForm addEntry={addEntry}/>
      <h1>Diary Entries</h1>
      {diary.map(entry => (
        <DiaryEntry key={entry.id} entry={entry} />
      ))}
    </>
  )
}

export default App
