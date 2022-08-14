const trashCan = document.querySelectorAll('.fa-trash')
const thumbsUp = document.querySelectorAll('.fa-thumbs-up')

Array.from(trashCan).forEach((element) => {
  element.addEventListener('click', deleteRecommendation)
})

Array.from(thumbsUp).forEach((element) => {
  element.addEventListener('click', addOneLike)
})

async function deleteRecommendation() {
  const mediaType = this.parentNode.childNodes[1].innerText
  const mediaName = this.parentNode.childNodes[3].innerText
  try {
    const res = await fetch('deleteRecommendation', {
        method: 'delete',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'mediaTypeJS': mediaType,
          'mediaNameJS': mediaName
        })
      })
    const data = await res.json()
    console.log(data)
    location.reload()
  }
  catch(err) {
    console.log(err)
  }
}

async function addOneLike() {
  const mediaType = this.parentNode.childNodes[1].innerText
  const mediaName = this.parentNode.childNodes[3].innerText
  const mediaLikes = Number(this.parentNode.childNodes[7].innerText)
  try {
      const res = await fetch('addOneLike', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'mediaTypeJS': mediaType,
            'mediaNameJS': mediaName,
            'mediaLikesJS': mediaLikes
          })
        })
       const data = await res.json()
       console.log(data)
      location.reload()
  }
  catch(err){
      console.log(err)
  }
}