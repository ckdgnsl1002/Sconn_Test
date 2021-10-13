const nicknameInput = document.getElementById("nickname-input");
const telNoInput = document.getElementById("telNo-input");
const passwordInput = document.querySelector(".password_input");
const passwordCInput = document.querySelector(".passwordC_input");

const password = document.getElementById("12password-input");
const passwordC = document.getElementById("12password-confirm-input");
const eyes = passwordInput.querySelector(".eyes");
const eyesC = passwordCInput.querySelector(".eyes");
const passwordEyes = passwordInput.querySelector(".fa-eye");
const passwordEyesSlash = passwordInput.querySelector(".fa-eye-slash");
const passwordCEyes = passwordCInput.querySelector(".fa-eye");
const passwordCEyesSlash = passwordCInput.querySelector(".fa-eye-slash");

const same = document.querySelector("#same");
const different = document.querySelector("#different");

const selectableBtns = document.getElementsByClassName("btn1");

const keywordsList = document.getElementById("keywords-list");
const sizesList = document.getElementById("sizes-list");
const platformsList = document.getElementById("platforms-list");

const styleBtns = keywordsList.getElementsByClassName("btn1");
const sizeBtns = sizesList.getElementsByClassName("btn1");
const platformBtns = platformsList.getElementsByClassName("btn1");

const uploadBtn = document.querySelector(".upload");

const checkbox = document.querySelector("#check");

const recommendRef = db.collection("추천정보");

function passwordConfirm() {
  if (password.value != "" && passwordC.value == "") {
    null;
  } else if (password.value != "" && passwordC.value != "") {
    if (password.value == passwordC.value) {
      same.classList.remove("hidden");
      different.classList.add("hidden");
    } else if (password.value != passwordC.value) {
      same.classList.add("hidden");
      different.classList.remove("hidden");
    }
  }
} //done
function showPassword() {
  passwordEyes.classList.add("hidden");
  passwordEyesSlash.classList.remove("hidden");
  password.setAttribute("type", "text");
} //done
function hidePassword() {
  passwordEyes.classList.remove("hidden");
  passwordEyesSlash.classList.add("hidden");
  password.setAttribute("type", "password");
} //done
function handleEyes() {
  if (passwordEyes.classList.contains("hidden") == false) {
    showPassword();
  } else {
    hidePassword();
  }
} //done
function showPasswordC() {
  passwordCEyes.classList.add("hidden");
  passwordCEyesSlash.classList.remove("hidden");
  passwordC.setAttribute("type", "text");
} //done
function hidePasswordC() {
  passwordCEyes.classList.remove("hidden");
  passwordCEyesSlash.classList.add("hidden");
  passwordC.setAttribute("type", "password");
} //done
function handleEyesC() {
  if (passwordCEyes.classList.contains("hidden") == false) {
    showPasswordC();
  } else {
    hidePasswordC();
  }
} //done
function selectBtn(event) {
  if (event.target.classList.contains("clicked") === true) {
    event.target.style.color = "#3b3b3b";
    event.target.style.background = "white";
    event.target.style.fontWeight = "700";
    event.target.classList.remove("clicked");
  } else {
    event.target.style.color = "white";
    event.target.style.background = "#70d7fa";
    event.target.style.fontWeight = "800";
    event.target.classList.add("clicked");
  }
} //done
function handleBtn() {
  for (let i = 0; i < selectableBtns.length; i++) {
    selectableBtns[i].addEventListener("click", selectBtn);
  }
} //done
function saveDB() {
  let keywords = [];
  for (let i = 0; i < styleBtns.length; i++) {
    if (styleBtns[i].classList.contains("clicked") === true) {
      keywords.push(styleBtns[i].innerText);
    }
  }
  let sizes = [];
  for (let i = 0; i < sizeBtns.length; i++) {
    if (sizeBtns[i].classList.contains("clicked") === true) {
      sizes.push(sizeBtns[i].innerText);
    }
  }
  let platforms = [];
  for (let i = 0; i < platformBtns.length; i++) {
    if (platformBtns[i].classList.contains("clicked") === true) {
      platforms.push(platformBtns[i].innerText);
    }
  }
  if (contactExists() > 0) {
    alert(
      "해당 연락처로 이미 추천정보를 등록한 이력이 있습니다.(정보 수정이 필요한 경우 메인 페이지의 ‘추천정보 수정하기' 기능을 이용해주세요.)"
    );
  } else if (nicknameInput.value == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (contactExists() > 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (passwordInput.value == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (passwordCInput.value == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (passwordCInput.value != "" && same.classList.contains("hidden")) {
    alert("비밀번호가 일치하지 않습니다.");
  } else if (keywords.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (sizes.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (platforms.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (checkbox.checked == false) {
    alert("추천 정보 등록을 위해서는 개인정보처리방침에 동의하셔야 합니다.");
  } else if (
    nicknameInput.value != "" &&
    contactExists() == 0 &&
    passwordInput.value != "" &&
    passwordCInput.value != "" &&
    different.classList.contains("hidden") &&
    keywords.length != 0 &&
    sizes.length != 0 &&
    platforms.length != 0 &&
    checkbox.checked == true
  ) {
    let userNo = 1;
    recommendRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          userNo++;
          // doc.data() is never undefined for query doc snapshots
        });
      })
      .then(() => {
        let nickname = nicknameInput.value;
        let password1 = password.value;
        let telNo = telNoInput.value;
        recommendRef
          .doc(`user${userNo}`)
          .set({
            recommend_platform: platforms,
            nickname: nickname,
            password: password1,
            contact: telNo,
            size: sizes,
            upload_time: firebase.firestore.FieldValue.serverTimestamp(),
            keywords,
            privacy: "checked",
          })
          .then(() => {
            console.log("Document successfully updated!");
            location.href = "/html/1.2.1.html";
          });
      });
  }
}
function contactExists() {
  let contactExist = 0;
  recommendRef
    .where("contact", "==", telNoInput.value)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        contactExist++;
      });
    })
    .then(() => {
      if (contactExist > 0) {
        alert(
          "해당 연락처로 이미 추천정보를 등록한 이력이 있습니다. \n(정보 수정이 필요한 경우 메인 페이지의 ‘추천정보 수정하기' 기능을 이용해주세요.)"
        );
        // console.log("이미 추천정보에 저장된 연락처입니다.");
      }
    });
  return contactExist;
}
function chkPW() {
  let reg = /^(?=.*?[a-zA-z])(?=.*?[0-9]).{8,}$/;
  let pw = password.value;

  if (false == reg.test(pw)) {
    alert("비밀번호는 8자 이상, 영문, 숫자를 모두 포함해야 합니다.");
  } else {
    saveDB();
  }
}
function enterkey(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    // 엔터키가 눌렸을 때 실행할 내용
    chkPW();
  }
}
function init() {
  eyes.addEventListener("click", handleEyes);
  eyesC.addEventListener("click", handleEyesC);
  password.addEventListener("input", passwordConfirm);
  passwordC.addEventListener("input", passwordConfirm);
  telNoInput.addEventListener("blur", contactExists);
  handleBtn();
  uploadBtn.addEventListener("click", chkPW);
  document.addEventListener("keydown", enterkey);
}

init();
