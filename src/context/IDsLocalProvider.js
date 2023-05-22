import React from 'react'

const IDsLocalContext = React.createContext()
export default IDsLocalContext

export const IDsLocalProvider = ({ children }) => {
  const [allIds, setAllIds] = React.useState([])

  return (
    <IDsLocalContext.Provider value={[allIds, setAllIds]}>
      {children}
    </IDsLocalContext.Provider>
  )
}