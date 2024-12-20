import logo from './logo.svg';
import './App.css';
import InputBox from './components/InputBox';
import OutputBox from './components/OutputBox';
import { createContext, useState } from 'react';

const backendUrl = `http://127.0.0.1:${3001}`;
const formContext = createContext();

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  return (
    <formContext.Provider value={{imageFile, setImageFile, imageUrl, setImageUrl, resultImage, setResultImage}}>
    <div className="App">
      <header className="App-header">
        <InputBox/>
        <OutputBox/>
      </header>
    </div>
    </formContext.Provider>
  );
}

export default App;

export {formContext};