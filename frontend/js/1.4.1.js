const selectableBtns = document.getElementsByClassName("btn1");
const keywordsList = document.getElementById("keywords-list");
const styleBtns = keywordsList.getElementsByClassName("btn1");
const uploadBtn = document.querySelector("#upload");
const sizes = document.querySelector("#sizes");
const sizeBtns = sizes.getElementsByClassName("btn1");
const platforms = document.getElementById("platforms");
const platformBtns = platforms.getElementsByClassName("btn1");
const nicknameInput = document.getElementById("nickname-input");
const contactInput = document.getElementById("contact-input");
const checkbox = document.querySelector("#check");

const privacyInput = document.querySelector("#check");
const TELNO_KEY = "TELNO";

const savedTelNo = localStorage.getItem(TELNO_KEY);

const recommendRef = db.collection("추천정보");

let userDoc;

function callInfo() {
  recommendRef
    .where("contact", "==", savedTelNo)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        userDoc = doc.id;
        const recommendInfoDoc = doc.data();
        nicknameInput.value = recommendInfoDoc.nickname;
        contactInput.value = recommendInfoDoc.contact;
        //platform
        for (let i = 0; i < platformBtns.length; i++) {
          for (let j = 0; j < recommendInfoDoc.recommend_platform.length; j++) {
            if (
              platformBtns[i].innerText ==
              recommendInfoDoc.recommend_platform[j]
            ) {
              platformBtns[i].classList.add("clicked");
              platformBtns[i].style.color = "white";
              platformBtns[i].style.background = "#70d7fa";
            }
          }
        }
        //keywords
        for (let i = 0; i < styleBtns.length; i++) {
          for (let j = 0; j < recommendInfoDoc.keywords.length; j++) {
            if (styleBtns[i].innerText == recommendInfoDoc.keywords[j]) {
              styleBtns[i].classList.add("clicked");
              styleBtns[i].style.color = "white";
              styleBtns[i].style.background = "#70d7fa";
            }
          }
        }
        //size
        for (let i = 0; i < sizeBtns.length; i++) {
          for (let j = 0; j < recommendInfoDoc.size.length; j++) {
            if (sizeBtns[i].innerText == recommendInfoDoc.size[j]) {
              sizeBtns[i].classList.add("clicked");
              sizeBtns[i].style.color = "white";
              sizeBtns[i].style.background = "#70d7fa";
            }
          }
        }
        if (recommendInfoDoc.privacy == "checked") {
          privacyInput.setAttribute("checked", true);
        }
      });
    })
    .catch((err) => {});
}
function onBtn(event) {
  event.target.style.color = "white";
  event.target.style.background = "#70d7fa";
  event.target.style.fontWeight = "800";
  event.target.classList.add("clicked");
}
function offBtn(event) {
  event.target.style.color = "#3b3b3b";
  event.target.style.background = "white";
  event.target.style.fontWeight = "700";
  event.target.classList.remove("clicked");
}
function selectBtn(event) {
  if (event.target.classList.contains("clicked") === true) {
    offBtn(event);
  } else {
    onBtn(event);
  }
} //done
function handleBtns() {
  for (let i = 0; i < selectableBtns.length; i++) {
    selectableBtns[i].addEventListener("click", selectBtn);
  }
} //done
function saveDB() {
  const nickname = document.getElementById("nickname-input").value;
  let keywords = [];
  let size = [];
  let platform = [];
  for (let i = 0; i < styleBtns.length; i++) {
    if (styleBtns[i].classList.contains("clicked") === true) {
      keywords.push(styleBtns[i].textContent);
    }
  }
  for (let i = 0; i < sizeBtns.length; i++) {
    if (sizeBtns[i].classList.contains("clicked") === true) {
      size.push(sizeBtns[i].textContent);
    }
  }
  for (let i = 0; i < platformBtns.length; i++) {
    if (platformBtns[i].classList.contains("clicked") === true) {
      platform.push(platformBtns[i].textContent);
    }
  }
  if (nicknameInput.value == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (contactInput.value == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (keywords.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (size.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (platform.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (checkbox.checked == false) {
    alert("추천 정보 등록을 위해서는 개인정보처리방침에 동의하셔야 합니다.");
  } else if (
    nicknameInput.value != "" &&
    contactInput.value !== "" &&
    keywords.length != 0 &&
    size.length != 0 &&
    platform.length != 0 &&
    checkbox.checked == true
  ) {
    recommendRef
      .doc(userDoc)
      .update({
        nickname: nickname,
        size,
        keywords,
        recommend_platform: platform,
        last_update_time: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("Document successfully updated!");
        location.href = "/html/1.4.1.1.html";
      });
  }
}

function enterkey(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    // 엔터키가 눌렸을 때 실행할 내용
    saveDB();
  }
}
function init() {
  callInfo();
  handleBtns();
  uploadBtn.addEventListener("click", saveDB);
  document.addEventListener("keydown", enterkey);
}
init();
