import { mmToPoints } from './helper'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import download from 'downloadjs'

function generetePDF (arrData, settings) {
  if (!Array.isArray(arrData)) {
    throw new Error('Not an array!')
  }
  async function pdf () {
    const pdfDoc = await PDFDocument.create()
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    arrData.forEach(el => {
      const page = pdfDoc.addPage()
      page.setSize(mmToPoints(60), mmToPoints(24))
      // W czwartej kolumnie jest informacja o ścieżce SVG
      page.drawSvgPath(el[3], {
        x: mmToPoints(2),
        y: mmToPoints(20),
        color: rgb(1, 0.44, 0.2)
      })
      // W pierwszej kolumnie jest numer inwentarzowy
      page.drawText(el[0], {
        x: mmToPoints(20),
        y: mmToPoints(14),
        size: 10,
        font: helveticaFont,
        color: rgb(1, 0.44, 0.2)
      })
      // W drugiej kolumnie jest opis
      page.drawText(el[1], {
        x: mmToPoints(20),
        y: mmToPoints(10),
        size: 8,
        font: helveticaFont,
        color: rgb(1, 0.44, 0.2)
      })
      // W trzeciej kolumnie jest data
      page.drawText(el[2], {
        x: mmToPoints(20),
        y: mmToPoints(6),
        size: 6,
        font: helveticaFont,
        color: rgb(1, 0.44, 0.2)
      })
    })
    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, 'plik.pdf', 'application/pdf')
  }
  pdf()
}

export default generetePDF
