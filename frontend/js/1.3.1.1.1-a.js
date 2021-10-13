const TELNO_KEY = "TELNO";
const ITEM_KEY = "ITEM";
const ITEMNO_KEY = "ITEMNO";

const goHomeBtn = document.getElementById("go-home");
const oneMoreBtn = document.getElementById("one-more");

function goHome() {
  localStorage.removeItem(TELNO_KEY);
  localStorage.removeItem(ITEMNO_KEY);
  localStorage.removeItem(ITEM_KEY);
  location.href = "https://www.sconncurating.com";
}

const itemsRef = db.collection("상품정보");

function oneMore() {
  let items_count = 0;
  let itemNo = items_count + 1;
  //기존 items 개수 세기 -> 아이템 이름 번호 설정하기 위해서
  itemsRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      items_count = querySnapshot.size;
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }); //fail
  localStorage.setItem(ITEMNO_KEY, itemNo);
  let telNo = localStorage.getItem(TELNO_KEY);
  itemsRef
    .doc(`item${itemNo}`)
    .set({
      phone_number: telNo,
    })
    .then(() => {
      console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
  location.href = "/html/1.1.1.1.html";
}
const page13111a = document.querySelector(".page13111-a");

function init() {
  goHomeBtn.addEventListener("click", goHome);
  oneMoreBtn.addEventListener("click", oneMore);
}
init();
