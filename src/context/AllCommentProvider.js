import React from 'react'

const AllCommentContext = React.createContext()
export default AllCommentContext

export const AllCommentProvider = ({ children }) => {
  const [allComments, setAllComments] = React.useState([])

  return (
    <AllCommentContext.Provider value={[allComments, setAllComments]}>
      {children}
    </AllCommentContext.Provider>
  )
}