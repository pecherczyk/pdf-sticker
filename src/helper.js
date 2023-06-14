import QRCode from 'qrcode-svg'

export function mmToPoints (mm) {
  return mm * 0.03937 * 72
}

export function getSVGPath (id) {
  const qrWrap = document.getElementById(id)
  // Pobranie wszystkich dzieci
  const children = qrWrap.children
  const arr = Array.from(children)

  const svgElement = arr.filter((el) => {
    return el.tagName === 'svg'
  })
  // zwracamy ścieżkę z elementu:
  return svgElement[0].lastElementChild.getAttribute('d')
}

export function getSVGPathFromObject (qrObject) {
  if (!(qrObject instanceof QRCode)) {
    throw new Error('Not a qrObject!')
  }
  const str = qrObject.svg()
  const container = document.createElement('div')
  container.innerHTML = str
  // Magia żeby się dostać do elementu path
  const path = container.firstElementChild.children[1].getAttribute('d')
  return path
}
