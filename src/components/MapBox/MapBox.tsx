"use client"
import "mapbox-gl/dist/mapbox-gl.css"
// import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css"
import { useEffect, useMemo, useRef, useState } from "react"

interface IMapProps {
    mapElement: any
    atlasId: string
    sessionId: string
    closeMap: () => void
}

const Mapbox = () => {
    const MAX_MAP_DIMENSION = 500 // This is the max size the Mapbox static images API will allow
    const mapContainer = useRef<any>(null)
    const mapRef = useRef<any>(null)

    const mapElement = {
        width: 500,
        height: 500,
        bBox: {
            sw: { lng: 0, lat: 0 },
            ne: { lng: 0, lat: 0 },
        },
    }

    const setMapToScreenSize = () => {
        const internalMapElementHeight = mapElement.height
        const internalMapElementWidth = mapElement.width

        const getMaxAllowedWidth = () => {
            return window.innerWidth < 500 ? window.innerWidth : window.innerWidth * 0.9
        }

        const maxAllowedHeight = (window.innerHeight * 0.85) << 0
        const maxAllowedWidth = 500

        // Calculate scale factors for both width and height
        const widthScaleFactor = maxAllowedWidth / internalMapElementWidth
        const heightScaleFactor = maxAllowedHeight / internalMapElementHeight

        // Use the smaller scale factor to ensure the map fits within both constraints
        const scaleFactor = Math.min(widthScaleFactor, heightScaleFactor)
        return {
            width: (internalMapElementWidth * scaleFactor) << 0,
            height: (internalMapElementHeight * scaleFactor) << 0,
        }
    }


    const handleSetMapSize = () => {
        const newSize = setMapToScreenSize()
        if (mapContainer.current) {
            mapContainer.current.style.width = `${newSize.width}px`
            mapContainer.current.style.height = `${newSize.height}px`
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
        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    useEffect(() => {
        const initMapboxGl = async () => {
            const mapboxgl = (await import('mapbox-gl')).default
            if (!mapboxgl) return
            if (mapRef.current !== null) return
            mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_TOKEN!
            mapRef.current = new mapboxgl.Map({
                container: mapContainer.current, // container ID
                // style: `mapbox://styles/lifestorymaps/${dynamicStyleId}`,
                bounds: [
                    [mapElement.bBox.sw.lng, mapElement.bBox.sw.lat],
                    [mapElement.bBox.ne.lng, mapElement.bBox.ne.lat],
                ],
                preserveDrawingBuffer: true,
            })

            // Controls
            const nav = new mapboxgl.NavigationControl()
            mapRef.current.addControl(nav, "top-left")

            // For Search completion
            // const geocoder = new MapboxGeocoder({
            //     accessToken: mapboxgl.accessToken,
            //     mapboxgl: mapboxgl,
            //     minLength: 5,
            //     marker: false,
            // })

            // Geocoder
            // mapRef.current.addControl(geocoder, "top-right")

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
                <div className={"mapContainer"} ref={mapContainer} />
            </div>
        </div>
    );
};

export default Mapbox;