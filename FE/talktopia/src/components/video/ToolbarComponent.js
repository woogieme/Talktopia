import { FiCamera } from "react-icons/fi";          // video on
import { FiCameraOff } from "react-icons/fi";       // Video off
import { BsMic } from "react-icons/bs";             // Mic on
import { BsMicMute } from "react-icons/bs";         // Mic off
import { ImExit } from "react-icons/im";            // Leave
import { FaUserFriends } from "react-icons/fa";     // invite friend
// import { FiHash } from "react-icons/fi";            // 주제 제시
import { MdOutlineChangeCircle } from "react-icons/md"; // 주제 바꾸기
import { BiExit } from "react-icons/bi";                // 주제 제시 종료
import { HiOutlineLightBulb } from "react-icons/hi";    // 주제 제시

import { useTranslation } from "react-i18next";
import style from "./ToolbarComponent.module.css"


function ToolbarComponent(props) {
    const { t } = useTranslation();
    const handleTopicbutton = (e) => {
        e.preventDefault();
        if (props.roomRole === 'HOST') {
            props.openTopicbar();
        } 
    }

    return (
        <>
            <div className={style['video-call-actions']}>
                {props.isTopicbar ? (
                    <>
                        <button className={`${style['video-game-button']} ${style['video-game-button-HOST']}`} onClick={props.openTopic} >
                            <MdOutlineChangeCircle size="24" color="black" />
                            <p className={style['topic-button']}>{t(`ToolbarComponent.ToolbarComponent1`)}</p>
                        </button>  
                        <button className={`${style['video-game-button']} ${style['video-game-button-HOST']}`} onClick={props.closeTopicbar} >
                            <BiExit size="24" color="black" />
                            <p className={style['topic-button']}>{t(`ToolbarComponent.ToolbarComponent2`)}</p>
                        </button>  
                    </>
                ) : (
                    <button 
                        className={props.roomRole === 'HOST' ? 
                            `${style['video-game-button']} ${style['video-game-button-HOST']}` : 
                            `${style['video-game-button']} ${style['video-game-button-GUEST']}`
                        } 
                        onClick={handleTopicbutton}
                    >
                        <HiOutlineLightBulb size="24" color={props.roomRole === 'HOST' ? "black" : "grey"} />
                        <p className={style['topic-button']}>{t(`ToolbarComponent.ToolbarComponent3`)}</p>
                    </button>  
                )}
            </div>

            <div className={style['video-call-actions']}>
                {props.audioEnabled ? (
                    <button className={`${style['video-action-button']}`} onClick={props.toggleAudio}>
                        <BsMic size="24" color="black" />
                    </button>
                ) : (
                    <button className={`${style['video-action-button']}`} onClick={props.toggleAudio}>
                        <BsMicMute size="24" color="grey"/>
                    </button>
                ) }

                {props.videoEnabled ? (
                    <button className={style['video-action-button']} onClick={props.toggleVideo}>
                        <FiCamera size="24" color="black" />
                    </button>
                ) : (
                    <button className={style['video-action-button']} onClick={props.toggleVideo}>
                        <FiCameraOff size="24" color="grey"/>
                    </button>
                )}

                {/* 친구 초대 */}
                {props.roomType !== 'common' ? (
                    <button className={style['video-action-button']} onClick={props.inviteFriends}>
                        <FaUserFriends size="24" color="black" />
                    </button>
                ) : null}


                <button className={style['video-action-button']} onClick={props.leaveSession}>
                    <ImExit size="24" color="black" />
                </button>
            </div>
        </>
    )
};

export default ToolbarComponent;