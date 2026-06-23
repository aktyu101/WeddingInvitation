document.addEventListener("DOMContentLoaded", () => {
  const pwdScreen = document.getElementById("password-screen");
  const appContainer = document.getElementById("app-container");
  const btnUnlock = document.getElementById("btn-unlock");
  const pwdInput = document.getElementById("secret-password");
  const pwdError = document.getElementById("password-error");
  const TARGET_PWD = "010523814290";

  const unlockApp = () => {
    pwdScreen.style.display = "none";
    appContainer.style.display = "flex";

    // 1. WEDDING_DATA 데이터 바인딩 초기화
    initDataBinding();
    // 2. 디데이 카운트다운 타이머 구동
    startCountdown();
    // 3. 백그라운드 오디오 및 재생 제어
    initAudioPlayer();
    // 4. 팝아트 파티클 애니메이션
    initParticleSpawner();
    // 5. 아코디언 토글 제어
    initAccordions();
    // 6. 갤러리 슬라이드쇼 모달 제어
    initGalleryModal();
    // 7. 로컬 스토리지 방명록 구동
    initGuestbook();
    // 8. 스크롤 페이드 효과 연동
    initScrollFade();
    // 9. 선수 응원 하트 기능
    initCheerButtons();
  };

  const attemptUnlock = () => {
    if (pwdInput.value === TARGET_PWD) {
      sessionStorage.setItem("wedding_unlocked", "true");
      unlockApp();
    } else {
      pwdError.style.display = "block";
      pwdInput.value = "";
      pwdInput.focus();
    }
  };

  if (sessionStorage.getItem("wedding_unlocked") === "true") {
    unlockApp();
  } else {
    pwdScreen.style.display = "flex";
    if (btnUnlock && pwdInput) {
      btnUnlock.addEventListener("click", attemptUnlock);
      pwdInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") attemptUnlock();
      });
    }
  }
});

// ==========================================
// 1. 데이터 바인딩 로직
// ==========================================
function initDataBinding() {
  if (typeof WEDDING_DATA === "undefined") {
    console.error("data.js가 로드되지 않았습니다.");
    return;
  }

  const d = WEDDING_DATA;

  // 매거진 헤더 텍스트 설정
  document.querySelectorAll(".magazine-title").forEach(el => el.textContent = d.greetings.magazineTitle);
  document.querySelectorAll(".magazine-volume").forEach(el => el.textContent = d.greetings.magazineVolume);
  document.querySelectorAll(".cover-headline").forEach(el => el.textContent = d.greetings.coverHeadline);
  document.querySelectorAll(".cover-caption").forEach(el => el.textContent = d.greetings.coverCaption);

  // 예식 일시 바인딩
  const fullDateStr = `${d.date.year}년 ${d.date.month}월 ${d.date.day}일 ${d.date.weekday}`;
  document.querySelectorAll(".wedding-date-str").forEach(el => el.textContent = fullDateStr);
  document.querySelectorAll(".wedding-time-str").forEach(el => el.textContent = d.date.time);
  
  const fullLocStr = `${d.location.name} ${d.location.hall}`;
  document.querySelectorAll(".wedding-location-str").forEach(el => el.textContent = fullLocStr);

  // 인사말 카드 바인딩
  document.getElementById("greeting-headline").textContent = d.greetings.cardHeadline;
  document.getElementById("greeting-message").textContent = d.greetings.message;

  // 혼주 관계 바인딩 (사망 여부에 따라 故 표시 처리)
  const getParentsLine = (parentObj, role) => {
    let name = parentObj.name;
    if (parentObj.isPassedAway) {
      name = `<span class="deceased">故</span> ${name}`;
    }
    return name;
  };

  const groomRelationHtml = `
    ${getParentsLine(d.groom.father)} · ${getParentsLine(d.groom.mother)} 의 ${d.groom.relationship} <strong class="text-blue font-comic">${d.groom.name}</strong>
  `;
  const brideRelationHtml = `
    ${getParentsLine(d.bride.father)} · ${getParentsLine(d.bride.mother)} 의 ${d.bride.relationship} <strong class="text-red font-comic">${d.bride.name}</strong>
  `;

  document.getElementById("groom-family-relation").innerHTML = groomRelationHtml;
  document.getElementById("bride-family-relation").innerHTML = brideRelationHtml;

  // 전화하기 링크 매핑
  document.getElementById("groom-call").setAttribute("href", `tel:${d.groom.phone}`);
  document.getElementById("groom-father-call").setAttribute("href", `tel:${d.groom.father.phone}`);
  document.getElementById("bride-call").setAttribute("href", `tel:${d.bride.phone}`);
  document.getElementById("bride-father-call").setAttribute("href", `tel:${d.bride.father.phone}`);

  // 오시는 길 및 교통 정보 바인딩
  document.getElementById("location-name").textContent = d.location.name;
  document.getElementById("location-hall").textContent = d.location.hall;
  document.getElementById("location-address").textContent = d.location.address;
  document.getElementById("location-phone").setAttribute("href", `tel:${d.location.phone.replace(/-/g, '')}`);
  
  document.getElementById("subway-desc").textContent = d.location.subway;
  document.getElementById("bus-desc").textContent = d.location.bus;
  document.getElementById("shuttle-desc").textContent = d.location.shuttle;
  document.getElementById("parking-desc").textContent = d.location.parking;

  // 네비게이션 앱 링크 설정
  document.getElementById("kakao-map-btn").setAttribute("href", d.location.kakaoMapUrl);
  document.getElementById("naver-map-btn").setAttribute("href", d.location.naverMapUrl);
  document.getElementById("tmap-btn").setAttribute("href", d.location.tmapUrl);

  // 축의금 계좌 목록 렌더링 함수
  renderAccounts("groom-accounts-list", d.groom.accounts, "btn-copy bg-blue");
  renderAccounts("bride-accounts-list", d.bride.accounts, "btn-copy bg-red");
}

// 계좌 카드 렌더링 헬퍼
function renderAccounts(containerId, accountsList, btnClass) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // 기존 내용 비우기

  accountsList.forEach(acc => {
    const accCard = document.createElement("div");
    accCard.className = "account-card";
    accCard.innerHTML = `
      <div class="account-details">
        <p class="acc-holder">${acc.holder}</p>
        <p class="acc-bank-no">${acc.bank} <span>${acc.number}</span></p>
      </div>
      <button class="${btnClass}" data-account="${acc.number}">복사</button>
    `;
    container.appendChild(accCard);
  });

  // 복사 버튼 기능 바인딩
  container.querySelectorAll(".btn-copy").forEach(btn => {
    btn.addEventListener("click", () => {
      const numberToCopy = btn.getAttribute("data-account");
      copyToClipboard(numberToCopy);
    });
  });
}

// ==========================================
// 2. 디데이 카운트다운 타이머
// ==========================================
function startCountdown() {
  const targetDateStr = WEDDING_DATA.date.targetDateTime;
  const targetTime = new Date(targetDateStr).getTime();

  const updateTimer = () => {
    const now = new Date().getTime();
    const difference = targetTime - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minsEl = document.getElementById("minutes");
    const secsEl = document.getElementById("seconds");
    const statusEl = document.getElementById("dday-status");

    if (difference <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";
      statusEl.textContent = "임무 완료! 신랑 신부가 하나가 되었습니다! 🎉";
      clearInterval(timerInterval);
      return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    daysEl.textContent = d < 10 ? "0" + d : d;
    hoursEl.textContent = h < 10 ? "0" + h : h;
    minsEl.textContent = m < 10 ? "0" + m : m;
    secsEl.textContent = s < 10 ? "0" + s : s;
    statusEl.textContent = `결혼식 시작까지 D-${d}일!`;
  };

  updateTimer(); // 즉시 호출로 로딩 딜레이 제거
  const timerInterval = setInterval(updateTimer, 1000);
}

// ==========================================
// 3. 오디오 재생 시스템
// ==========================================
function initAudioPlayer() {
  const audio = document.getElementById("bgm");
  const toggleBtn = document.getElementById("bgm-toggle");
  
  // 브라우저 자동 재생 불가 정책 우회 - 사용자가 아무 곳이나 최초 터치/클릭 시 재생 유도
  const handleAutoPlay = () => {
    audio.play().then(() => {
      toggleBtn.classList.add("playing");
      removeListeners();
    }).catch(err => {
      console.log("Auto-play blocked, waiting for user click.");
    });
  };

  const removeListeners = () => {
    document.removeEventListener("click", handleAutoPlay);
    document.removeEventListener("touchstart", handleAutoPlay);
  };

  document.addEventListener("click", handleAutoPlay);
  document.addEventListener("touchstart", handleAutoPlay);

  // 음소거 제어 토글 버튼 이벤트
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // 오토플레이 리스너 중복 발동 방지
    if (audio.paused) {
      audio.play();
      toggleBtn.classList.add("playing");
    } else {
      audio.pause();
      toggleBtn.classList.remove("playing");
    }
  });
}

// ==========================================
// 4. 팝아트 파티클 애니메이션 (별, 하트, 효과음 말풍선)
// ==========================================
function initParticleSpawner() {
  const container = document.getElementById("particle-container");
  
  // 팝아트 스타일 파티클 목록 (텍스트 말풍선 & 특수 문자 에셋)
  const particles = [
    "⭐", "💖", "⚡", "✨", "❤️", "🌟", "💙", 
    "LOVE!", "MARRY!", "BAM!", "POW!", "BOOM!", "YES!"
  ];

  const spawnParticle = () => {
    const particle = document.createElement("div");
    particle.className = "particle";
    
    // 무작위 속성 설정
    const index = Math.floor(Math.random() * particles.length);
    const content = particles[index];
    particle.textContent = content;

    // 만화 텍스트 이펙트인 경우 스타일링 다르게
    if (content.endsWith("!")) {
      particle.style.fontFamily = "var(--font-title)";
      particle.style.fontWeight = "900";
      particle.style.fontSize = "16px";
      particle.style.backgroundColor = Math.random() > 0.5 ? "var(--color-yellow)" : "var(--color-red)";
      particle.style.color = "var(--color-dark)";
      particle.style.padding = "4px 8px";
      particle.style.border = "2px solid var(--color-dark)";
      particle.style.borderRadius = "8px";
    } else {
      particle.style.fontSize = (Math.random() * 20 + 20) + "px";
    }

    // 좌우 배치 무작위
    particle.style.left = (Math.random() * 90 + 5) + "%";
    
    // 애니메이션 딜레이, 재생 속도 무작위화
    const duration = Math.random() * 3 + 3; // 3~6초
    particle.style.animationDuration = duration + "s";
    
    container.appendChild(particle);

    // 애니메이션 종료 시 DOM에서 완전히 제거하여 메모리 절약
    setTimeout(() => {
      particle.remove();
    }, duration * 1000);
  };

  // 일정 주기마다 파티클 생성 (1.5초당 1개씩 리소스를 너무 잡아먹지 않게 설정)
  setInterval(spawnParticle, 1200);
}

// ==========================================
// 5. 아코디언 메뉴 구동
// ==========================================
function initAccordions() {
  const triggers = document.querySelectorAll(".accordion-trigger");

  triggers.forEach(trigger => {
    trigger.addEventListener("click", () => {
      const panel = trigger.nextElementSibling;
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      // 현재 열려있는 아코디언이 아닌 경우 닫기 (Optional: 단일 열림 모드 원할 시 추가)
      // 여기선 개별 토글로 각각 자유롭게 다 켜고 끌 수 있게 구현함
      
      if (isExpanded) {
        panel.style.maxHeight = null;
        trigger.setAttribute("aria-expanded", "false");
        trigger.classList.remove("active");
      } else {
        // 아코디언 높이 동적 계산 바인딩
        panel.style.maxHeight = panel.scrollHeight + "px";
        trigger.setAttribute("aria-expanded", "true");
        trigger.classList.add("active");
      }
    });
  });
}

// ==========================================
// 6. 클립보드 복사 엔진 & 토스트 피드백
// ==========================================
function copyToClipboard(text) {
  // 모바일 호환 클립보드 API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyToast();
    }).catch(err => {
      fallbackCopyTextToClipboard(text);
    });
  } else {
    fallbackCopyTextToClipboard(text);
  }
}

// 구형 브라우저 대응 대체 복사 로직
function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  // 스크롤 가림 방지 처리
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showCopyToast();
    } else {
      alert("복사에 실패했습니다. 계좌번호를 드래그해서 직접 복사해 주세요.");
    }
  } catch (err) {
    console.error("계좌번호 복사 오류:", err);
  }
  document.body.removeChild(textArea);
}

// 복사 완료 토스트 알림 띄우기
function showCopyToast() {
  const toast = document.getElementById("copy-toast");
  toast.classList.add("show");

  // 1.5초 후 닫기
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

// ==========================================
// 7. 갤러리 슬라이드쇼 및 모달 라이트박스
// ==========================================
function initGalleryModal() {
  const images = document.querySelectorAll(".gallery-img");
  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("modal-img");
  const modalCaption = document.getElementById("modal-caption");
  const closeBtn = document.querySelector(".modal-close");
  const prevBtn = document.querySelector(".modal-prev");
  const nextBtn = document.querySelector(".modal-next");

  let currentIndex = 0;
  const imageSources = Array.from(images).map(img => img.getAttribute("src"));
  const imageCaptions = Array.from(images).map(img => {
    const siblingCaption = img.nextElementSibling;
    return siblingCaption ? siblingCaption.textContent : "LOVE";
  });

  const openModal = (index) => {
    currentIndex = index;
    modalImg.setAttribute("src", imageSources[currentIndex]);
    modalCaption.textContent = imageCaptions[currentIndex];
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
  };

  const closeModal = () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  };

  const showNext = () => {
    currentIndex = (currentIndex + 1) % imageSources.length;
    modalImg.setAttribute("src", imageSources[currentIndex]);
    modalCaption.textContent = imageCaptions[currentIndex];
  };

  const showPrev = () => {
    currentIndex = (currentIndex - 1 + imageSources.length) % imageSources.length;
    modalImg.setAttribute("src", imageSources[currentIndex]);
    modalCaption.textContent = imageCaptions[currentIndex];
  };

  // 갤러리 썸네일 클릭 바인딩
  images.forEach(img => {
    img.addEventListener("click", () => {
      const idx = parseInt(img.getAttribute("data-index"), 10);
      openModal(idx);
    });
  });

  // 사진 더보기 버튼 바인딩
  const moreBtn = document.getElementById("btn-gallery-more");
  if (moreBtn) {
    moreBtn.addEventListener("click", () => {
      openModal(0);
    });
  }

  // 버튼 이벤트
  closeBtn.addEventListener("click", closeModal);
  nextBtn.addEventListener("click", showNext);
  prevBtn.addEventListener("click", showPrev);

  // 모달 영역 바깥 클릭 시 모달 닫기
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.classList.contains("modal-content")) {
      closeModal();
    }
  });

  // 키보드 키 제어 연동 (웹 접근성 준수)
  document.addEventListener("keydown", (e) => {
    if (modal.getAttribute("aria-hidden") === "false") {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
  });
}

// ==========================================
// 8. 로컬 스토리지 방명록 (Fan Letters)
// ==========================================
function initGuestbook() {
  const form = document.getElementById("guestbook-form");
  const nameInput = document.getElementById("gb-name");
  const msgInput = document.getElementById("gb-message");
  const entriesContainer = document.getElementById("guestbook-entries");

  const storageKey = "wedding_guestbook_letters";

  // 기존 저장된 방명록 조회 및 렌더링
  const getEntries = () => {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : [];
  };

  const saveEntries = (entries) => {
    localStorage.setItem(storageKey, JSON.stringify(entries));
  };

  const renderEntries = () => {
    const entries = getEntries();
    entriesContainer.innerHTML = ""; // 기존 내역 초기화

    if (entries.length === 0) {
      entriesContainer.innerHTML = `
        <div class="text-center text-dark" style="padding:20px; font-weight:500;">
          영웅들에게 첫 번째 팬레터를 남겨보세요! ✍️
        </div>
      `;
      return;
    }

    // 최신 글이 위로 가도록 역순 정렬 렌더링
    entries.slice().reverse().forEach(entry => {
      const bubble = document.createElement("div");
      bubble.className = "entry-bubble";
      bubble.innerHTML = `
        <div class="entry-header">
          <span class="entry-author font-comic">${escapeHtml(entry.name)}</span>
          <span class="entry-date">${entry.date}</span>
        </div>
        <p class="entry-message">${escapeHtml(entry.message)}</p>
        <div class="text-right" style="margin-top: 6px;">
          <button class="btn-delete-entry" data-id="${entry.id}">X 삭제</button>
        </div>
      `;
      entriesContainer.appendChild(bubble);
    });

    // 삭제 버튼 연동
    entriesContainer.querySelectorAll(".btn-delete-entry").forEach(btn => {
      btn.addEventListener("click", () => {
        const idToDelete = btn.getAttribute("data-id");
        deleteEntry(idToDelete);
      });
    });
  };

  const addEntry = (name, message) => {
    const entries = getEntries();
    const now = new Date();
    const dateStr = `${now.getMonth() + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()}`;
    
    const newEntry = {
      id: Date.now().toString(),
      name: name,
      message: message,
      date: dateStr
    };

    entries.push(newEntry);
    saveEntries(entries);
    renderEntries();
  };

  const deleteEntry = (id) => {
    let entries = getEntries();
    entries = entries.filter(entry => entry.id !== id);
    saveEntries(entries);
    renderEntries();
  };

  // HTML 인젝션 방지 이스케이프 헬퍼
  const escapeHtml = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  };

  // 폼 전송 이벤트 바인딩
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const message = msgInput.value.trim();

    if (name && message) {
      addEntry(name, message);
      // 폼 비우기
      nameInput.value = "";
      msgInput.value = "";
    }
  });

  // 초기 렌더링 구동
  renderEntries();
}

// ==========================================
// 9. 스크롤 트리거 페이드인 애니메이션
// ==========================================
function initScrollFade() {
  const fadeElements = document.querySelectorAll(".scroll-fade");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15 // 15% 보일 때 등장
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        observer.unobserve(entry.target); // 한번 뜬 건 관찰 해제하여 성능 절약
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => observer.observe(el));
}

// ==========================================
// 10. 선수 응원 하트 기능
// ==========================================
function initCheerButtons() {
  const btnGroom = document.querySelector('.btn-cheer[data-target="groom"]');
  const btnBride = document.querySelector('.btn-cheer[data-target="bride"]');
  const countGroomEl = document.getElementById("cheer-count-groom");
  const countBrideEl = document.getElementById("cheer-count-bride");

  const storageKeyGroom = "wedding_cheer_groom";
  const storageKeyBride = "wedding_cheer_bride";

  // 초기값 불러오기
  let countGroom = parseInt(localStorage.getItem(storageKeyGroom) || "0", 10);
  let countBride = parseInt(localStorage.getItem(storageKeyBride) || "0", 10);

  if (countGroomEl) countGroomEl.textContent = countGroom;
  if (countBrideEl) countBrideEl.textContent = countBride;

  const handleCheer = (target, elCount, btnEl, storageKey) => {
    let currentCount = parseInt(localStorage.getItem(storageKey) || "0", 10);
    currentCount++;
    localStorage.setItem(storageKey, currentCount);
    elCount.textContent = currentCount;
    
    // 애니메이션 트리거
    btnEl.classList.remove("clicked");
    // 리플로우 강제 발생
    void btnEl.offsetWidth;
    btnEl.classList.add("clicked");
  };

  if (btnGroom) {
    btnGroom.addEventListener("click", () => handleCheer("groom", countGroomEl, btnGroom, storageKeyGroom));
  }
  
  if (btnBride) {
    btnBride.addEventListener("click", () => handleCheer("bride", countBrideEl, btnBride, storageKeyBride));
  }
}
