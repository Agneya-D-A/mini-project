import React, {useState, useContext} from 'react';
import './Boxes.css';
import { formContext } from '../App';

export default function InputBox(){

    const {imageFile, setImageFile, imageUrl, setImageUrl} = useContext(formContext)
    function handleFileChange(e){
        const file = e.target.files[0];
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));
    }

    function getSegmentedImage(e){
        e.preventDefault();
    }

    return (
        <div className="input-box box"> 
            <h2>Input</h2>
            <form className='input-form' onSubmit={getSegmentedImage}>
                <input type='file' onChange={handleFileChange}/>
                {
                    imageFile && <img src={imageUrl} className='input-image' alt='file aint loading'/>
                }
                <button className='analyse-button'>Analyse</button>
            </form>
        </div>
    )
}