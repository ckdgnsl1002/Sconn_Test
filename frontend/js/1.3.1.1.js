const deleteBtn = document.querySelector("#delete");
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
const uploadBtn = document.querySelector("#upload");
const sizesList = document.querySelector("#sizes");
const sizeBtns = sizesList.getElementsByClassName("btn1");

const TELNO_KEY = "TELNO";
const ITEM_KEY = "ITEM";
const ITEMNO_KEY = "ITEMNO";
const CAPTURES_KEY = "CAPTURES";

const savedTelNo = localStorage.getItem(TELNO_KEY);
const savedItem = localStorage.getItem(ITEM_KEY);
const savedItemNo = savedItem.split("m")[1];
localStorage.setItem(ITEMNO_KEY, savedItemNo);

const itemsRef = db.collection("상품정보");
const itemDoc = itemsRef.doc(savedItem);

function callPhoto() {
  let div = document.createElement("div");
  let btn = document.createElement("button");
  let img = document.createElement("img");
  let url;
  itemDoc
    .get()
    .then((doc) => {
      url = doc.data().photo_url;
    })
    .then(() => {
      img.setAttribute("src", url);
    });
  file.appendChild(div);
  div.classList.add("photo");
  div.appendChild(img);
  div.appendChild(btn);
  btn.setAttribute("onclick", "deletePhoto()");
  photoLabel.classList.add("hidden");
  photoUploadPlz.classList.add("hidden");
}
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
    reader.readAsDataURL(image);
  }
} //done
function deletePhoto() {
  const photo = file.querySelector(".photo");
  photo.parentNode.removeChild(photo);
  photoLabel.classList.remove("hidden");
  photoUploadPlz.classList.remove("hidden");
} //done
//db에 존재하는 captures urls
let captures_url_list = [];
function callCaptures() {
  itemDoc
    .get()
    .then((doc) => {
      captures_url_list = doc.data().captures_url;
      localStorage.setItem(CAPTURES_KEY, JSON.stringify(captures_url_list));
    })
    .then(() => {
      for (let i = 0; i < captures_url_list.length; i++) {
        let div = document.createElement("div");
        let btn = document.createElement("button");
        let img = document.createElement("img");
        img.setAttribute("src", captures_url_list[i]);
        captureList.appendChild(div);
        btn.setAttribute("onclick", "deleteCapture(event)");
        div.appendChild(img);
        div.appendChild(btn);
      }
    });
}
// localStorage에 기존 캡처사진 저장해서 리스트로 불러오기.
// function getCaptures() {
//   localStorage.setItem(CAPTURES_KEY, []);
//   const savedCap = localStorage.getItem(CAPTURES_KEY);
//   let savedCaptures = [];
//   for (let i = 0; i < captures_url_list.length; i++) {
//     const captureRef = storage.refFromURL(captures_url_list[i]);
//     captureRef.getFile(savedCap);
//     savedCaptures.push(captureRef.getFile(savedCap));
//   }
// }
//input에 새롭게 upload된 파일들만 모음
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
deleted_captures_url = [];
function deleteCapture(event) {
  //지울 캡처
  const capture = event.target.parentNode;
  for (let i = 0; i < capture.parentNode.childElementCount; i++) {
    const divs = capture.parentNode.querySelectorAll("div");
    if (capture == divs[i]) {
      if (
        capture.querySelector("img").src.split(".")[0] ==
        "https://firebasestorage"
      ) {
        deleted_captures_url.push(captures_url_list[i - captures.length]);
        captures_url_list.splice(i - captures.length, 1);
        capture.parentNode.removeChild(capture);
        break;
      } else {
        captures.splice(i - captures_url_list.length, 1);
        capture.parentNode.removeChild(capture);
        break;
      }
    }
  }
}
function callInfo() {
  const itemNameInput = document.getElementById("product-name-input");
  const linkInput = document.querySelector("#link");
  const uploadedPlatformSelect = document.querySelector("#platform");

  const additionalInfo = document.querySelector("#comment");
  itemDoc
    .get()
    .then((doc) => {
      const itemInfoDoc = doc.data();
      itemNameInput.value = itemInfoDoc.item_name;
      linkInput.value = itemInfoDoc.link;
      //platform
      for (let i = 0; i < uploadedPlatformSelect.options.length; i++) {
        if (
          uploadedPlatformSelect.options[i].innerText ==
          itemInfoDoc.upload_platform
        ) {
          uploadedPlatformSelect.selectedIndex = i;
        }
      }
      //keywords
      for (let i = 0; i < styleBtns.length; i++) {
        for (let j = 0; j < itemInfoDoc.keywords.length; j++) {
          if (styleBtns[i].innerText == itemInfoDoc.keywords[j]) {
            styleBtns[i].classList.add("clicked");
            styleBtns[i].style.color = "white";
            styleBtns[i].style.background = "#70d7fa";
          }
        }
      }
      //size
      for (let i = 0; i < sizeBtns.length; i++) {
        for (let j = 0; j < itemInfoDoc.size.length; j++) {
          if (sizeBtns[i].innerText == itemInfoDoc.size[j]) {
            sizeBtns[i].classList.add("clicked");
            sizeBtns[i].style.color = "white";
            sizeBtns[i].style.background = "#70d7fa";
          }
        }
      }
      additionalInfo.value = itemInfoDoc.additional_info;
    })
    .catch((err) => {});
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
      sizes.push(sizeBtns[i].textContent);
    }
  }
  const additionalInfo = document.querySelector("#comment").value;
  let keywords = [];
  for (let i = 0; i < styleBtns.length; i++) {
    if (styleBtns[i].classList.contains("clicked") === true) {
      keywords.push(styleBtns[i].textContent);
    }
  }
  if (!file.querySelector(".photo")) {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (itemName == "") {
    alert("아직 입력하지 않은 정보가 있어요. 다시 한 번 확인해주세요!");
  } else if (uploadedPlatform() == "") {
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
    file.querySelector(".photo") &&
    keywords.length >= 3 &&
    keywords.length <= 5 &&
    itemName != "" &&
    link != "" &&
    uploadedPlatform() != "" &&
    sizes.length != 0
  ) {
    if (deleted_captures_url.length != 0) {
      for (let i = 0; i < deleted_captures_url.length; i++) {
        const element = deleted_captures_url[i];
        storage.refFromURL(element).delete();
      }
    } else {
      null;
    }
    itemDoc
      .update({
        item_name: itemName,
        link,
        upload_platform: uploadedPlatform(),
        contact: savedTelNo,
        size: sizes,
        last_update_time: firebase.firestore.FieldValue.serverTimestamp(),
        additional_info: additionalInfo,
        keywords,
      })
      .then(() => {
        console.log("Document successfully updated!");
      });
    if (photoInput.files.length != 0) {
      let photoFile = photoInput.files[0];
      if (
        photoFile.name.split(".")[photoFile.name.split(".").length - 1] == "jpg"
      ) {
        let productRef = storageRef.child(
          `item${savedItemNo}/product${savedItemNo}.jpg`
        );
        productRef.delete().then(() => {
          productRef.put(photoFile).then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (url) {
              itemDoc.update({
                photo_url: url,
              });
            });
            console.log("Uploaded a blob or file!");
          });
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
        productRef.delete().then(() => {
          productRef.put(photoFile).then(function (snapshot) {
            snapshot.ref.getDownloadURL().then(function (url) {
              itemDoc.update({
                photo_url: url,
              });
            });
            console.log("Uploaded a blob or file!");
          });
        });
      }
    } else if (photoInput.files.length == 0) {
      null;
    }
    if (captures.length != 0) {
      for (let i = 0; i < captures.length; i++) {
        let captureFile = captures[i];
        let captureRef = storageRef.child(
          `item${savedItemNo}/${captureFile.name}`
        );
        captureRef.put(captureFile).then(function (snapshot) {
          snapshot.ref
            .getDownloadURL()
            .then(function (url) {
              captures_url_list.push(url);
            })
            .then(() => {
              itemDoc.update({
                captures_url: captures_url_list,
              });
            })
            .then(() => {
              console.log("Uploaded a blob or file!");
              if (i == captures.length - 1) {
                location.href = "/html/1.3.1.1.1-a.html";
              }
            });
        });
      }
    } else if (captures.length == 0) {
      itemDoc
        .update({
          captures_url: captures_url_list,
        })
        .then((result) => {
          location.href = "/html/1.3.1.1.1-a.html";
        })
        .catch((err) => {});
    }
  }
}
function deleteItem() {
  if (confirm("정말로 삭제하시겠습니까?")) {
    itemDoc
      .update({
        captures_url: null,
        photo_url: null,
        deleted: true,
      })
      .then(() => {
        storageRef
          .child(`item${savedItemNo}`)
          .delete()
          .then(function () {
            // File deleted successfully
          })
          .catch(function (error) {
            // Uh-oh, an error occurred!
          });
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      })
      .then(() => {
        location.href = "/html/1.3.1.1.1-b.html";
      });
  } else {
    null;
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
  callPhoto();
  callCaptures();
  handleBtn();
  deleteBtn.addEventListener("click", deleteItem);
  photoInput.addEventListener("change", setPhoto);
  captureInput.addEventListener("change", setCapture);
  uploadBtn.addEventListener("click", saveDB);
  document.addEventListener("keydown", enterkey);
  setInterval(handleSizeBtn, 100);
  setInterval(handleStyleBtn, 100);
}
init();
