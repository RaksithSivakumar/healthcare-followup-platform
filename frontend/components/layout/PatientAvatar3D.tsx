"use client"

import React, { useEffect } from "react"

const ModelViewer = (props: any) => {
  return React.createElement("model-viewer", props)
}

export default function PatientAvatar3D() {
  // Load the web component only in the browser to avoid SSR errors
  useEffect(() => {
    // Dynamic import ensures this runs only on the client
    import("@google/model-viewer").catch((err) => {
      console.error("Failed to load @google/model-viewer", err)
    })
  }, [])

  return (
    <ModelViewer
      src="/models/patient-avatar.glb"
      alt="Doctor 3D Avatar"
      auto-rotate
      camera-controls
      disable-zoom
      environment-image="neutral"
      exposure="1"
      style={{
        width: "100%",
        height: "180px",
      }}
    />
  )
}
