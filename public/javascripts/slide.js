function anotherSlide() {
    $("#bg-one").fadeToggle();
    //delay(300);
    $("#bg-two").fadeToggle();

    setTimeout(anotherSlide, 5000);
}
anotherSlide()