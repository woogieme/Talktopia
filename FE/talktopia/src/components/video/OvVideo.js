import React, { useEffect, useRef } from 'react';
import style from './OvVideo.module.css'

function OpenViduVideoComponent({ streamManager, participantCount }) {
    const videoRef = useRef(null);

    const layoutPlan = {
        1: style.oneVideo,
        2: style.twoVideo,
        3: style.threeVideo,
        4: style.fourVideo,
        5: style.fiveVideo,
        6: style.sixVideo
      };

    useEffect(() => {
        if (streamManager && !!videoRef.current) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager, participantCount])

    return (
        <>
            <video autoPlay={true} ref={videoRef} className={`${layoutPlan[participantCount]}`}/>
        </>
    )
}

export default OpenViduVideoComponent;





// import React, { Component } from 'react';

// export default class OpenViduVideoComponent extends Component {

//     constructor(props) {
//         super(props);
//         this.videoRef = React.createRef();
//     }

//     componentDidUpdate(props) {
//         if (props && !!this.videoRef) {
//             this.props.streamManager.addVideoElement(this.videoRef.current);
//         }
//     }

//     componentDidMount() {
//         if (this.props && !!this.videoRef) {
//             this.props.streamManager.addVideoElement(this.videoRef.current);
//         }
//     }

//     render() {
//         return <video autoPlay={true} ref={this.videoRef} />;
//     }

// }
