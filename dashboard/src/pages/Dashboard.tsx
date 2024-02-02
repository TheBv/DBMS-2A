import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/DataTable"
import { ThemeProvider } from "@/components/theme-provider"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// I don't think this is necessairily a good idea...
//import * as schema from './../../../backend/db/schema'
import { useForm } from "react-hook-form"
import { DateTimePicker } from "@/components/ui/time/date-time-picker"
import { IQuestion, deleteQuestion, postPushQuestion, putQuestion } from "@/lib/api"
import { useQuestions } from "@/hooks/useQuestions"
import { MultiSelect } from "@/components/ui/multi-select"

const categories = ["physiology", "psychology", "training", "performance", "social", "cognition"]//schema.evalCategory.enumValues
const sportCategories = ["soccer", "basketball", "tennis", "volleyball", "handball", "rugby", "hockey", "baseball", "american_football", "badminton", "table_tennis"] //schema.sportCategory.enumValues

export default function Dashboard() {
  const { questions, get: getQuestions } = useQuestions()

  const { control, register, handleSubmit, formState: { errors } } = useForm<IQuestion>()

  const columns: ColumnDef<IQuestion>[] = [
    {
      accessorKey: 'title',
      header: 'Title',
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'categories',
      header: 'Categories',
    },
    {
      accessorKey: 'sport_categories',
      header: 'Sport Categories',
    },
    {
      accessorKey: 'timing_rule',
      header: 'Timing Rule',
    },
    {
      accessorKey: 'id',
      header: '',
      cell: ({ row }) => {
        // Return a delete button
        return (
          <div>
           <Button variant="outline" onClick={() => postPushQuestion(row.original.id!)}>Send Push notifications</Button>
           <Button className="border-red-600" variant="outline" onClick={() => deleteQuestion(row.original.id!).then(() => getQuestions())}>Delete</Button>
          </div>
        )
      }
    }
  ]

  const onSubmit = handleSubmit((data) => {
    putQuestion(data).then(() =>
      getQuestions()
    )
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
                    <MultiSelect control={control} name="categories" options={categories.map((category) => ({ value: category, label: category }))} />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="categories">Sport Categories</Label>
                    <MultiSelect control={control} name="sport_categories" options={sportCategories.map((category) => ({ value: category, label: category }))} />
                  </div>
                  <div>
                    <Label htmlFor="timing">Timing</Label>
                    <DateTimePicker control={control} name="timing_rule" />
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