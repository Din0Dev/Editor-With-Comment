import React from 'react'

const SelectionForLinkContext = React.createContext()
export default SelectionForLinkContext

export const SelectionForLinkProvider = ({ children }) => {
  const [selectionForLink, setSelectionForLink] = React.useState(null);

  return (
    <SelectionForLinkContext.Provider value={[selectionForLink, setSelectionForLink]}>
      {children}
    </SelectionForLinkContext.Provider>
  )
}