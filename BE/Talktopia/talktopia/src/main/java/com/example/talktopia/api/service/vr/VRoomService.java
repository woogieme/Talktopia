package com.example.talktopia.api.service.vr;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.talktopia.api.request.vr.VRoomFriendReq;
import com.example.talktopia.api.response.vr.ShowAllVRoomRes;
import com.example.talktopia.api.service.user.UserStatusService;
import com.example.talktopia.common.message.RoomExitStatus;

import com.example.talktopia.api.request.vr.VRoomExitReq;
import com.example.talktopia.api.request.vr.VRoomReq;
import com.example.talktopia.api.response.vr.VRoomRes;
import com.example.talktopia.common.util.MapSession;
import com.example.talktopia.common.util.RandomNumberUtil;
import com.example.talktopia.common.util.RoomRole;
import com.example.talktopia.common.util.VRoomType;
import com.example.talktopia.db.entity.user.User;
import com.example.talktopia.db.entity.vr.Participants;
import com.example.talktopia.db.entity.vr.SaveVRoom;
import com.example.talktopia.db.entity.vr.VRoom;
import com.example.talktopia.db.repository.ParticipantsRepository;
import com.example.talktopia.db.repository.SaveVRoomRepository;
import com.example.talktopia.db.repository.UserRepository;
import com.example.talktopia.db.repository.VRoomRepository;

import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.ConnectionType;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduRole;
import io.openvidu.java.client.Session;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class VRoomService {

	private Map<String, Session> mapSessions = new HashMap<>();

	private Map<String, MapSession> mapSessionToken = new HashMap<>();
	// 세션이름 ,세션 토큰, 유저 이메일
	//private Map<String, Map<String, String>> mapSessionNamesTokensRand = new HashMap<>();
	// 세션이름 <세션 토큰, 유저 이메일>
	//private Map<String, Map<String, String>> mapSessionNamesTokens = new HashMap<>();
	// 유저 이름, <세션이름, 세션토큰>
	//private Map<String, Map<String, String>> mapUserSession = new HashMap<>();


	// openvidu url
	private final VRoomRepository vroomrepsitory;
	private final UserRepository userRepository;
	private final ParticipantsService participantsService;
	private final ParticipantsRepository participantsRepository;

	private final SaveVRoomRepository saveVRoomRepository;
	private final UserStatusService userStatusService;

	// @Value("${openvidu.secret}")
	// private String SECRET;
	//
	// @Value("${openvidu.url}")
	// private String OPENVIDU_URL;

	private OpenVidu openVidu;

	@Autowired
	public VRoomService(VRoomRepository vroomrepsitory, UserRepository userRepository,
		ParticipantsService participantsService, ParticipantsRepository participantsRepository,
		SaveVRoomRepository saveVRoomRepository, UserStatusService userStatusService,
		@Value("${openvidu.url}") String openviduURL, @Value("${openvidu.secret}") String secret) {
		this.vroomrepsitory = vroomrepsitory;
		this.userRepository = userRepository;
		this.participantsService = participantsService;
		this.participantsRepository = participantsRepository;
		this.saveVRoomRepository =saveVRoomRepository;
		this.userStatusService = userStatusService;
		this.openVidu = new OpenVidu(openviduURL, secret);
	}

	public ConnectionProperties createConnectionProperties(String userId) {
		String serverData = "{\"serverData\": \"" + userId + "\"}";
		ConnectionProperties connectionProperties = new ConnectionProperties.Builder()
			.type(ConnectionType.WEBRTC)
			.data(serverData)
			.role(OpenViduRole.PUBLISHER) //역할 입력 - 일단 publisher로 통합시킴
			.build();
		return connectionProperties;
	}

	@Transactional
	public VRoomRes enterCommonRoom(VRoomReq vRoomReq) throws Exception {
		User user = userRepository.findByUserId(vRoomReq.getUserId()).orElseThrow(()->new Exception("유저가앖어"));
		if(participantsRepository.existsByUser_UserNo(user.getUserNo())){
			log.info("user.getNO::::::::::::::::::::::::::"+user.getUserNo());
			log.info("_+_+_+_+_+_+_+_+_+_+_+_+_+::::	"+participantsRepository.existsByUser_UserNo(user.getUserNo()));
			exitRoomUser(vRoomReq);
		}
		ConnectionProperties connectionProperties = createConnectionProperties(vRoomReq.getUserId());
		List<String> roomIds = vroomrepsitory.findAllIds();
		String connRoomId=null;
		int maxCnt = vRoomReq.getVr_max_cnt();
		for(String roomId : roomIds){
			log.info("roomId 나열해"+roomId);
		}
		/************************** 참가할 방이 존재한다면 ****************************/
		if(!roomIds.isEmpty()){

			for(String  roomId : roomIds){
				boolean isNotfoundRoom=false;
				VRoom vRoom = vroomrepsitory.findByVrSession(roomId);
				if(this.mapSessionToken.get(roomId).getMaxCount()!=maxCnt ||
					this.mapSessionToken.get(roomId).getCurCount()>=maxCnt ||
					!vRoom.isVrEnter() || vRoom.getVrType().equals(VRoomType.FRIEND)){
					if(this.mapSessionToken.get(roomId).getMaxCount()!=maxCnt)
					{
						log.info("this.mapSessionToken.get(roomId).getMaxCount(): ======="+this.mapSessionToken.get(roomId).getMaxCount());
					}
					else if(this.mapSessionToken.get(roomId).getCurCount()!=maxCnt){
						log.info("this.mapSessionToken.get(roomId).getMaxCount(): ======="+this.mapSessionToken.get(roomId).getCurCount());
					}
					else{
						log.info("vRoom.isVrEnter(): ======"+vRoom.isVrEnter());
					}
					continue;
				}
				List<Long> checkLangs = this.mapSessionToken.get(roomId).getLang();
				for(Long checkLang : checkLangs){

					log.info("현재 언어 : "+ checkLang+" 나의 언어 : "+user.getLanguage().getLangNo());

				}
				for(Long checkLang : checkLangs){
					if(checkLang==user.getLanguage().getLangNo()){
						isNotfoundRoom=true;
						log.info("isNotFoundRoom"+ checkLang+" "+user.getLanguage().getLangNo());
						break;
					}
				}
				if(isNotfoundRoom){
					continue;
				}
				connRoomId=roomId;
				String token = this.mapSessions.get(connRoomId).createConnection(connectionProperties).getToken();

				this.mapSessionToken.get(connRoomId).setCurCount(this.mapSessionToken.get(connRoomId).getCurCount()+1);
				vRoom.setVrCurrCnt(vRoom.getVrCurrCnt()+1);
				if(this.mapSessionToken.get(connRoomId).getCurCount()==this.mapSessionToken.get(connRoomId).getMaxCount()){
					vRoom.setVrEnter(false);
					vroomrepsitory.save(vRoom);
				}

				List<Long> addLang =this.mapSessionToken.get(connRoomId).getLang();
				addLang.add(user.getLanguage().getLangNo());
				this.mapSessionToken.get(connRoomId).setLang(addLang);

				participantsService.joinRoom(user,vRoom, RoomRole.GUEST);
				VRoomRes vRoomRes = new VRoomRes();
				//참여자의 Role와 id를 알아야함
				List<ShowAllVRoomRes> showAllVRoomRes = findAllRoom(connRoomId);
				vRoomRes.setShowAllVRoomRes(showAllVRoomRes);

				vRoomRes.setToken(token);
				//vRoomRes.setToken(this.mapSessionToken.get(connRoomId).getToken());
				vRoomRes.setVrSession(roomId);
				vRoomRes.setRoomRole(RoomRole.GUEST);

				userStatusService.updateUserStatus(user.getUserId(),"BUSY");
				// Return the response to the client
				// 토큰정보와 상태 정보 리턴
				return vRoomRes;

			}
		}

		/************************** 참가할 방이 존재하지 않는다면 ****************************/

		//ConnectionProperties와 createConnectionProperties는 OpenVidu 라이브러리에서 사용되는 개체와 함수


		try {
			// Create a new OpenVidu Session
			Session session = this.openVidu.createSession();
			// Generate a new Connection with the recently created connectionProperties

			// 커넥션 생성
			String token = session.createConnection(connectionProperties).getToken();
			//JSONObject responseJson = new JSONObject();
			//JSONObject responseJson = new JSONObject();

			String roomId = RandomNumberUtil.getRandomNumber();


			//Session session 설명
			//session은 OpenVidu 서버에 생성된 비디오 세션을 나타내는 객체
			//
			//token 설명
			// String token = session.createConnection(connectionProperties).getToken();
			// session.createConnection(connectionProperties)는 앞서 생성한 session에 사용자를 연결하기 위한 새로운 Connection을 생성
			// 이때, connectionProperties에는 사용자의 연결 세션에 대한 설정이 담긴 ConnectionProperties 개체가 사용
			// 그리고 이렇게 생성된 연결에 대해 getToken() 메서드를 호출하여 해당 연결에 대한 고유한 토큰을 얻을수있음.
			// 이 토큰은 사용자가 실제로 서버와 통신할 때 사용되는 인증 수단으로 활용됨.

			//String sessionName = createRandName(15); //15자리의 랜덤 문자열
			while (mapSessionToken.get(roomId) != null) { // 중복 방지
				roomId = RandomNumberUtil.getRandomNumber();
			}


			MapSession mapSession = new MapSession(roomId,token, new ArrayList<>(),maxCnt,1);
			mapSession.getLang().add(user.getLanguage().getLangNo());
			this.mapSessions.put(roomId,session);
			this.mapSessionToken.put(roomId,mapSession);
			log.info(this.mapSessions.get(roomId).getSessionId());

			VRoom room = VRoom.builder()
				.vrSession(roomId)
				.vrCreateTime(LocalDateTime.now())
				.vrMaxCnt(maxCnt)
				.vrCurrCnt(1)
				.vrEnter(true)
				.vrType(VRoomType.COMMON)
				.build();
			vroomrepsitory.save(room);
			participantsService.joinRoom(user,room, RoomRole.HOST);

			//            this.mapUserSession.put(userEmail, new HashMap<>());
			//            this.mapUserSession.get(userEmail).put(sessionName, token);
			// Prepare the response with the tokeny
			VRoomRes vRoomRes = new VRoomRes();
			//참여자의 Role와 id를 알아야함
			List<ShowAllVRoomRes> showAllVRoomRes = findAllRoom(roomId);
			vRoomRes.setShowAllVRoomRes(showAllVRoomRes);
			vRoomRes.setToken(token);
			vRoomRes.setVrSession(roomId);
			vRoomRes.setRoomRole(RoomRole.HOST);
			System.out.println(-2);
			// Return the response to the client
			// 토큰정보와 상태 정보 리턴
			for (Map.Entry<String, Session> entry : mapSessions.entrySet()) {
				String key = entry.getKey();
				Session value = entry.getValue();
				System.out.println("Before mapSessions - Key: " + key + ", Value: " + value);
			}
			log.info("아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ");
			// mapSessionToken 순회
			for (Map.Entry<String, MapSession> entry : mapSessionToken.entrySet()) {
				String key = entry.getKey();
				MapSession value = entry.getValue();
				System.out.println("Before mapSessionToken - Key: " + key + ", Value: " + value);
			}

			///////////////// VROOM 이식 /////////////////////////
			saveVroom(roomId);
			////////////////////////////////////////////////////
			userStatusService.updateUserStatus(user.getUserId(),"BUSY");
			return vRoomRes;

		} catch (Exception e) {
			// If error generate an error message and return it to client
			throw new Exception("file excepition",e);
		}

	}
	@Transactional
	public VRoomRes enterFriendRoom(VRoomReq vRoomReq) throws Exception {
		User user = userRepository.findByUserId(vRoomReq.getUserId()).orElseThrow(()->new Exception("유저가앖어"));
		if(participantsRepository.existsByUser_UserNo(user.getUserNo())){
			exitRoomUser(vRoomReq);
		}

		ConnectionProperties connectionProperties = createConnectionProperties(vRoomReq.getUserId());
		int maxCnt = vRoomReq.getVr_max_cnt();
		try {

			// Create a new OpenVidu Session
			Session session = this.openVidu.createSession();
			// Generate a new Connection with the recently created connectionProperties

			// 커넥션 생성
			String token = session.createConnection(connectionProperties).getToken();
			//JSONObject responseJson = new JSONObject();
			//JSONObject responseJson = new JSONObject();

			String roomId = RandomNumberUtil.getRandomNumber();


			//Session session 설명
			//session은 OpenVidu 서버에 생성된 비디오 세션을 나타내는 객체
			//
			//token 설명
			// String token = session.createConnection(connectionProperties).getToken();
			// session.createConnection(connectionProperties)는 앞서 생성한 session에 사용자를 연결하기 위한 새로운 Connection을 생성
			// 이때, connectionProperties에는 사용자의 연결 세션에 대한 설정이 담긴 ConnectionProperties 개체가 사용
			// 그리고 이렇게 생성된 연결에 대해 getToken() 메서드를 호출하여 해당 연결에 대한 고유한 토큰을 얻을수있음.
			// 이 토큰은 사용자가 실제로 서버와 통신할 때 사용되는 인증 수단으로 활용됨.

			//String sessionName = createRandName(15); //15자리의 랜덤 문자열
			while (mapSessionToken.get(roomId) != null) { // 중복 방지
				roomId = RandomNumberUtil.getRandomNumber();
			}


			MapSession mapSession = new MapSession(roomId,token, new ArrayList<>(),maxCnt,1);
			mapSession.getLang().add(user.getLanguage().getLangNo());
			this.mapSessions.put(roomId,session);
			this.mapSessionToken.put(roomId,mapSession);
			log.info(this.mapSessions.get(roomId).getSessionId());

			VRoom room = VRoom.builder()
				.vrSession(roomId)
				.vrCreateTime(LocalDateTime.now())
				.vrMaxCnt(maxCnt)
				.vrCurrCnt(1)
				.vrEnter(true)
				.vrType(VRoomType.FRIEND)
				.build();
			vroomrepsitory.save(room);
			participantsService.joinRoom(user,room, RoomRole.HOST);

			//            this.mapUserSession.put(userEmail, new HashMap<>());
			//            this.mapUserSession.get(userEmail).put(sessionName, token);
			// Prepare the response with the tokeny
			VRoomRes vRoomRes = new VRoomRes();
			//참여자의 Role와 id를 알아야함
			List<ShowAllVRoomRes> showAllVRoomRes = findAllRoom(roomId);
			vRoomRes.setShowAllVRoomRes(showAllVRoomRes);
			vRoomRes.setToken(token);
			vRoomRes.setVrSession(roomId);
			vRoomRes.setRoomRole(RoomRole.HOST);

			System.out.println(-2);
			// Return the response to the client
			// 토큰정보와 상태 정보 리턴
			userStatusService.updateUserStatus(user.getUserId(),"BUSY");
			saveVroom(roomId);
			return vRoomRes;

		} catch (Exception e) {
			// If error generate an error message and return it to client
			throw new Exception("file excepition",e);
		}

	}

	@Transactional
	public VRoomRes enterJoinRoom(VRoomFriendReq vRoomFriendReq) throws Exception {
		User user = userRepository.findByUserId(vRoomFriendReq.getUserId()).orElseThrow(()->new Exception("유저가앖어"));
		// if(participantsRepository.existsByUser_UserNo(user.getUserNo())){
		// 	exitRoomUser(vRoomFriendReq);
		// }
		ConnectionProperties connectionProperties = createConnectionProperties(vRoomFriendReq.getUserId());


		VRoom vRoom = vroomrepsitory.findByVrSession(vRoomFriendReq.getVrSession());
		String connId = vRoom.getVrSession();
		int maxCnt = vRoom.getVrMaxCnt();

		if(this.mapSessionToken.get(connId).getMaxCount()!=maxCnt ||
			this.mapSessionToken.get(connId).getCurCount()>=maxCnt ||
			!vRoom.isVrEnter() || vRoom.getVrType().equals(VRoomType.COMMON)){
			if(this.mapSessionToken.get(connId).getMaxCount()!=maxCnt)
			{
				log.info("this.mapSessionToken.get(roomId).getMaxCount(): ======="+this.mapSessionToken.get(connId).getMaxCount());
			}
			else if(this.mapSessionToken.get(connId).getCurCount()>=maxCnt){
				log.info("this.mapSessionToken.get(roomId).getCurCount(): ======="+this.mapSessionToken.get(connId).getCurCount());
			}
			else{
				log.info("vRoom.isVrEnter(): ======"+vRoom.isVrEnter());
			}
			throw new Exception("방이 꽉찼어요");
		}
		String token = this.mapSessions.get(connId).createConnection(connectionProperties).getToken();

		this.mapSessionToken.get(connId).setCurCount(this.mapSessionToken.get(connId).getCurCount()+1);
		vRoom.setVrCurrCnt(vRoom.getVrCurrCnt()+1);
		if(this.mapSessionToken.get(connId).getCurCount()==this.mapSessionToken.get(connId).getMaxCount()){
			vRoom.setVrEnter(false);
			vroomrepsitory.save(vRoom);
		}

		List<Long> addLang =this.mapSessionToken.get(connId).getLang();
		addLang.add(user.getLanguage().getLangNo());
		this.mapSessionToken.get(connId).setLang(addLang);

		participantsService.joinRoom(user,vRoom, RoomRole.GUEST);
		VRoomRes vRoomRes = new VRoomRes();
		//참여자의 Role와 id를 알아야함
		List<ShowAllVRoomRes> showAllVRoomRes = findAllRoom(connId);
		vRoomRes.setShowAllVRoomRes(showAllVRoomRes);
		vRoomRes.setToken(token);
		//vRoomRes.setToken(this.mapSessionToken.get(connRoomId).getToken());
		vRoomRes.setVrSession(connId);
		vRoomRes.setRoomRole(RoomRole.GUEST);
		// Return the response to the client
		// 토큰정보와 상태 정보 리턴
		userStatusService.updateUserStatus(user.getUserId(),"BUSY");
		return vRoomRes;
	}


	@Transactional
	public RoomExitStatus exitRoom(VRoomExitReq vRoomExitReq) throws Exception {
		try {
			List<String> vRooms = vroomrepsitory.findAllIds();
			for(String vRoom1 : vRooms){
				log.info("이건 나와야하는거아니냐?? "+vRoom1);
			}

			// mapSessions 순회
			for (Map.Entry<String, Session> entry : mapSessions.entrySet()) {
				String key = entry.getKey();
				Session value = entry.getValue();
				System.out.println("After mapSessions - Key: " + key + ", Value: " + value);
			}
			log.info("아ㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏㅏ");
			// mapSessionToken 순회
			for (Map.Entry<String, MapSession> entry : mapSessionToken.entrySet()) {
				String key = entry.getKey();
				MapSession value = entry.getValue();
				System.out.println("After mapSessionToken - Key: " + key + ", Value: " + value);
			}
			log.info(":::::::::::::::"+vRoomExitReq.getUserId());
			log.info(":::::::::::::::"+vRoomExitReq.getVrSession());
			log.info(":::::::::::::::"+vRoomExitReq.getToken());
			log.info(":::::::::::::::"+vRoomExitReq.getUserId().getClass().getName());
			log.info(":::ddddddd::::"+this.mapSessions.get(vRoomExitReq.getVrSession()).getSessionId());
			Optional<User> userd = userRepository.findByUserId(vRoomExitReq.getUserId());
			User user = userd.get();
			//User user = userRepository.findByUserId(vRoomExitReq.getUserId()).orElseThrow(() -> new Exception("우거가 없음 ㅋㅋ"));
			log.info(this.mapSessions.get(vRoomExitReq.getVrSession()).getSessionId());
			// 여기서 vRoomExitReq에 있는 userId와 방에있는 userId가 같은지 확인해야함

			if (this.mapSessions.get(vRoomExitReq.getVrSession()).getSessionId() != null) {
				VRoom vRoom = vroomrepsitory.findByVrSession(vRoomExitReq.getVrSession());
				participantsRepository.findByUser_UserId(user.getUserId())
					.orElseThrow(() -> new Exception("삭제하려는 ID와 ROOM의 Id가 서로 다릅니다."));
				this.mapSessionToken.get(vRoomExitReq.getVrSession())
					.setCurCount(this.mapSessionToken.get(vRoomExitReq.getVrSession()).getCurCount() - 1);
				log.info(String.valueOf(this.mapSessionToken.get(vRoomExitReq.getVrSession()).getCurCount()));
				long userlan = user.getLanguage().getLangNo();

				List<Long> langList = this.mapSessionToken.get(vRoomExitReq.getVrSession()).getLang();
				for (long lang : langList) {
					log.info("LangList입니다 " + lang);
				}
				//long indexToRemove = langList.indexOf(userlan);
				if (userlan >= 0) {
					langList.remove(userlan); // 해당 값을 삭제
					log.info("indexToRemove입니다 " + userlan);
					this.mapSessionToken.get(vRoomExitReq.getVrSession()).setLang(langList);
					List<Long> tmp = this.mapSessionToken.get(vRoomExitReq.getVrSession()).getLang();
					for (long len : tmp) {
						log.info("지금 있는것 " + len);
					}
				}

				//this.mapSessionToken.get(vRoomExitReq.getVrSession()).getLang().remove(userlan);
				if (this.mapSessionToken.get(vRoomExitReq.getVrSession()).getCurCount() < 1) {
					userStatusService.updateUserStatus(user.getUserId(),"ONLINE");
					deleteSaveVroom(vRoomExitReq.getVrSession());
					this.mapSessions.remove(vRoomExitReq.getVrSession());
					this.mapSessionToken.remove(vRoomExitReq.getVrSession());
					participantsRepository.deleteByUser_UserNo(user.getUserNo());
					vroomrepsitory.deleteByVrSession(vRoom.getVrSession());
					return RoomExitStatus.NO_ONE_IN_ROOM;
					//return new Message("방을 나가서 터졌습니다.");
				}
				//VRoom vRoom = vroomrepsitory.findByVrSession(vRoomExitReq.getVrSession());
				vRoom.setVrCurrCnt(vRoom.getVrCurrCnt() - 1);
				if (!vRoom.isVrEnter()) {
					vRoom.setVrEnter(true);
				}
				vroomrepsitory.save(vRoom);

				//Vroom Id 찾는다.
				//user Id 찾는다.
				//OK
				//이를통해서 참여자 DB를 삭제한다.
				participantsRepository.deleteByUser_UserNo(user.getUserNo());
				userStatusService.updateUserStatus(user.getUserId(),"ONLINE");
				return RoomExitStatus.EXIT_SUCCESS;
				//return new Message("방을 나갔습니다.");
			}
			//return new Message("방을 찾을수가없는데요?");
			//new Exception("방을 찾을수가없습니다");
			return RoomExitStatus.ROOM_NOT_FOUND;
		}catch (Exception e) {
			log.error("An error occurred in exitRoom method: " + e.getMessage(), e);
			return RoomExitStatus.ROOM_SEARCH_ERROR; // 적절한 에러 상태를 반환하거나 처리
		}
	}

	@Transactional
	public void exitRoomUser(VRoomReq vRoomReq) throws Exception {
		Participants participants = participantsRepository.findByUser_UserId(vRoomReq.getUserId()).orElseThrow(() ->
			new Exception("participants가 존재하지않는데?"));
		User user = userRepository.findByUserId(vRoomReq.getUserId()).orElseThrow(()->new Exception("유저가 없어"));
		String vrSession =participants.getVRoom().getVrSession();
		VRoom vRoom = vroomrepsitory.findByVrSession(vrSession);
		if(this.mapSessions.get(vRoom.getVrSession()).getSessionId()!=null){
			participantsRepository.findByUser_UserId(vRoomReq.getUserId()).orElseThrow(()-> new Exception("삭제하려는 ID와 ROOM의 Id가 서로 다릅니다."));
			this.mapSessionToken.get(vrSession).setCurCount(this.mapSessionToken.get(vrSession).getCurCount()-1);
			long userlan = user.getLanguage().getLangNo();

			List<Long> langList = this.mapSessionToken.get(vrSession).getLang();
			for(long lang : langList){
				log.info("LangList입니다 "+ lang);
			}
			//long indexToRemove = langList.indexOf(userlan);
			if (userlan >= 0) {
				langList.remove(userlan); // 해당 값을 삭제
				log.info("indexToRemove입니다 "+ userlan);
				this.mapSessionToken.get(vrSession).setLang(langList);
				List<Long> tmp=this.mapSessionToken.get(vrSession).getLang();
				for(long len : tmp){
					log.info("지금 있는것 "+ len);
				}
			}
			if(this.mapSessionToken.get(vrSession).getCurCount()<1){
				userStatusService.updateUserStatus(user.getUserId(),"ONLINE");
				this.mapSessions.remove(vrSession);
				this.mapSessionToken.remove(vrSession);
				participantsRepository.deleteByUser_UserNo(user.getUserNo());
				vroomrepsitory.deleteByVrSession(vRoom.getVrSession());

				return;
			}
			//VRoom vRoom = vroomrepsitory.findByVrSession(vRoomExitReq.getVrSession());
			vRoom.setVrCurrCnt(vRoom.getVrCurrCnt()-1);
			if(!vRoom.isVrEnter()){
				vRoom.setVrEnter(true);
			}
			vroomrepsitory.save(vRoom);

			//Vroom Id 찾는다.
			//user Id 찾는다.
			//OK
			//이를통해서 참여자 DB를 삭제한다.
			participantsRepository.deleteByUser_UserNo(user.getUserNo());
			userStatusService.updateUserStatus(user.getUserId(),"ONLINE");

		}

	}

	private void saveVroom(String roomId) {
		SaveVRoom saveVRoom = SaveVRoom.builder()
			.svrCreateTime(LocalDateTime.now())
			.svrSession(roomId)
			.build();
		saveVRoomRepository.save(saveVRoom);
	}

	private void deleteSaveVroom(String vrSession) {
		SaveVRoom saveVRoom = saveVRoomRepository.findBySvrSession(vrSession);
		saveVRoom.setSvrCloseTime(LocalDateTime.now());
		saveVRoomRepository.save(saveVRoom);
	}


	private List<ShowAllVRoomRes> findAllRoom(String connRoomId) {
		List<Participants> participants = participantsRepository.findByVRoom_VrSession(connRoomId);
		List<ShowAllVRoomRes> showAllVRoomRes = new ArrayList<>();
		for(Participants part : participants) {
			User user = userRepository.findByUserNo(part.getUser().getUserNo());
			ShowAllVRoomRes show = ShowAllVRoomRes.builder()
				.vRoomRole(part.getRoomRole())
				.userId(user.getUserId())
				.build();
			log.info("제발요~~~~~~~~~~~~~~~~~~~~~~~~"+part.getRoomRole());
			log.info("제발요~~~~~~~~~~~~~~~~~~~~~~~~"+user.getUserId());
			showAllVRoomRes.add(show);
		}
		return showAllVRoomRes;
	}

}