import React from 'react'
import "../Style/Loader.scss"
function Loader() {
  return (
    <div className="flex bg-zinc-950/60 justify-center absolute z-20 items-center w-screen h-screen">
      <div className="lds-grid ">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        
      </div>
    </div>
  );
}

export default Loader