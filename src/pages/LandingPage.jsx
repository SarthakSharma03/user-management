import Navbar from "../components/LandingPage/Navbar"
import Body from "../components/LandingPage/Body"
import Footer from "../components/LandingPage/Footer"

const LandingPage = ({ onNavigateToSignIn, onNavigateToUserLogin }) => {
  return (
    <div>
      <Navbar onNavigateToSignIn={onNavigateToSignIn} onNavigateToUserLogin={onNavigateToUserLogin} />
      <Body onNavigateToSignIn={onNavigateToSignIn} onNavigateToUserLogin={onNavigateToUserLogin} />
      <Footer />
    </div>
  )
}

export default LandingPage
