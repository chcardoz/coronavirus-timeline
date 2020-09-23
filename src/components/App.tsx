import React, { useEffect, useRef } from 'react'
import { geoPath, geoAlbersUsa, select } from 'd3'
import * as topojson from 'topojson'
import { Topology, GeometryCollection } from 'topojson-specification'
import { FeatureCollection } from 'geojson'
import '../styles/App.css'

interface Margin {
  top: number
  left: number
  right: number
  bottom: number
}

interface Props {
  data: unknown
  states: unknown
  counties: unknown
}

const App: React.FC<Props> = (props) => {
  

  const svgRef = useRef<SVGSVGElement | null>(null)
  const { features: stateFeatures } : FeatureCollection = topojson.feature(props.data as Topology,props.states as GeometryCollection) 
  const { features: countyFeatures } : FeatureCollection = topojson.feature(props.data as Topology,props.counties as GeometryCollection) 
  
  useEffect(() => {

    const margin: Margin = { top: 0, left: 0, right: 0, bottom: 0} 
    const height: number = 500 - margin.top - margin.bottom
    const width: number = 800 - margin.left - margin.right
    const projection = geoAlbersUsa()
      .translate([width/2,height/2])
      .scale(1000)

    const path = geoPath()
      .projection(projection)

    const svg = select(svgRef.current)
    svg.attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
    
    svg.selectAll(".county")
      .data(countyFeatures)
      .enter().append("path")
      .attr("class","county")
      .attr("d",path)

    
    svg.selectAll(".state")
      .data(stateFeatures)
      .enter().append("path")
      .attr("class","state")
      .attr("d",path)

  },[stateFeatures,countyFeatures])

  return (
    <div className="App">
      <svg ref={svgRef} />
    </div>
  )
}

export default App
