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
                <>
                    <img src={resultUrl} className='output-image' alt='output'/>
                    <a className='analyse-button' style={{paddingLeft: '2px', display: 'flex',marginTop: '20px', textDecoration: 'none', alignItems: 'center' }} href={resultUrl} download="resultImage.png">Download</a>
                </>
                : <h3>Add Image to Ananlyse</h3>
            }
        </div>
    )
}