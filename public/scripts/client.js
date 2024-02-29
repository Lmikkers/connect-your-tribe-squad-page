console.log("Dit is de client");

const slider = document.querySelector(".slider")
const prevBtn = document.querySelector(".prevBtn");
const nextBtn = document.querySelector(".nextBtn");

prevBtn.addEventListener('click', slideLeft);

function slideLeft() {
    console.log("klikt op previous button (left)")

    slider.scrollBy({
        left: -700, // scroll distance
        behavior: 'smooth'
    });
}   


nextBtn.addEventListener('click', slideRight);

function slideRight() {
    console.log("klikt op next button (right)")

    slider.scrollBy({
        left: 700, // scroll distance
        behavior: 'smooth'
    });
}   