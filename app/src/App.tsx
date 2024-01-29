import { ColumnDef } from "@tanstack/react-table"
import { useState } from 'react'
import { IQuestion } from '../AwesomeProject/app/lib/api'
import { useQuestions } from "./../AwesomeProject/app/hooks/useQuestions"
import './App.css'
import { DataTable } from "./components/DataTable"
import { ThemeProvider } from "@/components/theme-provider"

// TODO: Add deletion column & inspect
export const columns: ColumnDef<IQuestion>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'options',
    header: 'Options',
  },
  {
    accessorKey: 'categories',
    header: 'Categories',
  }
]

function App() {
  const [count, setCount] = useState(0)
  const questions = useQuestions()
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <>
      <div>
        <h2>Questions</h2>
        <DataTable columns={columns} data={questions} />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
    </ThemeProvider>
  )
}

export default App
