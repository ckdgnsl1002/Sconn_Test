function addChannel() {
  Kakao.Channel.addChannel({
    channelPublicId: "_ZTQes",
  });
}
function loginWithKakao() {
  Kakao.Auth.authorize({
    redirectUri: "https://sconncurating.com",
  });
}
// 아래는 데모를 위한 UI 코드입니다.
displayToken();
function displayToken() {
  const token = getCookie("authorize-access-token");
  if (token) {
    Kakao.Auth.setAccessToken(token);
    Kakao.Auth.getStatusInfo(({ status }) => {
      if (status === "connected") {
        document.getElementById("token-result").innerText =
          "login success. token: " + Kakao.Auth.getAccessToken();
      } else {
        Kakao.Auth.setAccessToken(null);
      }
    });
  }
}
function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}
