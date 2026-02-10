declare module "*.glb" {
  const src: string
  export default src
}

declare namespace JSX {
  interface IntrinsicElements {
    "model-viewer": any
  }
}

