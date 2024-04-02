"use client"
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { SimpleRun } from "@/types/Main.types"
import { formatMillisecondsToTime, formatPace } from "@/utils/utils-server"


type DataView = "activeDurationMs" | "distance" | "pace"


interface YScales {
    activeDurationMs: d3.ScaleLinear<number, number, never>
    distance: d3.ScaleLinear<number, number, never>
    pace: d3.ScaleLinear<number, number, never>
    [key: string]: d3.ScaleLinear<number, number, never>
}


const MultiAxisLineChart = ({ data }: { data: SimpleRun[] }) => {
    const [currDataView, setCurrDataView] = useState<DataView>("activeDurationMs")
    const chartRef = useRef(null)
    let chartData = data.slice(0, 10)
    useEffect(() => {
        if (chartRef.current) {
            const svg = d3.select(chartRef.current)
            svg.selectAll("*").remove()

            const margin = { top: 20, right: 30, bottom: 30, left: 50 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom

            const chart = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("background", "rgba(157,157,157,0.28)")
                .style("overflow", "visible")

            const xScale = d3.scaleLinear()
                .domain([1, chartData.length])
                .range([0, width])

            // Prepare data
            const durationData = chartData.map(d => Number(d.activeDurationMs))
            const distanceData = chartData.map(d => Number(d.distance))
            const paceData = chartData.map(d => Number(d.pace))

            // Dynamic scale and data based on currDataView
            const yScales: YScales = {
                activeDurationMs: getYScale(durationData),
                distance: getYScale(distanceData),
                pace: getYScale(paceData)
            }

            function getYScale(data: number[]) {
                return d3.scaleLinear()
                    .domain([0, d3.max(data)!])
                    .range([height, 0])
            }

            const lineGenerator = d3.line<number>()
                .x((_, i) => xScale(i + 1))
                .y(d => yScales[currDataView](d))
                .curve(d3.curveCardinal)

            const dataLines = {
                activeDurationMs: chart.append("path")
                    .datum(durationData)
                    .attr("class", "data-line")
                    .attr("id", "activeDurationMs-line"),
                distance: chart.append("path")
                    .datum(distanceData)
                    .attr("class", "data-line")
                    .attr("id", "distance-line"),
                pace: chart.append("path")
                    .datum(paceData)
                    .attr("class", "data-line")
                    .attr("id", "pace-line")
            }

            const getStrokeColor = (dataView: DataView) => {
                return dataView === "activeDurationMs" ? "#5b55ff" :
                    dataView === "distance" ? "#ff5e5e" : "#51fd4c"
            }

            // Function to update lines based on current selection
            function updateChart() {
                // Ensure the current yScale is used for the line being updated
                const currentYScale = yScales[currDataView]

                // Update all lines for any potential yScale changes
                Object.entries(dataLines).forEach(([dataView, line]) => {
                    const data = dataView === "activeDurationMs" ? durationData :
                        dataView === "distance" ? distanceData : paceData
                    const yScale = yScales[dataView]

                    line.datum(data)
                        .transition()
                        .attr("d", lineGenerator.y(d => yScale(d)))
                        .attr("stroke", getStrokeColor(dataView as DataView))
                        .attr("opacity", dataView === currDataView ? 1 : 0.3) // Highlight selected data view
                        .style("z-index", dataView === currDataView ? 2 : 1)
                        .attr("stroke-width", dataView === currDataView ? "3px" : "2px")
                        .attr("fill", "none")
                })

                // Update Y Axis on currView change
                chart.select(".y-axis").remove() // Remove the existing Y axis
                chart.append("g")
                    .attr("class", "y-axis")
                    .call(d3.axisLeft(currentYScale))
            }

            // Call updateChart on initial render
            updateChart()


            // Mouse Interactions
            const focusDot = chart.append("g")
                .append("circle")
                .style("fill", "#000")
                .attr("r", 5) // Radius of the dot
                .style("opacity", 0.5) // Initially hidden

            const focusText = chart.append("g")
                .append("text")
                .style("opacity", 0.5)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "top")

            chart.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .style("opacity", 0)
                .on("mouseover", () => {
                    focusDot.style("opacity", 1)
                    focusText.style("opacity", 1)
                })
                .on("mouseout", () => {
                    focusDot.style("opacity", 0)
                    focusText.style("opacity", 0)
                })
                .on("mousemove", mousemove)

            function mousemove(event: MouseEvent) {
                const x0 = Math.round(xScale.invert(d3.pointer(event)[0]))
                let selectedData, displayText = ""

                switch (currDataView) {
                    case "activeDurationMs":
                        selectedData = durationData[x0 - 1]
                        displayText = formatMillisecondsToTime(selectedData)
                        break
                    case "distance":
                        selectedData = distanceData[x0 - 1]
                        displayText = `${selectedData.toFixed(2)} m`
                        break
                    case "pace":
                        selectedData = paceData[x0 - 1]
                        displayText = formatPace(selectedData)
                        break
                    default:
                        selectedData = undefined
                }

                if (selectedData) {
                    const currentYScale = yScales[currDataView]
                    focusDot.attr("cx", xScale(x0))
                        .attr("cy", currentYScale(selectedData))
                        .style("opacity", 1)

                    focusText.html(displayText!)
                        .attr("x", xScale(x0))
                        .attr("y", currentYScale(selectedData) - 10)
                        .style("opacity", 1)
                } else {
                    focusDot.style("opacity", 0)
                    focusText.style("opacity", 0)
                }
            }
        }
    }, [chartData, currDataView])

    return (
        <div>
            <svg ref={chartRef}></svg>
            <div className={"flex gap-3 py-4"}>
                <button className={"btn bg-amber-500 p-4 rounded"} onClick={() => setCurrDataView("activeDurationMs")}>Duration</button>
                <button className={"btn bg-amber-600 p-4 rounded"} onClick={() => setCurrDataView("distance")}>Distance</button>
                <button className={"btn bg-amber-700 p-4 rounded"} onClick={() => setCurrDataView("pace")}>Pace</button>
            </div>

        </div>
    )
}

export default MultiAxisLineChart
// create a legend
// const legend = svg.append("g")
//     .attr("transform", `translate(${width + 20}, 20)`)
//     .attr("font-family", "sans-serif")
//     .attr("font-size", 10)
//     .selectAll("g")
//     .data(Object.keys(colors))
//     .join("g")
//     .attr("transform", (_, i) => `translate(0,${i * 20})`)
// legend.append("rect")
//     .attr("x", -19)
//     .attr("width", 19)
//     .attr("height", 19)
//     .attr("fill", d => colors[d])
// legend.append("text")
//     .attr("x", -24)
//     .attr("y", 9.5)
//     .attr("dy", "0.35em")
//     .text(d => d)