export async function hasInternet() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos", {
      method: "HEAD",
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function openCenteredPopup(url: string, title: string, w: number, h: number) {
  // taille de l’écran
  const dualScreenLeft =
    window.screenLeft !== undefined ? window.screenLeft : window.screenX;
  const dualScreenTop =
    window.screenTop !== undefined ? window.screenTop : window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;

  // calcul de la position centrée
  const left = width / 2 - w / 2 + dualScreenLeft;
  const top = height / 2 - h / 2 + dualScreenTop;

  const newWindow = window.open(
    url,
    title,
    `scrollbars=yes, width=${w}, height=${h}, top=${top}, left=${left}, 
     menubar=no,toolbar=no,location=no,status=no,resizable=yes`
  );

  if (newWindow && newWindow.focus) {
    newWindow.focus();
  }
}
