const telNoInput = document.getElementById("telNo-input");

const password = document.getElementById("14password-input");
const passwordInput = document.querySelector(".password_input");
const passwordEyes = passwordInput.querySelector(".fa-eye");
const passwordEyesSlash = passwordInput.querySelector(".fa-eye-slash");
const eyes = passwordInput.querySelector(".eyes");

const confirmBtn = document.querySelector("#confirm");
const TELNO_KEY = "TELNO";

const recommendRef = db.collection("추천정보");

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
function saveTelNo() {
  let telNo = telNoInput.value;
  localStorage.setItem(TELNO_KEY, telNo);
}
function handleConfirmBtn() {
  let pw;
  if (telNoInput.value == "") {
    alert("전화번호를 입력해주세요.");
  } else if (password.value == "") {
    alert("비밀번호를 입력해주세요.");
  } else if (telNoInput.value != "" && password.value != "") {
    recommendRef
      .where("contact", "==", telNoInput.value)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          pw = doc.data().password;
        });
      })
      .then(() => {
        if (pw === password.value) {
          saveTelNo();
          location.href = "/html/1.4.1.html";
        } else {
          alert("비밀번호를 정확히 입력해주세요.");
        }
      });
  }
} //done
function chkPW() {
  let reg = /^(?=.*?[a-zA-z])(?=.*?[0-9]).{8,}$/;
  let pw = password.value;

  if (false === reg.test(pw)) {
    alert("비밀번호는 8자 이상으로, 영문, 숫자를 모두 포함해야 합니다.");
  } else {
    handleConfirmBtn();
  }
}
function enterkey(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    // 엔터키가 눌렸을 때 실행할 내용
    chkPW();
  }
}
const page14 = document.querySelector(".page14");

function init() {
  eyes.addEventListener("click", handleEyes);
  confirmBtn.addEventListener("click", chkPW);
  document.addEventListener("keydown", enterkey);
}
init();
