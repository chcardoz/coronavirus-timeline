import React from "react"
import ReactDOM from "react-dom"
import App from "./components/App"
import data from "./data/us-data"
import * as serviceWorker from "./serviceWorker"
import { Topology } from "topojson-specification"

ReactDOM.render(
  <App
    data={data}
    states={data.objects.states}
    counties={data.objects.counties}
  />,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
