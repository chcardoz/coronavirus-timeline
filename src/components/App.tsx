import * as React from "react"
import { useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

import "../styles/App.css"
import Map from "./Map"

export default function App() {
  const [date, setDate] = useState(new Date())

  return (
    <div className="App">
      <Map date={date} />
      <DatePicker selected={date} onChange={(date) => setDate(date as Date)} />
    </div>
  )
}
