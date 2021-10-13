//<1.1.1> upload item new
const telNoInput = document.getElementById("111telNo-input");

const passwordInput = document.querySelector(".password_input");
const passwordCInput = document.querySelector(".passwordC_input");

const password = document.getElementById("111password-input");
const passwordC = document.getElementById("111password-confirm-input");
const eyes = passwordInput.querySelector(".eyes");
const eyesC = passwordCInput.querySelector(".eyes");
const passwordEyes = passwordInput.querySelector(".fa-eye");
const passwordEyesSlash = passwordInput.querySelector(".fa-eye-slash");
const passwordCEyes = passwordCInput.querySelector(".fa-eye");
const passwordCEyesSlash = passwordCInput.querySelector(".fa-eye-slash");

const same = document.querySelector("#same");
const different = document.querySelector("#different");

const checkbox = document.querySelector("#check");
const btn = document.querySelector("button");

const TELNO_KEY = "TELNO";
const ITEMNO_KEY = "ITEMNO";
const PW_KEY = "PW";
const savedTelNo = localStorage.getItem(TELNO_KEY);
const savedItemNo = localStorage.getItem(ITEMNO_KEY);

const itemsRef = db.collection("상품정보");
const itemDoc = itemsRef.doc(`item${savedItemNo}`);

function fixTelNo() {
  telNoInput.value = savedTelNo;
} //done
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
function savePassword() {
  let pw = password.value;
  localStorage.setItem(PW_KEY, pw);
}
function handleConfirmBtn() {
  if (same.classList.contains("hidden") === false && checkbox.checked == true) {
    savePassword();
    location.href = "/html/1.1.1.1.html";
  } else if (password.value == "") {
    alert("비밀번호를 입력해주세요.");
  } else if (passwordC.value == "") {
    alert("비밀번호 확인을 입력해주세요.");
  } else if (
    passwordC.value != "" &&
    same.classList.contains("hidden") === true
  ) {
    alert("비밀번호가 일치하지 않습니다.");
  } else if (checkbox.checked != true) {
    alert("상품 정보 등록을 위해서는 개인정보처리방침에 동의하셔야 합니다.");
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
const page111 = document.querySelector(".page111");

function init() {
  page111.style.height = window.innerHeight;

  fixTelNo();
  eyes.addEventListener("click", handleEyes);
  eyesC.addEventListener("click", handleEyesC);
  password.addEventListener("input", passwordConfirm);
  passwordC.addEventListener("input", passwordConfirm);
  btn.addEventListener("click", chkPW);
  document.addEventListener("keydown", enterkey);
}
init();
