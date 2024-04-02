"use client"
import { useEffect, useRef, useState } from 'react';
import * as d3 from "d3";
import { SimpleRun } from "@/types/Main.types";

function formatMillisecondsToTime(milliseconds: number) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds = seconds % 60; // remainder is seconds
    minutes = minutes % 60; // remainder is minutes

    // Formatting to HH:MM:SS, removing leading zeros
    return [hours, minutes, seconds]
        .map(val => val < 10 ? `0${val}` : val.toString())
        .join(':')
        .replace(/^00:/, ''); // Remove leading "00:" if any
}

const MultiAxisLineChart = ({ data }: { data: SimpleRun[] }) => {
    const chartRef = useRef(null)
    let chartData = data.slice(0, 10)
    let chartDataOne: number[] = chartData.map((d) => {
        return Number(d.activeDurationMs)
    })
    console.log(chartDataOne)

    useEffect(() => {
        if (chartRef.current) {
            const svg = d3.select(chartRef.current)
            svg.selectAll("*").remove()

            const margin = { top: 20, right: 50, bottom: 30, left: 80 },
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom

            const chart = svg.append('g')
                .attr("transform", `translate(${margin.left},${margin.top})`);

            svg.attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .style("background", "#ea9f6c")
                .style("overflow", "visible");

            const xScale = d3.scaleLinear()
                .domain([0, chartDataOne.length - 1])
                .range([0, width]);

            const maxDataValue = d3.max(chartDataOne);
            const yScale = d3.scaleLinear()
                .domain([0, maxDataValue!])
                .range([height, 0]);

            const generateScaledLine = d3.line<number>()
                .x((_, i) => xScale(i))
                .y((d: number) => yScale(d))


            const xAxis = d3.axisBottom(xScale).ticks(chartDataOne.length);
            const yAxis = d3.axisLeft(yScale);

            chart.append("g")
                .call(xAxis)
                .attr("transform", `translate(0,${height})`);

            chart.append("g")
                .call(yAxis);

            chart.append("path")
                .datum(chartDataOne)
                .attr("fill", "none")
                .attr("stroke", "black")
                .attr("d", generateScaledLine)


            // const xAxis = d3
            //     .axisBottom(xScale)
            //     .ticks(1 + chartDataOne.length)
            //     .tickFormat((i) => i, 1);
            // const yAxis = d3.axisLeft(yScale).ticks(7);
            // // drawing the axes on the svg
            // svg.append("g").call(xAxis).attr("transform", `translate(0,${height})`);
            // svg.append("g").call(yAxis);
            //
            // svg
            //     .selectAll(".line")
            //     .data(chartDataOne)
            //     .join("path")
            //     .attr("d", (d) => generateScaledLine(d))
            //     .attr("fill", "black")
            //     .attr("stroke", "black");

            // const xScale = d3.scaleLinear()
            //     .domain([0, data.length - 1])
            //     .range([0, width]);
            //

            //
            // svg.attr("width", width + margin.left + margin.right)
            //     .attr("height", height + margin.top + margin.bottom)
            //     .append("g")
            //     .attr("transform", `translate(${margin.left},${margin.top})`)
            //
            // // @ts-ignore
            // const xAxis = d3.axisBottom(xScale).tickFormat((_, i) => i + 1)
            // const yAxis = {
            //     // activeDurationMs: d3.axisLeft(yScales.activeDurationMs),
            //     distance: d3.axisRight(yScales.distance).tickFormat(d => `${d} km`),
            //     pace: d3.axisRight(yScales.pace).tickFormat(d => `${d} min/km`)
            // }
            //
            // svg.append("g")
            //     .attr("transform", `translate(0,${height})`)
            //     // @ts-ignore
            //     .call(xAxis)
            //
            // // svg.append("g")
            // //     .call(yAxis.activeDurationMs)
            //
            // svg.append("g")
            //     .attr("transform", `translate(${width}, 0)`)
            //     .call(yAxis.distance)
            //
            // svg.append("g")
            //     .attr("transform", `translate(${width + 60}, 0)`)
            //     .call(yAxis.pace)

            // const lineGenerators = {
            //     // activeDurationMs: d3.line<SimpleRun>()
            //     //     .x((_, i) => xScale(i))
            //     //     .y(d => yScales.activeDurationMs(Number(d.activeDurationMs))),
            //     distance: d3.line<SimpleRun>()
            //         .x((_, i) => xScale(i))
            //         .y(d => yScales.distance(d.distance)),
            //     pace: d3.line<SimpleRun>()
            //         .x((_, i) => xScale(i))
            //         // @ts-ignore
            //         .y(d => yScales.pace(d.pace))
            // }

            // activeDurationMs: "red",
            // const colors = {  distance: "green", pace: "blue" }

            // change this to be individual lines
            // Object.keys(lineGenerators).forEach(metric => {
            //     svg.append("path")
            //         .datum(data)
            //         .attr("fill", "none")
            //         .attr("stroke", colors[metric])
            //         .attr("stroke-width", 2)
            //         .attr("d", lineGenerators[metric])
            // })
            // const line = d3.line();
            // const line2 = d3.line();
            // const line3 = d3.line();
            //
            // svg.append("path")
            //     .datum(data)
            //     .attr("fill", "none")
            //     .attr("stroke", "red")
            //     .attr("stroke-width", 1.5)
            //     .attr("d", line.x((d, i) => xScale(i)).y(d => yScales.activeDurationMs(Number(d.activeDurationMs))));
            // svg.append("path")
            //     .datum(data)
            //     .attr("fill", "none")
            //     .attr("stroke", "green")
            //     .attr("stroke-width", 1.5)
            //     .attr("d", line2.x((d, i) => xScale(i)).y(d => yScales.distance(d.distance)));
            // svg.append("path")
            //     .datum(data)
            //     .attr("fill", "none")
            //     .attr("stroke", "blue")
            //     .attr("stroke-width", 1.5)
            //     .attr("d", line3.x((d, i) => xScale(i)).y(d => yScales.pace(Number(d.pace))));




            // Add an invisible layer for the interactive tip.
            // const dot = svg.append("g")
            //     .attr("display", "none");
            //
            // dot.append("circle")
            //     .attr("r", 2.5);
            //
            // dot.append("text")
            //     .attr("text-anchor", "middle")
            //     .attr("y", -8);
            // svg
            //     .on("pointerenter", pointerentered)
            //     .on("pointermove", pointermoved)
            //     .on("pointerleave", pointerleft)
            //     .on("touchstart", event => event.preventDefault());
            //
            // function pointermoved(event) {
            //     const [xm, ym] = d3.pointer(event);
            //     const i = d3.leastIndex(points, ([x, y]) => Math.hypot(x - xm, y - ym));
            //     const [x, y, k] = points[i];
            //     path.style("stroke", ({z}) => z === k ? null : "#ddd").filter(({z}) => z === k).raise();
            //     dot.attr("transform", `translate(${x},${y})`);
            //     dot.select("text").text(k);
            //     svg.property("value", unemployment[i]).dispatch("input", {bubbles: true});
            // }
            //
            // function pointerentered() {
            //     path.style("mix-blend-mode", null).style("stroke", "#ddd");
            //     dot.attr("display", null);
            // }
            //
            // function pointerleft() {
            //     path.style("mix-blend-mode", "multiply").style("stroke", null);
            //     dot.attr("display", "none");
            //     svg.node().value = null;
            //     svg.dispatch("input", {bubbles: true});
            // }
        }
    }, [chartDataOne])

    return <svg ref={chartRef}></svg>
};

export default MultiAxisLineChart
// create a legend
// const legend = svg.append("g")
//     .attr("transform", `translate(${width + 20}, 20)`)
//     .attr("font-family", "sans-serif")
//     .attr("font-size", 10)
//     .selectAll("g")
//     .data(Object.keys(colors))
//     .join("g")
//     .attr("transform", (_, i) => `translate(0,${i * 20})`);
// legend.append("rect")
//     .attr("x", -19)
//     .attr("width", 19)
//     .attr("height", 19)
//     .attr("fill", d => colors[d]);
// legend.append("text")
//     .attr("x", -24)
//     .attr("y", 9.5)
//     .attr("dy", "0.35em")
//     .text(d => d);