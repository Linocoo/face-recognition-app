import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return (
        <div >
                <p className='f3'>
                    {'Face Detector'}
                </p>
            <div className='center'>
                <div className='form center pa4 br6 shadow-2'>
                    <input className='fa4 pa2 w-70 center' type='text' placeholder='paste url here to search...'
                     onChange={onInputChange} />
                    <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-blue' 
                    onClick={onButtonSubmit}>Detect</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;