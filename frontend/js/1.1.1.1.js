const file = document.querySelector("#file");
const photoInput = document.querySelector("#photo");
const photoLabel = document.querySelector("#photoLabel");
const photoUploadPlz = document.querySelector(".photo_upload_plz");
const captureInput = document.querySelector("#capture");
const captureList = document.querySelector("#capture-list");
const captureDeleteBtn = captureList.querySelector("button");

const selectableBtns = document.getElementsByClassName("btn1");
const keywordsList = document.getElementById("keywords-list");
const styleBtns = keywordsList.getElementsByClassName("btn1");
const uploadBtn = document.querySelector(".upload");

const sizesList = document.querySelector("#sizes");
const sizeBtns = sizesList.getElementsByClassName("btn1");

const TELNO_KEY = "TELNO";
const ITEMNO_KEY = "ITEMNO";
const PW_KEY = "PW";
const savedTelNo = localStorage.getItem(TELNO_KEY);
const savedItemNo = localStorage.getItem(ITEMNO_KEY);
const savedPW = localStorage.getItem(PW_KEY);

const itemsRef = db.collection("상품정보");
const itemDoc = itemsRef.doc(`item${savedItemNo}`);

let photoFile;
function setPhoto(event) {
  for (let image of event.target.files) {
    let reader = new FileReader();
    reader.onload = function (event) {
      let div = document.createElement("div");
      let btn = document.createElement("button");
      let img = document.createElement("img");
      img.setAttribute("src", event.target.result);
      file.appendChild(div);
      div.classList.add("photo");
      div.appendChild(img);
      div.appendChild(btn);
      btn.setAttribute("onclick", "deletePhoto()");
      photoLabel.classList.add("hidden");
      photoUploadPlz.classList.add("hidden");
    };
    photoFile = image;
    reader.readAsDataURL(image);
  }
} //done
function deletePhoto() {
  const photo = file.querySelector(".photo");
  photo.parentNode.removeChild(photo);
  photoInput.value = "";
  photoLabel.classList.remove("hidden");
  photoUploadPlz.classList.remove("hidden");
} //done
let captures = [];
function setCapture(event) {
  let count = captureList.childElementCount - 2;
  if (count >= 3) {
    alert("최대 3장까지 업로드 가능합니다.");
  } else {
    for (let image of event.target.files) {
      let reader = new FileReader();
      reader.onload = function (event) {
        let div = document.createElement("div");
        let btn = document.createElement("button");
        let img = document.createElement("img");
        img.setAttribute("src", event.target.result);
        captureList.appendChild(div);
        btn.setAttribute("onclick", "deleteCapture(event)");
        div.appendChild(img);
        div.appendChild(btn);
      };
      captures.push(image);
      reader.readAsDataURL(image);
    }
  }
} //done
function deleteCapture(event) {
  const capture = event.target.parentNode;
  for (let i = 0; i < capture.parentNode.childElementCount; i++) {
    const divs = capture.parentNode.querySelectorAll("div");
    if (capture == divs[i]) {
      captures.splice(i, 1);
    }
  }
  capture.parentNode.removeChild(capture);
}
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
  for (let i = 0; i < styleBtns.length; i++) {
    styleBtns[i].addEventListener("click", selectBtn);
  }
  for (let i = 0; i < sizeBtns.length; i++) {
    sizeBtns[i].addEventListener("click", selectBtn);
  }
}
function handleStyleBtn() {
  let count = 0;
  for (let i = 0; i < styleBtns.length; i++) {
    if (styleBtns[i].classList.contains("clicked")) {
      count++;
    } else {
      null;
    }
  }
  if (count > 4) {
    for (let i = 0; i < styleBtns.length; i++) {
      if (styleBtns[i].classList.contains("clicked")) {
      } else {
        styleBtns[i].removeEventListener("click", selectBtn);
        styleBtns[i].addEventListener("click", alertStyleBtn);
      }
    }
    // count = 0;
  } else if (count <= 4) {
    for (let i = 0; i < styleBtns.length; i++) {
      styleBtns[i].addEventListener("click", selectBtn);
      styleBtns[i].removeEventListener("click", alertStyleBtn);
    }
  }
}
function alertStyleBtn() {
  alert("원하는 스타일은 최소 3개, 최대 5개 선택해야 합니다.");
}
function alertSizeBtn() {
  alert("사이즈 키워드는 최소 1개, 최대 2개 선택해야 합니다.");
}
function handleSizeBtn() {
  let count = 0;
  for (let i = 0; i < sizeBtns.length; i++) {
    if (sizeBtns[i].classList.contains("clicked")) {
      count++;
    } else {
      null;
    }
  }
  if (count > 1) {
    for (let i = 0; i < sizeBtns.length; i++) {
      if (sizeBtns[i].classList.contains("clicked")) {
      } else {
        sizeBtns[i].removeEventListener("click", selectBtn);
        sizeBtns[i].addEventListener("click", alertSizeBtn);
      }
    }
    // count = 0;
  } else if (count <= 1) {
    for (let i = 0; i < sizeBtns.length; i++) {
      sizeBtns[i].addEventListener("click", selectBtn);
      sizeBtns[i].removeEventListener("click", alertSizeBtn);
    }
  }
}
function saveDB() {
  const itemName = document.getElementById("product-name-input").value;
  const link = document.querySelector("#link").value;
  const uploadedPlatformSelect = document.querySelector("#platform");
  function uploadedPlatform() {
    return uploadedPlatformSelect.options[uploadedPlatformSelect.selectedIndex]
      .value;
  }
  let sizes = [];
  for (let i = 0; i < sizeBtns.length; i++) {
    if (sizeBtns[i].classList.contains("clicked") === true) {
      sizes.push(sizeBtns[i].innerText);
    }
  }
  const additionalInfo = document.querySelector("#comment").value;
  let keywords = [];
  for (let i = 0; i < styleBtns.length; i++) {
    if (styleBtns[i].classList.contains("clicked") === true) {
      keywords.push(styleBtns[i].innerText);
    }
  }
  if (photoInput.value == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (itemName == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (uploadedPlatform() == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (captures.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (link == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (keywords.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (keywords.length < 3) {
    alert("원하는 스타일은 최소 3개, 최대 5개 선택해야 합니다.");
  } else if (sizes.length < 1) {
    alert("사이즈 키워드는 최소 1개, 최대 2개 선택해야 합니다.");
  } else if (sizes.length == 0) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (
    photoInput.value != "" &&
    captures.length != 0 &&
    keywords.length >= 3 &&
    keywords.length <= 5 &&
    itemName != "" &&
    link != "" &&
    uploadedPlatform() != "" &&
    sizes.length != 0
  ) {
    itemDoc
      .set({
        item_name: itemName,
        link,
        upload_platform: uploadedPlatform(),
        password: savedPW,
        contact: savedTelNo,
        size: sizes,
        upload_time: firebase.firestore.FieldValue.serverTimestamp(),
        additional_info: additionalInfo,
        keywords,
        deleted: false,
      })
      .then(() => {
        console.log("Document successfully updated!");
        // let photoFile = photoInput.files[0];
        if (
          photoFile.name.split(".")[photoFile.name.split(".").length - 1] ==
          "jpg"
        ) {
          let productRef = storageRef.child(
            `item${savedItemNo}/product${savedItemNo}.jpg`
          );
          productRef.put(photoFile).then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (url) {
              itemDoc.update({
                photo_url: url,
              });
            });
            console.log("Uploaded a blob or file!");
          });
        } else if (
          photoFile.name.split(".")[photoFile.name.split(".").length - 1] ==
            "png" ||
          photoFile.name.split(".")[photoFile.name.split(".").length - 1] ==
            "jpeg"
        ) {
          let fileType = photoFile.type.split("/")[1];
          let productRef = storageRef.child(
            `item${savedItemNo}/product${savedItemNo}.${fileType}`
          );
          productRef.put(photoFile).then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (url) {
              itemDoc.update({
                photo_url: url,
              });
            });
            console.log("Uploaded a blob or file!");
          });
        }
      })
      .then(() => {
        let captures_url = [];
        for (let i = 0; i < captures.length; i++) {
          let captureFile = captures[i];
          let captureRef = storageRef.child(
            `item${savedItemNo}/${captureFile.name}`
          );
          captureRef.put(captureFile).then(function (snapshot) {
            snapshot.ref
              .getDownloadURL()
              .then(function (url) {
                captures_url.push(url);
              })
              .then(() => {
                itemDoc.update({
                  captures_url,
                });
              })
              .then(() => {
                console.log("Uploaded a blob or file!");
                if (i == captures.length - 1) {
                  location.href = "/html/1.1.1.1.1.html";
                }
              });
          });
        }
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
  photoInput.addEventListener("change", setPhoto);
  captureInput.addEventListener("change", setCapture);
  uploadBtn.addEventListener("click", saveDB);
  document.addEventListener("keydown", enterkey);
  setInterval(handleSizeBtn, 100);
  setInterval(handleStyleBtn, 100);
  handleBtn();
}
init();
