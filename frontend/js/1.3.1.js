// telNo에 전화번호 넣기
const telNo = document.querySelector("#telNo");
const TELNO_KEY = "TELNO";
const savedTelNo = localStorage.getItem(TELNO_KEY);

function setTitle() {
  telNo.innerText = savedTelNo;
}
// db에서 전화번호와 맞는 doc가져와서 article 생성해서 형식에 맞춰 html에 넣기
const itemsRef = db.collection("상품정보");
function setItem() {
  let count = 0;
  let boxList = [];
  itemsRef
    .where("contact", "==", savedTelNo)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().deleted == false) {
          count++;
          let box = document.createElement("article");
          box.className = "box";
          box.setAttribute("id", doc.id);
          // let main = document.querySelector("main");
          // main.appendChild(box);
          let content = document.createElement("div");
          content.className = "content";
          content.setAttribute("id", doc.id);
          box.appendChild(content);
          let titleDate = document.createElement("div");
          titleDate.className = "title_date";
          titleDate.setAttribute("id", doc.id);
          content.appendChild(titleDate);
          let title = document.createElement("div");
          title.className = "title";
          title.innerHTML = doc.data().item_name;
          title.setAttribute("id", doc.id);
          titleDate.appendChild(title);
          let date = document.createElement("div");
          date.className = "date";
          date.setAttribute("id", doc.id);
          let timeStamp = doc.data().upload_time.toMillis();
          let when = new Date(timeStamp);
          date.innerHTML = `${when.getFullYear()}/${
            when.getMonth() + 1
          }/${when.getDate()}`;
          titleDate.appendChild(date);
          let keywords = document.createElement("div");
          keywords.className = "keywords";
          keywords.setAttribute("id", doc.id);
          content.appendChild(keywords);
          keywordsList = doc.data().keywords;
          for (let i = 0; i < 3; i++) {
            let keyword = document.createElement("div");
            keyword.className = "keyword";
            keyword.setAttribute("id", doc.id);
            keyword.innerHTML = keywordsList[i];
            keywords.appendChild(keyword);
          }
          box.addEventListener("click", goItemInfo);
          boxList.push(box);
        }
      });
      sortByItemNo(boxList);
    })
    .catch((err) => {})
    .then(() => {
      // 상품이 없으면 등록한 상품이 없습니다 띄우기
      if (count == 0) {
        const noProduct = document.getElementById("no-product");
        noProduct.classList.remove("hidden");
      } else {
      }
    });
}
const main = document.querySelector("main");
const ChildrenOfMain = main.querySelectorAll(".box");
function sortByItemNo(boxList) {
  for (let i = 0; i < boxList.length; i++) {
    for (let j = i; j < boxList.length; j++) {
      if (boxList[i].id.split("m")[1] - boxList[j].id.split("m")[1] > 0) {
        let tmp = boxList[i];
        boxList[i] = boxList[j];
        boxList[j] = tmp;
      } else {
        null;
      }
    }
  }
  let main = document.querySelector("main");
  for (let i = 0; i < boxList.length; i++) {
    main.appendChild(boxList[i]);
  }
}
const ITEM_KEY = "ITEM";
function goItemInfo(e) {
  localStorage.setItem(ITEM_KEY, e.target.id);
  location.href = "/html/1.3.1.1.html";
}
// 홈으로 가기
const homeBtn = document.getElementById("go-home");
function goHome() {
  localStorage.removeItem(TELNO_KEY);
  location.href = "https://www.sconncurating.com";
}
const page131 = document.querySelector(".page131");

function init() {
  page131.style.height = window.innerHeight;

  setTitle();
  setItem();
  homeBtn.addEventListener("click", goHome);
}
init();
