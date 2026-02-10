"use client"

import React from "react"
import "@google/model-viewer"

const ModelViewer = (props: any) => {
  return React.createElement("model-viewer", props)
}

export default function PatientAvatar3D() {
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
