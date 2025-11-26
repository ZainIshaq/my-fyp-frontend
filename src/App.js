import './App.css';
import LoginPage from './Screens/Login';
import SignupPage from './Screens/Signup';
import Dashboard from './Screens/Dashboard';
import AdminPanel from './Screens/Admin'
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  return (
   <>
   <BrowserRouter>
   <div className="App">
 <Routes>
  <Route path="/" element={<LoginPage />}/>
  <Route path="/Signup" element={<SignupPage />}/>
  <Route path="/Dashboard" element={<Dashboard />}/>
  <Route path="/AdminPanel" element={<AdminPanel />}/>
 </Routes>

  


 </div>
 </BrowserRouter>
   </>
  );
}

export default App;
