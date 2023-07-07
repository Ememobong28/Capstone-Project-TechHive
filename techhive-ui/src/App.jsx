import './App.css'
import Navbar from './components/Navbar/Navbar.jsx';
import WelcomeSection from './components/WelcomeSection/WelcomeSection.jsx';
import WhatWeOffer from './components/WhatWeOffer/WhatWeOffer.jsx'

function App() {
  return (
    <div>
      <Navbar />
      <WelcomeSection />
      <WhatWeOffer />
      {/* Other content of your app */}
    </div>
  );
}

export default App;
