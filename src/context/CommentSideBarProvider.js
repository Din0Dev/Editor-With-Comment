import React from 'react'

const CommentSidebarContext = React.createContext()
export default CommentSidebarContext

export const CommentSideBarProvider = ({ children }) => {
  const [isOpenSideBar, setIsOpenSideBar] = React.useState(true)

  return (
    <CommentSidebarContext.Provider value={[isOpenSideBar, setIsOpenSideBar]}>
      {children}
    </CommentSidebarContext.Provider>
  )
}