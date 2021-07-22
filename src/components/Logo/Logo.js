import React from 'react';
import Tilt from 'react-tilt';
import Face from './Face.png';
import './Logo.css';

const Logo = () => {
return(
    <div id='face' className='ma4 mt0'>
        <Tilt className="Tilt br2 shadow-2" options={{ max: 90 }} style={{ height: 100, width: 100 }} >
            <div className="Tilt-inner pa2">
                <img style={{paddingTop:'5px'}} alt='face' src={Face}/>
            </div>
        </Tilt>
    </div>
);
}

export default Logo;