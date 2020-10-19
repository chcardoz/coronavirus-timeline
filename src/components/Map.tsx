import React, { useState, useEffect, useRef, FC } from "react"
import {
  geoPath,
  select,
  geoAlbersUsa,
  csv,
  DSVRowArray,
  scaleThreshold,
  schemeYlOrRd,
} from "d3"
import * as topojson from "topojson"
import { Topology, GeometryCollection } from "topojson-specification"
import { FeatureCollection } from "geojson"
import topojsonData from "../data/us-data"

//the features of the counties
const countyFeatures: FeatureCollection = topojson.feature(
  (topojsonData as unknown) as Topology,
  topojsonData.objects.counties as GeometryCollection
)
//type of projection to use
const projection = geoAlbersUsa().scale(400)
//color scale for map
const colorScale = scaleThreshold<number, string>()
  .domain([10, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000])
  .range(schemeYlOrRd[9])
//types for the props
interface Props {
  date: Date
}

const Map: FC<Props> = (props) => {
  const [data, setData] = useState<any>()
  const svgRef = useRef<SVGSVGElement | null>(null)
  let dataCallBack = (date: string, data: DSVRowArray<string>) => {
    let formattedData = data.reduce((acc, cur) => {
      acc[cur.countyFIPS!] = cur[date]
      return acc
    })
    return formattedData
  }

  //formatting the year to only have last two digits
  const formattedYear = props.date.getFullYear().toString().substr(2, 2)

  //formatting date to be of form mm/dd/yy withouth zeroes
  const formattedDate = `${
    props.date.getMonth() + 1
  }/${props.date.getDate()}/${formattedYear}`

  //when svg mounts
  useEffect(() => {
    const path = geoPath().projection(projection)
    const svg = select(svgRef.current)
    svg.attr("height", 500).attr("width", 500)

    svg
      .append("g")
      .attr("transform", "translate(0,0)")
      .selectAll(".county")
      .data(countyFeatures.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("fill", (d) => {
        if (data != null) {
          return colorScale(parseInt(data[d.id], 10)) as string
        }
      })
  }, [data])

  //when the csv mounts and changes according to the date picker
  useEffect(() => {
    csv("/covid_confirmed.csv").then((counties) =>
      setData(
        (dataCallBack(formattedDate, counties) as unknown) as DSVRowArray<
          string
        >
      )
    )
  }, [formattedDate])

  return (
    <div>
      <svg ref={svgRef} />
    </div>
  )
}

export default Map
