import React, { useEffect, useRef } from "react"
import {
  geoPath,
  geoAlbersUsa,
  select,
  scaleOrdinal,
  schemeCategory10,
  schemeReds,
  scaleQuantize,
} from "d3"
import { FeatureCollection } from "geojson"
import { DSVRowArray, DSVRowString } from "d3"

type CSVData = DSVRowArray | null

interface Margin {
  top: number
  left: number
  right: number
  bottom: number
}

interface Props {
  states: FeatureCollection
  counties: FeatureCollection
  confirmedCases: CSVData | null
}

const Map: React.FC<Props> = (props) => {
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    const margin: Margin = { top: 0, left: 0, right: 0, bottom: 0 }
    const height: number = 500 - margin.top - margin.bottom
    const width: number = 800 - margin.left - margin.right
    const projection = geoAlbersUsa()
      .translate([width / 2, height / 2])
      .scale(1000)

    let confirmed: any = {}

    const colorScale = scaleQuantize().domain([0, 2])

    if (props.confirmedCases != null) {
      confirmed = props.confirmedCases.reduce((accumulator, d) => {
        if (d.countyFIPS != null) accumulator[d.countyFIPS] = d["9/1/20"]
        return accumulator
      }, {})
    }

    console.log(confirmed)

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
      .attr("fill", (d) => {
        if (d.id != null) {
          return colorScale(confirmed[d.id])
        } else {
          return "red"
        }
      })

    svg
      .append("g")
      .selectAll(".state")
      .data(props.states.features)
      .enter()
      .append("path")
      .attr("class", "state")
      .attr("d", path)
  }, [props.counties, props.states])

  return (
    <div className="Map">
      <svg ref={svgRef} />
    </div>
  )
}

export default Map
