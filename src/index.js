import './css/index.css'
import loadFile from './fileReader'
import QRCode from 'qrcode-svg'
import { mmToPoints, getSVGPathFromObject } from './helper'
import generetePDF from './generetePDF'

const uploadButton = document.getElementById('file-upload')
// guzik do wyłączenia informacji o pliku
const deleteInfoButton = document.getElementById('delete-button')

deleteInfoButton.addEventListener('click', () => {
  const message = document.getElementById('file-info')
  message.remove()
})

uploadButton.addEventListener('click', () => {
  const dataFromFile = loadFile()
  dataFromFile
    .then((result) => {
      // Podział lini w oparciu o kodowanie Windows/Linux/Macos
      const tablica = result.split(/\r\n|\n|\r/)

      const row = tablica.map((el) => {
        return el.split(process.env.SEPARATOR)
      })
      if (row[0].length !== 3) {
        const modal = document.getElementById('error-modal')
        modal.classList.add('is-active')
        const span = document.getElementById('error-message')
        span.innerHTML = 'Zła struktura pliku CSV!'
        const modalErrorButton = document.getElementById('error-modal-button')

        modalErrorButton.addEventListener('click', () => {
          modal.classList.remove('is-active')
        })

        Promise.reject(new Error('Zły format pliku'))
        console.log(row)
      }
      return Promise.resolve(row)
    })
    .then((resArrayRows) => {
      // usuwamy pierwszą linię
      console.log(resArrayRows)
      if (process.env.HEADER) {
        resArrayRows = resArrayRows.filter((el, index) => {
          return index > 0
        })
      }

      resArrayRows.map((el, index) => {
        const qr = new QRCode({
          content: el[0],
          padding: 0,
          container: 'svg',
          ecl: 'L',
          width: mmToPoints(15),
          height: mmToPoints(15),
          join: true
        })
        const svgPath = getSVGPathFromObject(qr)
        return el.push(svgPath)
      })

      // Tutaj mamy tablicę tablic (rekordy / wiersze) wyników z pliku
      const qrcodeList = document.getElementById('qrcode-list')
      // Pętla renderująca HTML na stronie
      for (const [index, value] of resArrayRows.entries()) {
        // tworzymy wrapper dla dokumentu xml-svg
        const el = document.createElement('div')
        el.setAttribute('id', `qr-${index}`)
        qrcodeList.appendChild(el)
        // renderujemy konkretną kolumnę
        const qr = new QRCode({
          content: value[1],
          padding: 0,
          container: 'svg',
          ecl: 'L',
          width: mmToPoints(15),
          height: mmToPoints(15),
          join: true
        })
        // pierwszy element etykiety
        const svg = qr.svg()
        el.innerHTML = svg
        // drugi element etykiety
        const tekst = document.createElement('div')
        tekst.setAttribute('class', `qr-tekst-${index}`)
        tekst.innerHTML = value[2]
        el.appendChild(tekst)
        // trzeci element etykiety
        const opis = document.createElement('div')
        opis.setAttribute('class', `qr-opis-${index}`)
        opis.innerHTML = value[0]
        el.appendChild(opis)
        // czwarty element etykiety
        const nr = document.createElement('div')
        nr.setAttribute('class', `qr-nr-${index}`)
        nr.innerHTML = value[1]
        el.appendChild(nr)
      }
      return Promise.resolve(resArrayRows)
    })
    .then((resArrayRows) => {
      console.log(resArrayRows)
      // Generujemy przycisk do pobrania PDFów
      const pdfButton = document.createElement('button')
      pdfButton.setAttribute('id', 'generete-pdf')
      pdfButton.setAttribute('class', 'button is-primary')
      // pdfButton.setAttribute('type', 'button')
      pdfButton.innerHTML = 'Pobierz PDF'
      // osadzamy button
      const downloadButton = document.getElementById('download-button')
      downloadButton.appendChild(pdfButton)

      const uploadButton = document.getElementById('file-form')
      uploadButton.remove()

      const result = {
        data: resArrayRows,
        pdfButton
      }
      return Promise.resolve(result)
    })
    .then((result) => {
      console.log(result.pdfButton)
      result.pdfButton.addEventListener('click', async () => {
        generetePDF(result.data)
      })
    })
    .catch(reason => {
      console.error(reason)
    })
})
