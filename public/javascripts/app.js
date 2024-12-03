let users = document.querySelectorAll('.user')
let textContainer = document.querySelector('.textContainer')
let dummyText = document.querySelector('.dummyText')

users.forEach(e=>{
    e.addEventListener('click', ()=>{
        dummyText.style.display = 'none'
        textContainer.style.display = 'block'
    })
})

console.log('hiiii')