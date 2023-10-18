import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function DatePicker({
  onChange,
  value,
  id,
}: {
  onChange: (date: Date | string | null) => void;
  value: string | null;
  id?: string;
}) {
  const dateValue = React.useMemo(
    () => (value ? format(new Date(value), "yyyy-MM-dd") : undefined),
    [value]
  );
  const [date, setDate] = React.useState<Date | undefined>(
    dateValue ? new Date(dateValue) : undefined
  );

  React.useEffect(() => {
    setDate(dateValue ? new Date(dateValue) : undefined);
  }, [dateValue]);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd")); // pass the Date object as a formatted string
    } else {
      // Format the default date value from your database/API
      onChange(value ? format(new Date(value), "yyyy-MM-dd") : null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-[185px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
