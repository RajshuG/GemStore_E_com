import { useState } from 'react'
import './App.css'
import { Header, Footer } from './Components/index'
import { Outlet } from 'react-router-dom'
import CustomSidebar from './Components/CustomSidebar/CustomSidebar'


function App() {
  const[sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () =>{
    // console.log('sidebar toggled')
    setSidebarOpen((prev)=>!prev)
  }

  const closeSideBar = () => {
    console.log('close sidebar')
    setSidebarOpen(false)
  }

  return (
    <>
    <Header toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
    {sidebarOpen && <CustomSidebar closeSideBar={closeSideBar} isOpen={sidebarOpen}/>}
    <div className="app-container">
      <main className="content">
        <Outlet className='.outlet-container'/>
      </main>
    </div>
    <Footer/>
    </>
  );
}

export default App
