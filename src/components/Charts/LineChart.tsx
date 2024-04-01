"use client"
import { useEffect, useRef } from 'react';
import * as d3 from "d3";
import { SimpleRun } from "@/types/Main.types";

const MultiAxisLineChart = ({ data }: { data: SimpleRun[] }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (data && chartRef.current) {
            const svg = d3.select(chartRef.current)
            svg.selectAll("*").remove()

            const margin = { top: 20, right: 80, bottom: 30, left: 50 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom

            const xScale = d3.scaleLinear()
                .domain([0, data.length - 1])
                .range([0, width]);

            const yScales = {
                activeDurationMs: d3.scaleLinear()
                    .domain([0, d3.max(data, d => Number(d.activeDurationMs))!])
                    .range([height, 0]),
                distance: d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.distance)!])
                    .range([height, 0]),
                pace: d3.scaleLinear()
                    .domain([0, d3.max(data, d => Number(d.pace))!])
                    .range([height, 0])
            }

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)

            // @ts-ignore
            const xAxis = d3.axisBottom(xScale).tickFormat((_, i) => i + 1)
            const yAxis = {
                activeDurationMs: d3.axisLeft(yScales.activeDurationMs),
                distance: d3.axisRight(yScales.distance).tickFormat(d => `${d} km`),
                pace: d3.axisRight(yScales.pace).tickFormat(d => `${d} min/km`)
            }

            svg.append("g")
                .attr("transform", `translate(0,${height})`)
                // @ts-ignore
                .call(xAxis)

            svg.append("g")
                .call(yAxis.activeDurationMs)

            svg.append("g")
                .attr("transform", `translate(${width}, 0)`)
                .call(yAxis.distance)

            svg.append("g")
                .attr("transform", `translate(${width + 60}, 0)`)
                .call(yAxis.pace)

            const lineGenerators = {
                activeDurationMs: d3.line<SimpleRun>()
                    .x((_, i) => xScale(i))
                    .y(d => yScales.activeDurationMs(Number(d.activeDurationMs))),
                distance: d3.line<SimpleRun>()
                    .x((_, i) => xScale(i))
                    .y(d => yScales.distance(d.distance)),
                pace: d3.line<SimpleRun>()
                    .x((_, i) => xScale(i))
                    // @ts-ignore
                    .y(d => yScales.pace(d.pace))
            }

            const colors = { activeDurationMs: "red", distance: "green", pace: "blue" }

            Object.keys(lineGenerators).forEach(metric => {
                svg.append("path")
                    .datum(data)
                    .attr("fill", "none")
                    .attr("stroke", colors[metric])
                    .attr("stroke-width", 2)
                    .attr("d", lineGenerators[metric])
            })
        }
    }, [data])

    return <svg ref={chartRef}></svg>
};

export default MultiAxisLineChart
