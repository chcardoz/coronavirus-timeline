import React, { useState, useEffect, useRef } from "react";
import {
  geoPath,
  select,
  geoAlbersUsa,
  csv,
  DSVRowArray,
  scaleLinear,
  scalePow
} from "d3";
import * as topojson from "topojson";
import { Topology, GeometryCollection } from "topojson-specification";
import { FeatureCollection } from "geojson";
import topojsonData from "../data/us-data";

//the features of the counties
const countyFeatures: FeatureCollection = topojson.feature(
  (topojsonData as unknown) as Topology,
  topojsonData.objects.counties as GeometryCollection
);
//type of projection to use
const projection = geoAlbersUsa().scale(1000);
//color scale for map
const colorLinearScale = scaleLinear<string>()
  .domain([0, 10])
  .range(["white", "red"]);
const colorPowerScale = scalePow<string>()
  .domain([0, 10])
  .exponent(1.18)
  .range(["white", "red"]);

const Map = () => {
  const [data, setData] = useState<any>();
  const svgRef = useRef<SVGSVGElement | null>(null);
  let dataCallBack = (date: string, data: DSVRowArray<string>) => {
    let formattedData = data.reduce((acc, cur) => {
      acc[cur.countyFIPS!] = cur[date];
      return acc;
    });
    return formattedData;
  };

  useEffect(() => {
    const path = geoPath().projection(projection);
    const svg = select(svgRef.current);
    svg.attr("height", 800).attr("width", 1000);

    svg
      .append("g")
      .selectAll(".county")
      .data(countyFeatures.features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", path)
      .attr("fill", (d) => {
        console.log(colorLinearScale(8));
        console.log(colorPowerScale(8));
        return colorLinearScale(parseInt(data[d.id], 10)) as string;
      });
  }, [data]);

  useEffect(() => {
    csv("/covid_confirmed.csv").then((counties) =>
      setData(
        (dataCallBack("9/18/20", counties) as unknown) as DSVRowArray<string>
      )
    );
  }, []);

  return (
    <div>
      <svg ref={svgRef} />
    </div>
  );
};

export default Map;
