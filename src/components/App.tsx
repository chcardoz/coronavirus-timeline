import React, { useEffect, useRef } from 'react'
import { select } from 'd3'

interface Margin {
  top: number
  left: number
  right: number
  bottom: number
}

interface Props {
  data: object
}

const App: React.FC<Props> = (props) => {
  

  const svgRef = useRef<SVGSVGElement | null>(null)
  
  useEffect(() => {

    const margin: Margin = { top: 0, left: 0, right: 0, bottom: 0} 
    const height: number = 400 - margin.top - margin.bottom
    const widht: number = 800 - margin.left - margin.right

    const svg = select(svgRef.current)
    svg.attr("height", height + margin.top + margin.bottom)
      .attr("width", widht + margin.left + margin.right)
      .append("g")
        .attr("transform","translate("+margin.left+","+margin.top+")")
    
  },[])

  return (
    <div className="App">
      <svg ref={svgRef} />
    </div>
  )
}

export default App
