"use client"
import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { formatMillisecondsToTime, formatPace } from "@/utils/utils-server"
import { DateAndId, SRunAsProps } from "@/types/Main.types";
import RunCard from "@/components/RunCard/RunCard";


type DataView = "activeDurationMs" | "distance" | "pace"

interface YScales {
    activeDurationMs: d3.ScaleLinear<number, number>
    distance: d3.ScaleLinear<number, number>
    pace: d3.ScaleLinear<number, number>
    [key: string]: d3.ScaleLinear<number, number>
}

type D3Element = d3.Selection<SVGGElement, unknown, HTMLElement, any>

interface MultiLineChartProps {
    durationData: number[],
    distanceData: number[],
    paceData: number[],
    dateAndIds: DateAndId[]
}



// TODO: Make a tiny view run modal, and have cursor: pointer on hover
const MultiLineChart = ({data}: { data: MultiLineChartProps }) => {
    const [currDataView, setCurrDataView] = useState<DataView>("activeDurationMs")
    const [currRun, setCurrRun] = useState<SRunAsProps | null>(null)
    const chartRef = useRef(null)

    const getStrokeColor = (dataView: DataView) => {
        if (currDataView !== dataView) {
            return "#DDDDDD"
        }
        switch (dataView) {
            case "activeDurationMs":
                return "#72F67F"
            case "distance":
                return "#7F72F6"
            case "pace":
                return "#F67F72"
            default:
                return "#DDDDDD"
        }
    }

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = 960 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom

    useEffect(() => {
        if (!chartRef.current) return
        const svg = d3.select(chartRef.current)

        svg.selectAll("*").remove()
        svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        svg.attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .style("background", "rgb(243,243,243)")
            .style("overflow", "visible")
    }, [])

    function getYScale(data: number[]) {
        if (currDataView === "activeDurationMs") {
            return d3.scaleLinear()
                .domain([0, d3.max(data)!])
                .range([height, 0])
        }
        return d3.scaleLinear()
            .domain(d3.extent(data) as [number, number])
            .range([height, 0])
    }

    function updateYAxis(chart: D3Element, yScales: YScales) {
        chart.select(".y-axis").remove()
        const currentYScale = yScales[currDataView]
        let yAxis = d3.axisLeft(currentYScale)

        if (currDataView === "activeDurationMs") {
            yAxis.tickFormat((d) => formatMillisecondsToTime(Number(d) as number))
        }

        chart.append("g")
            .attr("class", "y-axis")
            .call(yAxis)
    }

    // Function to update lines based on current selection
    function updateChart(dataLines: Record<DataView, d3.Selection<SVGPathElement, number[], HTMLElement, undefined>>, lineGenerator: d3.Line<number>, yScales: YScales) {
        // Update all lines for any potential yScale changes
        Object.entries(dataLines).forEach(([dataView, line]) => {
            const currData = dataView === "activeDurationMs" ? data.durationData:
                dataView === "distance" ? data.distanceData : data.paceData
            const yScale = yScales[dataView]

            line.datum(currData)
                .transition()
                .attr("d", lineGenerator.y(d => yScale(d)))
                .attr("stroke", getStrokeColor(dataView as DataView))
                .attr("opacity", dataView === currDataView ? 1 : 1) // Highlight selected data view
                .attr("stroke-width", dataView === currDataView ? "3px" : "2px")
                .attr("fill", "none")
        })
        if (dataLines[currDataView]) {
            dataLines[currDataView].raise() // Bring selected data to front
        }
    }

    useEffect(() => {
        if (data && chartRef.current) {
            const svg = d3.select(chartRef.current)
            svg.selectAll("*").remove()

            const chart = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)

            const xScale = d3.scaleLinear()
                .domain([1, data.durationData.length])
                .range([0, width])

            // Dynamic scale and data based on currDataView
            const yScales: YScales = {
                activeDurationMs: getYScale(data.durationData),
                distance: getYScale(data.distanceData),
                pace: getYScale(data.paceData)
            }

            const lineGenerator = d3.line<number>()
                .x((_, i) => xScale(i + 1))
                .y(d => yScales[currDataView](d))
                .curve(d3.curveLinear)

            const dataLines = {
                activeDurationMs: chart.append("path")
                    .datum(data.durationData)
                    .attr("class", "data-line")
                    .attr("id", "activeDurationMs-line"),
                distance: chart.append("path")
                    .datum(data.distanceData)
                    .attr("class", "data-line")
                    .attr("id", "distance-line"),
                pace: chart.append("path")
                    .datum(data.paceData)
                    .attr("class", "data-line")
                    .attr("id", "pace-line")
            }

            updateYAxis(chart, yScales)
            updateChart(dataLines, lineGenerator, yScales)

            // Mouse Interactions
            const focusDot = chart.append("g")
                .append("circle")
                .style("fill", "#000")
                .attr("r", 5) // Radius of the dot
                .style("opacity", 0) // Initially hidden
            const focusText = chart.append("g")
                .append("text")
                .style("opacity", 0.5)
                .attr("text-anchor", "middle")
                .attr("alignment-baseline", "top")
                .attr("y",  100)
            const dateText = chart.append("g")
                .append("text")
                .style("opacity", 0.5)
                .attr("text-anchor", "middle")
                .attr("y",  0)


            chart.append("rect")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .style("opacity", 0)
                .on("mouseover", () => {
                    focusDot.style("opacity", 1)
                    focusText.style("opacity", 1)
                    dateText.style("opacity", 1)
                })
                .on("mouseout", () => {
                    focusDot.style("opacity", 0)
                    focusText.style("opacity", 0)
                    dateText.style("opacity", 0)
                })
                .on("mousemove", (e) => mousemove(e, xScale, yScales, focusDot, focusText, dateText))
                .on("click", (e) => {
                    const x0 = Math.round(xScale.invert(d3.pointer(e)[0]))
                    setCurrRun({
                        id: data.dateAndIds[x0 - 1].id,
                        startEpoch: data.dateAndIds[x0 - 1].date,
                        activeDurationMs: data.durationData[x0 - 1],
                        distance: data.distanceData[x0 - 1],
                        pace: data.paceData[x0 - 1]
                    })
                })

        }
    }, [currDataView, getStrokeColor])

    function mousemove(event: MouseEvent, xScale: d3.ScaleLinear<number, number>, yScales: YScales,
                       focusDot: d3.Selection<SVGCircleElement, unknown, HTMLElement, any>,
                       focusText: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
                       dateText: d3.Selection<SVGTextElement, unknown, HTMLElement, any>) {
        const x0 = Math.round(xScale.invert(d3.pointer(event)[0]))
        let selectedData, displayText = ""

        switch (currDataView) {
            case "activeDurationMs":
                selectedData = data.durationData[x0 - 1]
                displayText = formatMillisecondsToTime(selectedData)
                break
            case "distance":
                selectedData = data.distanceData[x0 - 1]
                displayText = `${selectedData.toFixed(2)} m`
                break
            case "pace":
                selectedData = data.paceData[x0 - 1]
                displayText = formatPace(selectedData)
                break
            default:
                selectedData = data.durationData[x0 - 1]
        }

        if (selectedData) {
            const currentYScale = yScales[currDataView]
            focusDot.attr("cx", xScale(x0))
                .attr("cy", currentYScale(selectedData))
                .style("opacity", 1)
            focusText.html(displayText!)
                .attr("x", xScale(x0))
                .attr("y", currentYScale(selectedData) - 15)
                .style("opacity", 1)
            dateText.html(data.dateAndIds[x0 - 1].date)
                .attr("x", xScale(x0))
                .attr("y", height + 25)
                .style("opacity", 1)
        } else {
            focusDot.style("opacity", 0)
            focusText.style("opacity", 0)
            dateText.style("opacity", 0)
        }
    }

    return (
        <div className={"flex flex-wrap gap-4"}>
            <div className={"w-fit h-fit"}>
                <svg ref={chartRef} className={"hover:cursor-pointer"}></svg>
                <div className={"flex gap-3 py-4 text-lg"}>
                    <button
                        className={`btn px-4 py-2 border-4 rounded font-medium border-charts-green ${currDataView === "activeDurationMs" && "bg-charts-green border-charts-green"}`}
                        onClick={() => setCurrDataView("activeDurationMs")}>Duration
                    </button>
                    <button
                        className={`btn px-4 py-2 border-4 rounded  font-medium border-charts-purple ${currDataView === "distance" && "bg-charts-purple"}`}
                        onClick={() => setCurrDataView("distance")}>Distance
                    </button>
                    <button
                        className={`btn px-4 py-2 border-4 rounded font-medium border-charts-red ${currDataView === "pace" && "bg-charts-red"}`}
                        onClick={() => setCurrDataView("pace")}>Pace
                    </button>
                </div>
            </div>
            <div>
                {currRun && <RunCard run={currRun}/>}
            </div>
        </div>
    )
}

export default MultiLineChart
