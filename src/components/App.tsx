import React, { useEffect, useRef, useState } from "react"
import * as topojson from "topojson"
import { Topology, GeometryCollection } from "topojson-specification"
import { FeatureCollection } from "geojson"
import "../styles/App.css"
import Map from "./Map"
import { csv, DSVRowArray } from "d3"
import US from "./Map"

interface Props {
  data: unknown
  states: unknown
  counties: unknown
}

type CSVData = DSVRowArray | null

const App: React.FC<Props> = (props) => {
  const initialState: CSVData = null
  const [fetchedCSVData, setFetchedCSVdata] = useState<CSVData>(initialState)

  const svgRef = useRef<SVGSVGElement | null>(null)
  const stateFeatures: FeatureCollection = topojson.feature(
    props.data as Topology,
    props.states as GeometryCollection
  )
  const countyFeatures: FeatureCollection = topojson.feature(
    props.data as Topology,
    props.counties as GeometryCollection
  )

  useEffect(() => {
    if (!fetchedCSVData) {
      csv(`${process.env.PUBLIC_URL}/covid_confirmed.csv`).then((res) => {
        setFetchedCSVdata(res)
      })
    }
  })

  return (
    <div className="App">
      <svg ref={svgRef} />
      <Map
        states={stateFeatures}
        counties={countyFeatures}
        confirmedCases={fetchedCSVData}
      />
    </div>
  )
}

export default App
