//입력받은 전화번호를 db에 이미 존재하는지 안하는지 확인.
//존재하면 1.1.2 (기존 비밀번호 입력하는 페이지로)
//전화번호 입력해야만 다음페이지로 이동가능
//존재하지 않다면 1.1.1 (앞으로 사용할 비밀번호 입력하는 페이지로)
const telNoInput11 = document.getElementById("11telNo-input");
const confirmBtn11 = document.getElementById("11confirm");
const TELNO_KEY = "TELNO";
const ITEMNO_KEY = "ITEMNO";
const itemsRef = db.collection("상품정보");

function saveTelNo(telNo) {
  localStorage.setItem(TELNO_KEY, telNo);
} //done
function saveItemNo(itemNo) {
  localStorage.setItem(ITEMNO_KEY, itemNo);
} //done
// function setItemDB(itemNo, telNo) {
//   itemsRef
//     .doc(`item${itemNo}`)
//     .set({
//       contact: telNo,
//     })
//     .then(() => {
//       console.log("Document successfully written!");
//     })
//     .catch((error) => {
//       console.error("Error writing document: ", error);
//     });
// } //done
function handleConfirmBtn() {
  let itemNo = 1;
  itemsRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        itemNo++;
      });
    })
    .then(() => {
      let telNo = telNoInput11.value;
      let count = 0;
      if (telNo == "") {
        alert("전화번호를 입력해주세요.");
      } else {
        if (telNo.length === 11) {
          saveItemNo(itemNo);
          saveTelNo(telNo);
          itemsRef
            .where("contact", "==", telNo)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                count++;
              });
            })
            .then(() => {
              if (count > 0) {
                location.href = "/html/1.1.2.html";
              } else {
                location.href = "/html/1.1.1.html";
              }
            });
        } else {
          alert("전화번호를 정확히 입력해주세요.");
        }
      }
    });
} //done
function enterkey(e) {
  if (e.keyCode == 13) {
    e.preventDefault();
    // 엔터키가 눌렸을 때 실행할 내용
    handleConfirmBtn();
  }
}
const page11 = document.querySelector(".page11");

function init() {
  confirmBtn11.addEventListener("click", handleConfirmBtn);
  document.addEventListener("keydown", enterkey);
  page11.style.height = window.innerHeight;
} //done
init();
