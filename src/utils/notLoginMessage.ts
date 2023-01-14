import messageImage from "@/assets/icons/home_tixing.png";

const html5 = `
			<div class="not-login-message">
        <img src="${messageImage}" alt="" />
        <div>您还未登陆</div>
		</div>
		`;

export default function () {
  const NotLoginBox = document.querySelector("#not-login-message");
  if (NotLoginBox) return;
  const body: any = document.body;
  const div: HTMLDivElement = document.createElement("div");
  div.setAttribute("id", "not-login-message");
  div.innerHTML = html5;
  body.insertBefore(div, body.childNodes[0]);

  setTimeout(() => {
    const el = document.querySelector("#not-login-message");
    el && el.parentNode?.removeChild(el);
  }, 3000);
}
