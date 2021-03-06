import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Register from './components/Register/Register';
import SignIn from './components/SignIn/SignIn';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';
// import { Notifier } from '@airbrake/browser';

// const airbrake = new Notifier({
//   projectId: 348001,
//   projectKey: '06e1235147e861a2ee7d5ab21cc2827e',
//   environment: 'production'
// });


const app = new Clarifai.App({
  apiKey: 'f03d0055056a4c4bb119dc04cf210a58'
});

const particlesOptions = {
  particles:{
    number:{
      value: 200,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component{
  constructor() {
      super ();
      this.state = {
        input: '',
        imageUrl: '',
        box: {},
        route: 'signin',
        isSignedIn: false,
        user: {
          id: '',
          name: '',
          email: '',
          entries: 0,
          joined: ''
        }
      }
    }

    loadUser = (data) => {
      this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
        }
      })
    }
    calculateFaceLocation = (data) => {
      const clarifaiFace = data.output[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = Number(image.width);
      const height = Number(image.height);
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    }

    displayFaceBox = (box) => {
      console.log(box);
      this.setState({box: box});
    }

    onInputChange = (event) => {
      this.setState({input: event.target.value});
    }
    onButtonSubmit = () => {
      this.setState({imageUrl: this.state.input});
      app.models
       .predict(
        Clarifai.FACE_DETECT_MODEL, 
        this.state.input)
        .then(response => {
        if(response) {
          fetch('http://localhost:5000/image', {
          method:'put',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
      }
          this.displayFaceBox (this.calculateFaceLocation(response))
        })
        .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn:false})
    } else if (route === 'home') {
      this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render() {
    const  { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className='App'>
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === '/home'
          ? <div>
                <Logo />
                <Rank />
                <ImageLinkForm
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
                  route === 'signin' 
              ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            )
        }
      </div>
     );
  }
}

export default App;
