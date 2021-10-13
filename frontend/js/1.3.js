const telNoInput = document.getElementById("telNo-input");

const password = document.getElementById("13password-input");
const passwordInput = document.querySelector(".password_input");
const passwordEyes = passwordInput.querySelector(".fa-eye");
const passwordEyesSlash = passwordInput.querySelector(".fa-eye-slash");
const eyes = passwordInput.querySelector(".eyes");

const confirmBtn = document.querySelector("#confirm");
const TELNO_KEY = "TELNO";
const PW_KEY = "PW";

const itemsRef = db.collection("상품정보");

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
function savePW() {
  let pw = password.value;
  localStorage.setItem(PW_KEY, pw);
}
function handleConfirmBtn() {
  let pw;
  if (telNoInput.value == "") {
    alert("전화번호를 입력해주세요.");
  } else if (password.value == "") {
    alert("비밀번호를 입력해주세요.");
  } else if (telNoInput.value != "" && password.value != "") {
    itemsRef
      .where("contact", "==", telNoInput.value)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          pw = doc.data().password;
        });
      })
      .then(() => {
        if (pw == password.value) {
          saveTelNo();
          savePW();
          location.href = "/html/1.3.1.html";
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
    // console.log("통과");
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
const page13 = document.querySelector(".page13");

function init() {
  page13.style.height = window.innerHeight;

  eyes.addEventListener("click", handleEyes);
  confirmBtn.addEventListener("click", chkPW);
  document.addEventListener("keydown", enterkey);
}
init();
