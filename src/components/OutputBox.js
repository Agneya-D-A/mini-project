import React, { useEffect, useState } from 'react';
import './Boxes.css';
import { formContext } from '../App';

export default function OutputBox(){
    const {resultImage, setResultImage} = React.useContext(formContext);
    const [resultUrl, setResultUrl] = useState(null);

    useEffect(()=>{
        if(resultImage){
            setResultUrl(URL.createObjectURL(resultImage));
        }
    },[resultImage]);

    return (
        <div className="output-box box">
            <h2>Output</h2>
            {resultImage ? 
                <img src={resultUrl} className='output-box' alt='output'/>
                : <h3>Add Image to Ananlyse</h3>
            }
        </div>
    )
}