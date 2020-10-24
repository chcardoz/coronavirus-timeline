import * as React from "react"
import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "../styles/App.css"
import Map from "./Map"
import Slider from "@material-ui/core/Slider"

export default function App() {
  const [date, setDate] = useState(new Date())

  const marks = [{ value: 50, label: "midpoint" }]

  return (
    <div className="App">
      <Map date={date} />
      <DatePicker selected={date} onChange={(date) => setDate(date as Date)} />
      <Slider
        defaultValue={50}
        step={5}
        min={10}
        max={100}
        marks={marks}
        valueLabelDisplay="auto"
      />
    </div>
  )
}
