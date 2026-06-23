// 신랑, 신부 및 예식 정보 설정 파일
// 이 파일의 데이터를 수정하여 청첩장 내용을 간편하게 변경할 수 있습니다.

const WEDDING_DATA = {
  // 예식 일시 정보
  date: {
    year: "2026",
    month: "10",
    day: "25",
    weekday: "일요일",
    time: "낮 12시",
    // 디데이 계산용 날짜 형식 (YYYY-MM-DDTHH:mm:ss)
    targetDateTime: "2026-10-25T12:00:00"
  },

  // 신랑 및 혼주 정보
  groom: {
    name: "임영재",
    phone: "010-9876-5432", // 신랑 연락처
    relationship: "장남", // 양가 관계 (예: 장남, 차남 등)
    father: {
      name: "임꺽정",
      phone: "010-5555-6666",
      isPassedAway: false // 고인인 경우 true
    },
    mother: {
      name: "이유리",
      phone: "010-7777-8888",
      isPassedAway: false
    },
    // 축의금 계좌번호
    accounts: [
      { holder: "임꺽정 (아버님)", bank: "농협은행", number: "356-9876-5432-10" },
      { holder: "임영재 (신랑)", bank: "카카오뱅크", number: "3333-01-2345678" }
    ]
  },

  // 신부 및 혼주 정보
  bride: {
    name: "송혜원",
    phone: "010-1234-5678", // 신부 연락처
    relationship: "장녀", // 양가 관계 (예: 장녀, 차녀 등)
    father: {
      name: "송길동",
      phone: "010-1111-2222",
      isPassedAway: false
    },
    mother: {
      name: "김영희",
      phone: "010-3333-4444",
      isPassedAway: false
    },
    // 축의금 계좌번호
    accounts: [
      { holder: "송길동 (아버님)", bank: "국민은행", number: "123-456-789012" },
      { holder: "김영희 (어머님)", bank: "농협은행", number: "356-1234-5678-90" },
      { holder: "송혜원 (신부)", bank: "신한은행", number: "110-123-456789" }
    ]
  },

  // 초대 문구 및 매거진 헤드라인
  greetings: {
    magazineTitle: "WEDDING BELLS",
    magazineVolume: "VOL. 2026 ISSUE 1025",
    coverHeadline: "임영재 & 송혜원의 위대한 동맹!",
    coverCaption: "THE WEDDING HEROES - 2026.10.25",
    cardHeadline: "LOVE IS AN ADVENTURE!",
    message: `서로 다른 두 사람이 만나\n하나의 길을 걸어가고자 합니다.\n저희의 새로운 출발을 축하해 주세요!`
  },

  // 예식장 위치 및 교통 안내
  location: {
    name: "라벤더 웨딩홀",
    hall: "그랜드 볼룸홀",
    address: "서울특별시 강남구 테헤란로 123",
    phone: "02-1234-5678",

    // 지도 바로가기 링크용 파라미터
    lat: 37.498095,
    lng: 127.027610,
    naverMapUrl: "https://map.naver.com/p/entry/place/12345678",
    kakaoMapUrl: "https://place.map.kakao.com/12345678",
    tmapUrl: "https://tmap.life/sample_weddinghall",

    // 교통 안내
    subway: "2호선 강남역 3번 출구 도보 5분 거리입니다.",
    bus: "강남역 정류장 하차 후 도보 3분 (간선 146, 360, 740번 / 지선 3412, 4412번)",
    parking: "건물 내 지하주차장 이용 가능 (하객 3시간 무료 주차 제공)",
    shuttle: "강남역 3번 출구 앞에서 20분 간격 셔틀버스 운행 (예식 시작 1시간 전부터 종료 후 1시간까지)"
  }
};
