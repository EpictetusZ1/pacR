"use client"
import styles from "./Mapbox.module.css"
import "mapbox-gl/dist/mapbox-gl.css"
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import { useEffect, useRef } from "react"

type Coords = {
    lt: number
    lg: number
    time: string
}
interface IMapProps {
    coords: Coords[]
    miles: {mile: string, time: number}[]
}

const Mapbox = ({coords, miles}: IMapProps) => {
    const mapContainer = useRef<any>(null)
    const mapRef = useRef<any>(null)
    const geoJson = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'LineString',
            coordinates: coords.map((coord: {lt: number, lg: number, time: string}) => [coord.lg, coord.lt, coord.time])
        }
    };

    useEffect(() => {
        const runMidPoint = (coords: Coords[]) => {
            const lat = coords.map((coord: Coords) => coord.lt)
            const lng = coords.map((coord: Coords) => coord.lg)
            return {
                lat: lat.reduce((a, b) => a + b, 0) / lat.length,
                lng: lng.reduce((a, b) => a + b, 0) / lng.length
            }
        }
        const initMapboxGl = async () => {
            const mapboxgl = (await import("mapbox-gl")).default
            if (!mapboxgl) return
            if (mapRef.current !== null) return
            mapContainer.current.style.width = "750px"
            mapContainer.current.style.height = "500px"

            let midPoint = runMidPoint(coords)
            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN!
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current, // container ID
                zoom: 14,
                style: "mapbox://styles/lifestorymaps/cloymiqza00rt01qj48dncimz",
                // bounds: [
                //     [mapElement.bBox.sw.lng, mapElement.bBox.sw.lat],
                //     [mapElement.bBox.ne.lng, mapElement.bBox.ne.lat],
                // ],
                center: [midPoint.lng, midPoint.lat],
                preserveDrawingBuffer: true,
            })

            const mileCoords = miles.map((mile) => {
                return coords.reduce((prev, curr) => {
                    // @ts-ignore
                    return Math.abs(curr.time - mile.time) < Math.abs(prev.time - mile.time) ? curr : prev
                })
            })

            const addMarkers = (mileCoords: Coords[]) => {
                mileCoords.forEach((mile, index) => {
                    const el = document.createElement('div')
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
                    paint: {
                        'line-width': 5,
                        'line-gradient': [
                            'interpolate',
                            ['linear'],
                            ['line-progress'],
                            0, "#72F67F",
                            1, "#7F72F6"
                        ]
                    }
                })
            })

            // Controls
            const nav = new mapboxgl.NavigationControl()
            mapRef.current.addControl(nav, "top-left")
        }

        initMapboxGl().then(() => { // Silent handle
            console.log("Mapbox GL loaded")
        })

        return () => {
            if (mapRef.current !== null) {
                mapRef.current.remove()
            }
        }
    }, [])


    const formatBounds = (bounds: any) => ({
        sw: { lng: bounds._sw.lng, lat: bounds._sw.lat },
        ne: { lng: bounds._ne.lng, lat: bounds._ne.lat }
    })

    return (
        <div className={"w-2/3"}>
            <div className={"mapOverlayContainer"}>
                <div className={"mapContainer  shadow-lg rounded-lg"} ref={mapContainer} />
            </div>
        </div>
    );
};

export default Mapbox;

// const setMapToScreenSize = () => {
//     const internalMapElementHeight = mapElement.height
//     const internalMapElementWidth = mapElement.width
//
//     const getMaxAllowedWidth = () => {
//         return window.innerWidth < 500 ? window.innerWidth : window.innerWidth * 0.9
//     }
//
//     const maxAllowedHeight = (window.innerHeight * 0.85) << 0
//     const maxAllowedWidth = 500
//
//     // Calculate scale factors for both width and height
//     const widthScaleFactor = maxAllowedWidth / internalMapElementWidth
//     const heightScaleFactor = maxAllowedHeight / internalMapElementHeight
//
//     // Use the smaller scale factor to ensure the map fits within both constraints
//     const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor)
//     return {
//         width: (internalMapElementWidth * scaleFactor) << 0,
//         height: (internalMapElementHeight * scaleFactor) << 0,
//     }
// }

// Fit this to work here later for window resizing
// const handleSetMapSize = () => {
//     const newSize = setMapToScreenSize()
//     if (mapContainer.current) {
//
//     }
//     if (mapRef.current) {
//         mapRef.current.resize()
//     }
// }
//
// useEffect(() => {
//     handleSetMapSize()
//     const handleResize = () => {
//         if (window) {
//             handleSetMapSize()
//         }
//     }
//     window.addEventListener('resize', handleResize)
//     return () => {
//         window.removeEventListener('resize', handleResize)
//     }
// }, [])
