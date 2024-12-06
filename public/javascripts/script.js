let users = document.querySelectorAll('.user')
let textContainer = document.querySelector('.textContainer')
let dummyText = document.querySelector('.dummyText')


var reciever_id

users.forEach(e=>{
    e.addEventListener('click', (elem)=>{
        elem.stopPropagation()
        dummyText.style.display = 'none'
        textContainer.style.display = 'block'
        console.log(elem.currentTarget.id)
    })
})
