import { ColumnDef } from "@tanstack/react-table"
import { IQuestion, putQuestion } from '../AwesomeProject/app/lib/api'
import { useQuestions } from "./../AwesomeProject/app/hooks/useQuestions"
import './App.css'
import { DataTable } from "./components/DataTable"
import { ThemeProvider } from "@/components/theme-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Label } from "./components/ui/label"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
// I don't think this is necessairily a good idea...
import * as schema from './../../backend/db/schema'
import { Controller, useForm } from "react-hook-form"
import { DateTimePicker } from "./components/ui/time/date-time-picker"

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

const categories = schema.evalCategory.enumValues

type Question = {
  timing_rule: string
} & Omit<typeof schema.questions.$inferInsert, 'timing_rule'>


function App() {
  const questions = useQuestions()

  const { control, register, handleSubmit, formState: { errors } } = useForm<Question>()

  const onSubmit = handleSubmit((data) => {
    putQuestion({
      ...data,
      categories: (data.categories as unknown as string)?.split(',') as Question["categories"],
      options: (data.options as string | undefined)?.split(',')
    })
  })
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <>
        <div>
          <h2>Questions</h2>
          <DataTable columns={columns} data={questions} />
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Create Question</CardTitle>
              <CardDescription>Create a new question.</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" placeholder="Title of the question" {...register("title", { required: true })} error={errors.title?.type} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="Description of the question" {...register("description", { required: true })} error={errors.description?.type} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="categories">Categories</Label>
                    <Controller
                      control={control}
                      name="categories"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange}>
                          <SelectTrigger id="categories" error={errors.categories?.type}>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.toLocaleUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="options">Options</Label>
                    <Input id="options" placeholder="Comma seperated options of the question" {...register("options", { required: true })} error={errors.options?.type} />
                  </div>
                  <div>
                    <Label htmlFor="timing">Timing</Label>
                    <DateTimePicker control={control} name="timing_rule"/>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button onClick={() => onSubmit()}>Create</Button>
            </CardFooter>
          </Card>
        </div>
      </>
    </ThemeProvider>
  )
}

export default App
