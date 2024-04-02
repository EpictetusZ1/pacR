"use client"
import { SetStateAction, useEffect, useRef, useState } from "react"
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

type SortedData = {
    activeDurationMs: number[]
    distance: number[]
    pace: number[]
}

const initialSortedData: SortedData = {
    activeDurationMs: [],
    distance: [],
    pace: []
}

const MultiAxisLineChart = ({data}: { data: SimpleRun[] }) => {
    const [sortedData, setSortedData] = useState<SortedData>(initialSortedData)
    const [currDataView, setCurrDataView] = useState<DataView>("activeDurationMs")
    const [dates, setDates] = useState<Date[]>([])
    const chartRef = useRef(null)

    useEffect(() => {
        if (!data) return
        let dates: Date[] = []
        const sortedChartData = data.sort((a, b) => {
            dates.push(new Date(a.startEpoch))
            // @ts-ignore
            return new Date(b.startEpoch) - new Date(a.startEpoch)
        })

        let durationData: number[] = []
        let distanceData: number[] = []
        let paceData: number[] = []



        sortedChartData.forEach(item => {
            durationData.push(Number(item.activeDurationMs))
            distanceData.push(Number(item.distance))
            paceData.push(Number(item.pace))
        })

        if (durationData.length > 0 && distanceData.length > 0 && paceData.length > 0) {
            setSortedData({
                activeDurationMs: durationData,
                distance: distanceData,
                pace: paceData
            })
            setDates(dates)
        }
    }, [data])

    useEffect(() => {
        if (sortedData && chartRef.current) {
            const svg = d3.select(chartRef.current)
            svg.selectAll("*").remove()

            const margin = { top: 20, right: 30, bottom: 40, left: 50 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom

            const chart = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("background", "rgb(243,243,243)")
                .style("overflow", "visible")

            const xScale = d3.scaleLinear()
                .domain([1, sortedData.activeDurationMs.length])
                .range([0, width])

            // const ticks = dates.length > 10 ? dates.filter((d, i) => i % Math.floor(dates.length / 10) === 0) : dates;
            //
            // const xAxis = d3.axisBottom(xScale)
            //     .tickValues(ticks.map((_, i) => i + 1))
            //     .tickFormat((_, i) => {
            //         return dates[i].toLocaleDateString()
            //     })
            //
            // let currentX = 0;
            //
            // chart.append("g")
            //     .attr("transform", `translate(0,${height})`)
            //     .call(xAxis)
            //     .selectAll("text")
            //     .attr("transform", "rotate(-45)")
            //     .style("text-anchor", "end")
            //     .style("font-size", "12px")
            //     // .attr("transform", "translate(" + width + ",0)");
            //     .attr("x", -10)
            // // 10 max ticks, separated by 10% of the data length


            // Dynamic scale and data based on currDataView
            const yScales: YScales = {
                activeDurationMs: getYScale(sortedData.activeDurationMs),
                distance: getYScale(sortedData.distance),
                pace: getYScale(sortedData.pace)
            }

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

            const lineGenerator = d3.line<number>()
                .x((_, i) => xScale(i + 1))
                .y(d => yScales[currDataView](d))
                .curve(d3.curveCardinal)

            const dataLines = {
                activeDurationMs: chart.append("path")
                    .datum(sortedData.activeDurationMs)
                    .attr("class", "data-line")
                    .attr("id", "activeDurationMs-line"),
                distance: chart.append("path")
                    .datum(sortedData.distance)
                    .attr("class", "data-line")
                    .attr("id", "distance-line"),
                pace: chart.append("path")
                    .datum(sortedData.pace)
                    .attr("class", "data-line")
                    .attr("id", "pace-line")
            }

            const getStrokeColor = (dataView: DataView) => {
                if (currDataView !== dataView) {
                    return "#DDDDDD";
                }
                switch (dataView) {
                    case "activeDurationMs":
                        return "#72F67F";
                    case "distance":
                        return "#7F72F6";
                    case "pace":
                        return "#F67F72";
                    default:
                        return "#DDDDDD";
                }
            }

            // Function to update lines based on current selection
            function updateChart() {
                // Ensure the current yScale is used for the line being updated
                const currentYScale = yScales[currDataView]

                // Update all lines for any potential yScale changes
                Object.entries(dataLines).forEach(([dataView, line]) => {
                    const data = dataView === "activeDurationMs" ? sortedData.activeDurationMs :
                        dataView === "distance" ? sortedData.distance : sortedData.pace
                    const yScale = yScales[dataView]

                    line.datum(data)
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

            function updateYAxis() {
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

            updateYAxis()
            updateChart()


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
                        selectedData = sortedData.activeDurationMs[x0 - 1]
                        displayText = formatMillisecondsToTime(selectedData)
                        break
                    case "distance":
                        selectedData = sortedData.distance[x0 - 1]
                        displayText = `${selectedData.toFixed(2)} m`
                        break
                    case "pace":
                        selectedData = sortedData.pace[x0 - 1]
                        displayText = formatPace(selectedData)
                        break
                    default:
                        selectedData = sortedData.activeDurationMs[x0 - 1]
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
                } else {
                    focusDot.style("opacity", 0)
                    focusText.style("opacity", 0)
                }
            }
        }
    }, [sortedData, currDataView])

    return (
        <div>
            <svg ref={chartRef}></svg>
            <div className={"flex gap-3 py-4 text-lg"}>
                <button className={`btn px-4 py-2 border-4 rounded font-medium border-charts-green ${currDataView==="activeDurationMs" && "bg-charts-green border-charts-green"}`}
                        onClick={() => setCurrDataView("activeDurationMs")}>Duration</button>
                <button  className={`btn px-4 py-2 border-4 rounded  font-medium border-charts-purple ${currDataView==="distance" && "bg-charts-purple"}`}
                         onClick={() => setCurrDataView("distance")}>Distance</button>
                <button className={`btn px-4 py-2 border-4 rounded font-medium border-charts-red ${currDataView==="pace" && "bg-charts-red"}`}
                        onClick={() => setCurrDataView("pace")}>Pace</button>
            </div>

        </div>
    )
}

export default MultiAxisLineChart
