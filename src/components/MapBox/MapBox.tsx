"use client"
import styles from "./Mapbox.module.css"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef } from "react"

type Coords = {
    lt: number
    lg: number
    time: number
}
interface IMapProps {
    coords: Coords[]
    miles: {mile: string, time: number}[]
}

const Mapbox = ({coords, miles}: IMapProps) => {
    const mapContainer = useRef<any>(null)
    const mapRef = useRef<any>(null)
    const geoJson = {
        type: "Feature",
        properties: {},
        geometry: {
            type: "LineString",
            coordinates: coords.map((coord: {lt: number, lg: number, time: number}) => [coord.lg, coord.lt, coord.time])
        }
    }

    const runMidPoint = (coords: Coords[]) => {
        const lat = coords.map((coord: Coords) => coord.lt)
        const lng = coords.map((coord: Coords) => coord.lg)
        return {
            lat: lat.reduce((a, b) => a + b, 0) / lat.length,
            lng: lng.reduce((a, b) => a + b, 0) / lng.length
        }
    }

    useEffect(() => {
        const initMapboxGl = async () => {
            const mapboxgl = (await import("mapbox-gl")).default
            if (!mapboxgl) return
            if (mapRef.current !== null) return

            let midPoint = runMidPoint(coords)
            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN!
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current, // container ID
                zoom: 14,
                style: "mapbox://styles/lifestorymaps/cloymiqza00rt01qj48dncimz",
                center: [midPoint.lng, midPoint.lat],
                preserveDrawingBuffer: true,
            })

            const mileCoords = miles.map((mile) => {
                return coords.reduce((prev, curr) => {
                    return Math.abs(curr.time - mile.time) < Math.abs(prev.time - mile.time) ? curr : prev
                })
            })

            const addMarkers = (mileCoords: Coords[]) => {
                mileCoords.forEach((mile, index) => {
                    const el = document.createElement("div")
                    el.className = styles.mapMarker
                    el.textContent = `${index + 1} mi`
                    new mapboxgl.Marker(el)
                        .setLngLat([mile.lg, mile.lt])
                        .addTo(mapRef.current)
                })
            }

            addMarkers(mileCoords)
            mapRef.current.on("load", () => {
                mapRef.current.addSource("route", {
                    type: "geojson",
                    data: geoJson,
                    lineMetrics: true
                })

                mapRef.current.addLayer({
                    id: "route",
                    type: "line",
                    source: "route",
                    layout: {
                        "line-join": "round",
                        "line-cap": "round"
                    },
                    // TODO: Perhaps later, set this up as a heatmap depending on the "view" of the user, so pace, heart rate, or elevation.
                    paint: {
                        "line-width": 5,
                        "line-gradient": [
                            "interpolate",
                            ["linear"],
                            ["line-progress"],
                            0, "#72F67F",
                            1, "#7F72F6"
                        ]
                    }
                })
            })

            // Controls
            // const nav = new mapboxgl.NavigationControl()
            // mapRef.current.addControl(nav, "top-left")
        }

        initMapboxGl().then(() => {}) // Silent handle

        return () => {
            if (mapRef.current !== null) {
                mapRef.current.remove()
            }
        }
    }, [])

    const setMapToScreenSize = () => {
        const maxAllowedHeight = window.innerWidth > 500 ? Math.min(window.innerHeight * 0.85, 375) : window.innerHeight * 0.85
        const maxAllowedWith = window.innerWidth > 500 ? window.innerWidth * 0.60 : window.innerWidth
        return {
            height: maxAllowedHeight << 0,
            width:  Math.min(maxAllowedWith, 750)
        }
    }

    const handleSetMapSize = () => {
        const newSize = setMapToScreenSize();
        if (mapContainer.current) {
            mapContainer.current.style.width = `${newSize.width}px`;
            mapContainer.current.style.height = `${newSize.height}px`;
        }
        if (mapRef.current) {
            mapRef.current.resize()
        }
    }

    useEffect(() => {
        handleSetMapSize()
        const handleResize = () => {
            if (window) {
                handleSetMapSize()
            }
        }
        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])


    return (
        <div className={"max-h-min max-w-min"}>
            <div className={"mapOverlayContainer"}>
                <div className={"mapContainer  shadow-lg rounded-lg"} ref={mapContainer} />
            </div>
        </div>
    )
}

export default Mapbox


