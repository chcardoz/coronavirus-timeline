import React, { useEffect, useRef, useState } from "react"
import {
  geoPath,
  geoAlbersUsa,
  select,
  scaleLinear,
  range,
  scaleOrdinal,
} from "d3"
import { FeatureCollection } from "geojson"
import { DSVRowArray, DSVRowString } from "d3"

type CSVData = DSVRowArray

interface Margin {
  top: number
  left: number
  right: number
  bottom: number
}

interface Props {
  states: FeatureCollection
  counties: FeatureCollection
  confirmedCases: CSVData
}

const Map: React.FC<Props> = (props) => {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const margin: Margin = { top: 0, left: 0, right: 0, bottom: 0 }
  const height: number = 500 - margin.top - margin.bottom
  const width: number = 800 - margin.left - margin.right
  const initialState: Object = null
  const [confirmed, setConfirmed] = useState(initialState)

  if (props.confirmedCases != null) {
    setConfirmed(
      props.confirmedCases.reduce((accumulator, d) => {
        if (d.countyFIPS != null) accumulator[d.countyFIPS] = d["9/1/20"]
        return accumulator
      }, {})
    )
  }

  const projection = geoAlbersUsa()
    .translate([width / 2, height / 2])
    .scale(1000)

  useEffect(() => {
    console.log(confirmed)
    //console.log(parseInt(confirmed[1001]))
    //console.log(Object.keys(confirmed).length)

    const linearScale = scaleLinear<string>()
      .domain([0, 0.5, 1])
      .range(["#efebeb", "#4d4d4d", "#ff5d5d"])

    // const colorArray = range(confirmed.length).map((d) =>
    //   linearScale(d / (confirmed.length - 1))
    // )
    //const ordinalScale = scaleOrdinal().domain(confirmed).range(colorArray)

    const path = geoPath().projection(projection)
    const svg = select(svgRef.current)

    svg
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)

    svg
      .append("g")
      .selectAll(".county")
      .data(props.counties.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", path)
    // .attr("fill", (d) => {
    //   if (d.id != null) {
    //     return ordina(confirmed[d.id])
    //   } else {
    //     return "red"
    //   }
    // })

    svg
      .append("g")
      .selectAll(".state")
      .data(props.states.features)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
  })

  return (
    <div className="Map">
      <svg ref={svgRef} />
    </div>
  )
}

export default Map
