import React, {useState, useContext} from 'react';
import './Boxes.css';
import { formContext } from '../App';
import axios from 'axios';

const conversionServerUrl = `http://127.0.0.1:3001`;


export default function InputBox(){

    const {imageFile, setImageFile, imageUrl, setImageUrl, setResultImage} = useContext(formContext)
    async function handleFileChange(e){
        const file = e.target.files[0];
        if(!file) return;
        const formData = new FormData();
        formData.append('image',file);
        try{
            const response = await axios.post(`${conversionServerUrl}/input_tif`,formData,{responseType: 'blob'});
            const url = URL.createObjectURL(response.data);
            setImageFile(response.data);
            setImageUrl(url);
        }
        catch(err){
            console.log(err);
        }
    }

    function getSegmentedImage(e){
        e.preventDefault();
        const formData = new FormData();
        formData.append('image',imageFile);

        const fetchMask = async ()=>{
            const flaskResponse = await axios.post('http://127.0.0.1:3001/fetch-mask',formData, {
                headers: formData.getHeaders()
            });

            setResultImage(flaskResponse.data);
        }

        fetchMask();
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