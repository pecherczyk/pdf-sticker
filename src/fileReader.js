//  Get data from input form loadFile returns promise

function loadFile () {
  return new Promise((resolve, reject) => {
    const input = document.getElementById('file-upload')

    input.addEventListener('change', function (event) {
      const [file] = input.files

      if (file && file.type !== 'text/plain') {
        const modal = document.getElementById('error-modal')
        modal.classList.add('is-active')
        const span = document.getElementById('error-message')
        let errorTekst = file.type

        if (file.type === '') {
          errorTekst = 'Nieznany format pliku'
        }

        span.innerHTML = errorTekst
        const modalErrorButton = document.getElementById('error-modal-button')
        modalErrorButton.addEventListener('click', () => {
          modal.classList.remove('is-active')
        })
        reject(new Error('Bad file type!'))
      }

      const reader = new window.FileReader()
      reader.addEventListener('load', function (e) {
        resolve(e.target.result)
      })
      reader.addEventListener('progress', function (e) {
        // console.log(e)
      })
      reader.readAsText(file)
    })
  })
}

export default loadFile
