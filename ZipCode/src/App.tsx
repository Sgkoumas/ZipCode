import './App.css'
import ZipCodeInput from './components/ZipCodeInput'
import logo from './assets/US_icon.png'

function App() {

  return (
    <>

      <div>
      <span className='input-label'> Zip Codes <img src={logo} alt="Logo" className="header-logo" /> </span>
       <ZipCodeInput /> 
      </div>
     
    </>
  )
}

export default App
