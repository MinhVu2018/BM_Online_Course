function slide() {
    var picOne = document.getElementById("bg-one");
    var picTwo = document.getElementById("bg-two");

    if (picOne.style.display == 'none') {
        picOne.style.display = 'inline-block'
        picTwo.style.display = 'none'
    } else {
        picOne.style.display = 'none'
        picTwo.style.display = 'inline-block'
    }
    setTimeout(slide, 5000);
}

slide();