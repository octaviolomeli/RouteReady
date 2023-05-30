import {Routes, Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/Sign-In';
import SignUp from './pages/Sign-Up';
import Monitor from './pages/Monitor';

function App() {
  return (
    <div>
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/monitor" element={<Monitor />} />
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;