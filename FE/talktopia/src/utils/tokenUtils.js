function IsTokenValid(){
    //accessToken
    const userInfoString = localStorage.getItem("UserInfo");
    const userInfo = JSON.parse(userInfoString);
    const accessToken = userInfo.accessToken;
    const expiredDate = userInfo.expiredDate;
    // const accessToken = useSelector((state) => {return state.userInfo.accessToken});

    //accessToken dead 시간
    // const expiredDate = useSelector((state) => {return state.userInfo.expiredDate});
    // console.log("accessToken: ", accessToken);
    console.log("server expiredDate: ", expiredDate);

    //현재 시간 UTC
    // const currentTime = new Date();
    // const utcTimeString = currentTime.toISOString();
    // console.log("current time: ", utcTimeString);

    const currentTime = new Date();
    // currentTime.setUTCHours(currentTime.getUTCHours() + 9);
    const utcTimeString = currentTime.toISOString();
    console.log("current time:!!! ", utcTimeString);

    //30초 이하로 남으면 재요청 날릴 것이기 때문에
    //30초를 더한 값을 현재 시간이라고 가정
    const deadDate = new Date(currentTime.getTime() + 5 * 60 * 1000).toISOString();
    console.log("5분 뒤 시간: ", deadDate);

    //accesToken dead 시간, 현재시간(+30초) 비교하기
    const expiredDateTime = new Date(expiredDate);
    expiredDateTime.setUTCHours(expiredDateTime.getUTCHours() - 9);
    const deadDateTime = new Date(deadDate);
    console.log("server 시간: ", expiredDateTime);
    console.log("현재 시간(+5분): ", deadDateTime);

    if(deadDateTime < expiredDateTime){
        console.log("tokenpage - 그냥 갈게용")
        console.log("deadDateTime", deadDateTime);
        console.log("expiredDateTime", expiredDateTime);
        //아직 시간이 남아있다면(유효한 토큰이라면) 1 리턴
        return 1;
    }else if(currentTime >= expiredDateTime){
        console.log("tokenpage - 로그아웃합니당")
        console.log("expiredDateTime", expiredDateTime);
        console.log("currentTime", currentTime);
        //현재 시간 > dead 시간이면 로그아웃 할거임
        return -1;
    }else{
        // 시간이 5분 안쪽으로 남았을 경우
        console.log("tokenpage - 재 발급 갑니다?")
        return 0;
    }
}

export default IsTokenValid;