import Navbar from "../components/LandingPage/Navbar"
import Body from "../components/LandingPage/Body"
import Footer from "../components/LandingPage/Footer"

const LandingPage = ({ onNavigateToSignIn, onNavigateToUserLogin, onNavigateToAddUser }) => {
  return (
    <div>
      <Navbar onNavigateToSignIn={onNavigateToSignIn} onNavigateToUserLogin={onNavigateToUserLogin} onNavigateToAddUser={onNavigateToAddUser} />
      <Body onNavigateToSignIn={onNavigateToSignIn} onNavigateToUserLogin={onNavigateToUserLogin} />
      <Footer />
    </div>
  )
}

export default LandingPage
