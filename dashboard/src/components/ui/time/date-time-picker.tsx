"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Control, Controller, FieldPathByValue, FieldValues } from "react-hook-form";
import { TimePicker } from "./time-picker";

interface DateTimePickerProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPathByValue<T, string | null>;
}

export function DateTimePicker<T extends FieldValues>({ control, name }: DateTimePickerProps<T>) {

  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field, formState }) =>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  formState.errors[name] ? "border-red-600" : "border-input",
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(field.value, "PPP HH:mm:ss") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
              <div className="p-3 border-t border-border">
                <TimePicker setDate={field.onChange} date={field.value} />
              </div>
            </PopoverContent>
          </Popover>
          {
            formState.errors[name] && (
              <p className="text-red-700 text-sm" >
                {formState.errors[name]?.type as string}
              </p>
            )
          }
        </div>
      }
    />
  );
}