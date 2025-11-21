import { useState } from 'react'
import SignIn from './pages/SignIn'
import UserLogin from './pages/UserLogin'
import Dashboard from './pages/Dashboard'
import UserDetail from './pages/UserDetail'
import LandingPage from './pages/LandingPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  

  const handleSignIn = (user) => {
    setUserInfo(user)
    setIsAuthenticated(true)
    setCurrentPage('dashboard')
  }

  const handleSignOut = () => {
    setUserInfo(null)
    setIsAuthenticated(false)
    setCurrentPage('landing')
  }

  const handleUserLogin = (user) => {
    setCurrentUser(user)
    setIsUserAuthenticated(true)
    setCurrentPage('userdetail')
  }

  const handleUserSignOut = () => {
    setCurrentUser(null)
    setIsUserAuthenticated(false)
    setCurrentPage('landing')
  }

  const navigateToSignIn = () => {
    setCurrentPage('signin')
  }

  const navigateToUserLogin = () => {
    setCurrentPage('userlogin')
  }

  const navigateToLanding = () => {
    setCurrentPage('landing')
  }

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <LandingPage 
          onNavigateToSignIn={navigateToSignIn} 
          onNavigateToUserLogin={navigateToUserLogin}
        />
      )}
      {currentPage === 'signin' && (
        <SignIn onSignIn={handleSignIn} onNavigateToLanding={navigateToLanding} />
      )}
      {currentPage === 'userlogin' && (
        <UserLogin 
          onUserLogin={handleUserLogin} 
          onNavigateToLanding={navigateToLanding}
          onNavigateToAdmin={navigateToSignIn}
        />
      )}
      {currentPage === 'dashboard' && isAuthenticated && (
        <Dashboard userInfo={userInfo} onSignOut={handleSignOut} />
      )}
      {currentPage === 'userdetail' && isUserAuthenticated && (
        <UserDetail user={currentUser} onSignOut={handleUserSignOut} />
      )}
    </div>
  )
}

export default App
