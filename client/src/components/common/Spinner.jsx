import React from 'react'

const Spinner = () => {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-green-800 to-teal-400 p-[3px] animate-spin">
      <div className="w-full h-full rounded-full bg-white"></div>
    </div>
  )
}

export default Spinner